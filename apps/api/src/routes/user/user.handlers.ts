import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@/db";
import type { AppRouteHandler } from "@/types";
import { connections, post, user } from "@repo/database/schemas";
import type {
  BanRoute,
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  ListRoute,
  UnbanRoute,
  UpdateRoute,
} from "./user.routes";
import type { User, UserWithMeta } from "./user.schema";

// Type for the database query result
interface UserQueryResult {
  user: User;
  followers: number | null;
  following: number | null;
  posts: number | null;
}

// Helper function for user queries with stats
const getUserWithStats = (conditions: any[] = []) => {
  return db
    .select({
      user: user,
      followers: sql<number>`COALESCE(COUNT(DISTINCT CASE
        WHEN ${connections.receiverId} = ${user.id}
        AND ${connections.status} = 'accepted'
        THEN ${connections.id} END), 0)::int`,
      following: sql<number>`COALESCE(COUNT(DISTINCT CASE
        WHEN ${connections.senderId} = ${user.id}
        AND ${connections.status} = 'accepted'
        THEN ${connections.id} END), 0)::int`,
      posts: sql<number>`COALESCE(COUNT(DISTINCT CASE
        WHEN ${post.createdBy} = ${user.id}
        THEN ${post.id} END), 0)::int`,
    })
    .from(user)
    .leftJoin(
      connections,
      or(eq(connections.senderId, user.id), eq(connections.receiverId, user.id))
    )
    .leftJoin(post, eq(post.createdBy, user.id))
    .where(and(...conditions))
    .groupBy(user.id);
};

// Helper function to format user data
const formatUserData = (result: UserQueryResult): UserWithMeta => {
  const { user: userData, followers, following, posts } = result;

  return {
    ...userData,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt,
    banExpires: userData.banExpires,
    connections: {
      followers: Number(followers) || 0,
      following: Number(following) || 0,
    },
    posts: Number(posts) || 0,
  };
};

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search,
    role,
    banned,
  } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  try {
    // Build base query without pagination
    const baseQuery = db.select().from(user);
    const conditions = [];

    // Add filters
    if (role) conditions.push(eq(user.role, role));
    if (banned !== undefined) conditions.push(eq(user.banned, banned));
    if (search) {
      conditions.push(
        or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`))
      );
    }

    if (conditions.length > 0) {
      baseQuery.where(and(...conditions));
    }

    // Execute queries in parallel
    const [users, countResult] = await Promise.all([
      getUserWithStats(conditions)
        .orderBy(sort === "asc" ? user.createdAt : desc(user.createdAt))
        .limit(limitNum)
        .offset(offset),
      db
        .select({
          count: sql<number>`count(distinct ${user.id})::int`,
        })
        .from(user)
        .where(and(...conditions)),
    ]);

    // Ensure we have valid results
    if (!users || !countResult || !countResult[0]) {
      return c.json({
        data: [],
        meta: {
          currentPage: pageNum,
          totalPages: 0,
          totalCount: 0,
          limit: limitNum,
        },
        message: "No users found",
      });
    }

    const totalCount = Number(countResult[0].count);

    // Format response
    return c.json({
      data: users.map((result) => formatUserData(result)),
      meta: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount: totalCount,
        limit: limitNum,
      },
      message: "Users retrieved successfully",
    });
  } catch (error) {
    console.error("Error listing users:", error);
    return c.json(
      {
        data: [],
        meta: {
          currentPage: pageNum,
          totalPages: 0,
          totalCount: 0,
          limit: limitNum,
        },
        message: "Failed to list users",
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const data = c.req.valid("json");
  const session = c.get("session");

  // if (session?.user?.role !== "admin") {
  //   return c.json(
  //     { message: "Only admins can create users" },
  //     HttpStatusCodes.FORBIDDEN
  //   );
  // }

  try {
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, data.email))
      .limit(1);

    if (existingUser.length) {
      return c.json(
        { message: "Email already exists" },
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      );
    }

    const [created] = await db
      .insert(user)
      .values({
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        emailVerified: data.emailVerified,
        image: data.image,
        role: data.role,
        banned: data.banned,
        banReason: data.banReason,
        banExpires: data.banExpires ? new Date(data.banExpires) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return c.json(created, HttpStatusCodes.CREATED);
  } catch (error) {
    console.error("Error creating user:", error);
    return c.json(
      { message: "Failed to create user" },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  try {
    const [result] = await getUserWithStats([eq(user.id, id)]);

    if (!result) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(formatUserData(result));
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json(
      { message: "Failed to fetch user" },
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

  if (session.userId !== id && session.role !== "admin") {
    return c.json(
      { message: "Not authorized to update this user" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  try {
    const [updated] = await db
      .update(user)
      .set({
        ...data,
        banExpires: data.banExpires ? new Date(data.banExpires) : null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, id))
      .returning();

    if (!updated) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(updated);
  } catch (error) {
    console.error("Error updating user:", error);
    return c.json(
      { message: "Failed to update user" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const ban: AppRouteHandler<BanRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const data = c.req.valid("json");
  const session = c.get("session");

  if (session?.user?.role !== "admin") {
    return c.json(
      { message: "Only admins can ban users" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  try {
    const [banned] = await db
      .update(user)
      .set({
        banned: true,
        banReason: data.banReason,
        banExpires: data.banExpires ? new Date(data.banExpires) : null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, id))
      .returning();

    if (!banned) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(
      {
        data: banned,
        message: "User banned successfully",
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error banning user:", error);
    return c.json(
      { message: "Failed to ban user" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const unban: AppRouteHandler<UnbanRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (session?.user?.role !== "admin") {
    return c.json(
      { message: "Only admins can unban users" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  try {
    const [unbanned] = await db
      .update(user)
      .set({
        banned: false,
        banReason: null,
        banExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, id))
      .returning();

    if (!unbanned) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(
      {
        data: unbanned,
        message: "User unbanned successfully",
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error unbanning user:", error);
    return c.json(
      { message: "Failed to unban user" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const remove: AppRouteHandler<DeleteRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (session?.role !== "admin") {
    return c.json(
      { message: "Only admins can delete users" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  try {
    await db.delete(user).where(eq(user.id, id));
    return c.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return c.json(
      { message: "Failed to delete user" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
