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
    const conditions = [];

    // Filter by connection type (sent/received)
    if (type === "sent") {
      conditions.push(eq(connections.senderId, session.userId));
    } else if (type === "received") {
      conditions.push(eq(connections.receiverId, session.userId));
    } else {
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

    // Fix the join query - need separate joins for sender and receiver
    const query = db
      .select({
        connection: connections,
        senderUser: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(connections)
      .leftJoin(user, eq(connections.senderId, user.id))
      .where(and(...conditions))
      .orderBy(
        sort === "asc" ? connections.createdAt : desc(connections.createdAt)
      )
      .limit(limitNum)
      .offset(offset);

    const [connectionsList, countResult] = await Promise.all([
      query,
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(connections)
        .where(and(...conditions)),
    ]);
    const count = countResult && countResult[0] ? countResult[0].count : 0;

    // Get receiver details separately
    const connectionsWithUsers = await Promise.all(
      connectionsList.map(async ({ connection, senderUser }) => {
        const [receiverUser] = await db
          .select({
            id: user.id,
            name: user.name,
            image: user.image,
          })
          .from(user)
          .where(eq(user.id, connection.receiverId))
          .limit(1);

        return {
          ...connection,
          createdAt: connection.createdAt
            ? connection.createdAt.toISOString()
            : null,
          updatedAt: connection.updatedAt
            ? connection.updatedAt.toISOString()
            : null,
          sender: senderUser || {
            id: connection.senderId,
            name: "",
            image: null,
          },
          receiver: receiverUser || {
            id: connection.receiverId,
            name: "",
            image: null,
          },
        };
      })
    );

    return c.json(
      {
        data: connectionsWithUsers,
        meta: {
          currentPage: pageNum,
          totalPages: Math.ceil(Number(count) / limitNum),
          totalCount: Number(count),
          limit: limitNum,
        },
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error listing connections:", error);
    return c.json(
      { message: "Failed to list connections" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

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

    // Create new connection - don't specify ID, let database generate it
    const [created] = await db
      .insert(connections)
      .values({
        senderId: session.userId,
        receiverId: data.receiverId,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    if (!created) {
      return c.json(
        { message: "Failed to create connection" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    // Get sender and receiver details
    const [senderUser] = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
      })
      .from(user)
      .where(eq(user.id, created.senderId))
      .limit(1);

    const [receiverUser] = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
      })
      .from(user)
      .where(eq(user.id, created.receiverId))
      .limit(1);

    return c.json(
      {
        ...created,
        createdAt: created.createdAt?.toISOString(),
        updatedAt: created.updatedAt?.toISOString(),
        sender: senderUser || { id: created.senderId, name: "", image: null },
        receiver: receiverUser || {
          id: created.receiverId,
          name: "",
          image: null,
        },
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
    const [connection] = await db
      .select()
      .from(connections)
      .where(eq(connections.id, id))
      .limit(1);

    if (!connection) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Get sender and receiver details
    const [senderUser] = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
      })
      .from(user)
      .where(eq(user.id, connection.senderId))
      .limit(1);

    const [receiverUser] = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
      })
      .from(user)
      .where(eq(user.id, connection.receiverId))
      .limit(1);

    return c.json({
      ...connection,
      createdAt: connection.createdAt?.toISOString(),
      updatedAt: connection.updatedAt?.toISOString(),
      sender: senderUser || { id: connection.senderId, name: "", image: null },
      receiver: receiverUser || {
        id: connection.receiverId,
        name: "",
        image: null,
      },
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
    const [existingConnection] = await db
      .select()
      .from(connections)
      .where(eq(connections.id, id))
      .limit(1);

    if (!existingConnection) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Only receiver can update status
    if (existingConnection.receiverId !== session.userId) {
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
    const [existingConnection] = await db
      .select()
      .from(connections)
      .where(eq(connections.id, id))
      .limit(1);

    if (!existingConnection) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Only sender or receiver can delete the connection
    if (
      existingConnection.senderId !== session.userId &&
      existingConnection.receiverId !== session.userId
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
