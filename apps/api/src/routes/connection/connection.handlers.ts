import { and, desc, eq, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@/db";
import type { AppRouteHandler } from "@/types";
import { connections, user } from "@repo/database/schemas";
import type {
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  ListRoute,
  UpdateRoute,
} from "./connection.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    status,
    type,
  } = c.req.valid("query");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  try {
    // Build base query conditions
    const conditions = [];

    // Filter by connection type (sent/received)
    if (type === "sent") {
      conditions.push(eq(connections.senderId, session.userId));
    } else if (type === "received") {
      conditions.push(eq(connections.receiverId, session.userId));
    } else {
      // If no type specified, show both sent and received
      conditions.push(
        or(
          eq(connections.senderId, session.userId),
          eq(connections.receiverId, session.userId)
        )
      );
    }

    // Filter by status if provided
    if (status) {
      conditions.push(eq(connections.status, status));
    }

    // Execute query with joins for user details
    const query = db
      .select({
        connection: connections,
        sender: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
        receiver: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(connections)
      .leftJoin(user, eq(connections.senderId, user.id))
      .leftJoin(user, eq(connections.receiverId, user.id))
      .where(and(...conditions))
      .orderBy(
        sort === "asc" ? connections.createdAt : desc(connections.createdAt)
      )
      .limit(limitNum)
      .offset(offset);

    const [connectionsList, countResult] = await Promise.all([
      query,
      db
        .select({ count: sql<number>`count(*)` })
        .from(connections)
        .where(and(...conditions)),
    ]);
    const count = countResult && countResult[0] ? countResult[0].count : 0;

    // Format response
    const normalizedConnections = connectionsList.map(
      ({ connection, sender, receiver }) => ({
        ...connection,
        createdAt:
          connection.createdAt instanceof Date
            ? connection.createdAt.toISOString()
            : connection.createdAt,
        updatedAt:
          connection.updatedAt instanceof Date
            ? connection.updatedAt.toISOString()
            : connection.updatedAt,
        sender,
        receiver,
      })
    );

    return c.json({
      data: normalizedConnections,
      meta: {
        currentPage: pageNum,
        totalPages: Math.ceil(Number(count) / limitNum),
        totalCount: Number(count),
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error("Error listing connections:", error);
    return c.json(
      { message: "Failed to list connections" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Update the create handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const data = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  try {
    // Check if connection already exists
    const existingConnection = await db
      .select()
      .from(connections)
      .where(
        or(
          and(
            eq(connections.senderId, session.userId),
            eq(connections.receiverId, data.receiverId)
          ),
          and(
            eq(connections.senderId, data.receiverId),
            eq(connections.receiverId, session.userId)
          )
        )
      )
      .limit(1);

    if (existingConnection.length > 0) {
      return c.json(
        { message: "Connection already exists" },
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      );
    }

    // Create new connection with UUID
    const [created] = await db
      .insert(connections)
      .values({
        id: crypto.randomUUID(), // Add UUID for id
        senderId: session.userId,
        receiverId: data.receiverId,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Return with joined user data
    if (!created || !created.id) {
      return c.json(
        { message: "Failed to create connection" },
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      );
    }

    const connection = await db
      .select({
        connection: connections,
        sender: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
        receiver: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(connections)
      .leftJoin(user, eq(connections.senderId, user.id))
      .leftJoin(user, eq(connections.receiverId, user.id))
      .where(eq(connections.id, created.id))
      .limit(1);

    if (!connection.length) {
      return c.json(
        { message: "Failed to create connection" },
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      );
    }

    if (!connection[0]) {
      return c.json(
        { message: "Failed to create connection" },
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      );
    }
    const { connection: connectionData, sender, receiver } = connection[0];

    return c.json(
      {
        ...connectionData,
        createdAt:
          connectionData.createdAt instanceof Date
            ? connectionData.createdAt.toISOString()
            : connectionData.createdAt,
        updatedAt:
          connectionData.updatedAt instanceof Date
            ? connectionData.updatedAt.toISOString()
            : connectionData.updatedAt,
        sender,
        receiver,
      },
      HttpStatusCodes.CREATED
    );
  } catch (error) {
    console.error("Error creating connection:", error);
    return c.json(
      { message: "Failed to create connection" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  try {
    const connection = await db
      .select({
        connection: connections,
        sender: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
        receiver: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(connections)
      .leftJoin(user, eq(connections.senderId, user.id))
      .leftJoin(user, eq(connections.receiverId, user.id))
      .where(eq(connections.id, id))
      .limit(1);

    if (!connection.length) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    const connObj = connection[0];
    if (
      !connObj ||
      !("connection" in connObj) ||
      !connObj.connection
    ) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }
    const { connection: connectionData, sender, receiver } = connObj;

    return c.json({
      ...connectionData,
      createdAt:
        connectionData.createdAt instanceof Date
          ? connectionData.createdAt.toISOString()
          : connectionData.createdAt,
      updatedAt:
        connectionData.updatedAt instanceof Date
          ? connectionData.updatedAt.toISOString()
          : connectionData.updatedAt,
      sender,
      receiver,
    });
  } catch (error) {
    console.error("Error fetching connection:", error);
    return c.json(
      { message: "Failed to fetch connection" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const data = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  try {
    const existingConnection = await db
      .select()
      .from(connections)
      .where(eq(connections.id, id))
      .limit(1);

    if (!existingConnection.length) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Only receiver can update status
    if (
      !existingConnection[0] ||
      existingConnection[0].receiverId !== session.userId
    ) {
      return c.json(
        { message: "Not authorized to update this connection" },
        HttpStatusCodes.FORBIDDEN
      );
    }

    const [updated] = await db
      .update(connections)
      .set({
        status: data.status,
        updatedAt: new Date(),
      })
      .where(eq(connections.id, id))
      .returning();

    return c.json(updated);
  } catch (error) {
    console.error("Error updating connection:", error);
    return c.json(
      { message: "Failed to update connection" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const remove: AppRouteHandler<DeleteRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  try {
    const existingConnection = await db
      .select()
      .from(connections)
      .where(eq(connections.id, id))
      .limit(1);

    if (!existingConnection.length) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Only sender or receiver can delete the connection
    if (
      existingConnection[0] &&
      existingConnection[0].senderId !== session.userId &&
      existingConnection[0].receiverId !== session.userId
    ) {
      return c.json(
        { message: "Not authorized to delete this connection" },
        HttpStatusCodes.FORBIDDEN
      );
    }

    await db.delete(connections).where(eq(connections.id, id));

    return c.json({ message: "Connection deleted successfully" });
  } catch (error) {
    console.error("Error deleting connection:", error);
    return c.json(
      { message: "Failed to delete connection" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
