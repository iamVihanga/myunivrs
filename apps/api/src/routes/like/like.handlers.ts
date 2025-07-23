import { db } from "@/db";
import { AppRouteHandler } from "@/types";
import { like } from "@repo/database";
import { and, desc, eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import {
  CreateRoute,
  GetCountRoute,
  GetOneRoute,
  GetUserStatusRoute,
  ListRoute,
  RemoveRoute,
  ToggleRoute,
  UpdateRoute,
} from "./like.routes";

// List likes entries route handler
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search,
    postId,
    commentId,
    userId,
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const query = db.query.like.findMany({
    limit: limitNum,
    offset,
    where: (fields, { eq, and, or }) => {
      const conditions = [];

      // Filter by postId if provided
      if (postId) {
        conditions.push(eq(fields.postId, postId));
      }

      // Filter by commentId if provided
      if (commentId) {
        conditions.push(eq(fields.commentId, commentId));
      }

      // Filter by userId if provided
      if (userId) {
        conditions.push(eq(fields.userId, userId));
      }

      // Filter by active status
      conditions.push(eq(fields.isActive, true));

      return conditions.length ? and(...conditions) : undefined;
    },
    orderBy: (fields) => {
      // Handle sorting direction
      if (sort.toLowerCase() === "asc") {
        return fields.createdAt;
      }
      return desc(fields.createdAt);
    },
  });

  // Get total count for pagination metadata
  const whereConditions = [];
  if (postId) whereConditions.push(eq(like.postId, postId));
  if (commentId) whereConditions.push(eq(like.commentId, commentId));
  if (userId) whereConditions.push(eq(like.userId, userId));
  whereConditions.push(eq(like.isActive, true));

  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(like)
    .where(whereConditions.length ? and(...whereConditions) : undefined);

  const [likeEntities, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: likeEntities.map((likeEntry) => ({
        ...likeEntry,
        postId: likeEntry.postId ?? undefined,
        commentId: likeEntry.commentId ?? undefined,
        isActive: likeEntry.isActive ?? undefined,
        createdAt:
          likeEntry.createdAt instanceof Date
            ? likeEntry.createdAt.toISOString()
            : likeEntry.createdAt,
      })),
      meta: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
      },
    },
    HttpStatusCodes.OK
  );
};

// Create new like entry route handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const likeEntry = c.req.valid("json");
  const session = c.get("session");

  // Check if user is authenticated
  if (!session) {
    return c.json(
      {
        message: "This user is unauthenticated, You need to sign in first !",
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if like already exists
  const existingLike = await db.query.like.findFirst({
    where: (fields, { eq, and, or }) => {
      const conditions = [
        eq(fields.userId, likeEntry.userId),
        eq(fields.isActive, true),
      ];

      if (likeEntry.postId) {
        conditions.push(eq(fields.postId, likeEntry.postId));
      }

      if (likeEntry.commentId) {
        conditions.push(eq(fields.commentId, likeEntry.commentId));
      }

      return and(...conditions);
    },
  });

  if (existingLike) {
    return c.json(
      {
        message: "You have already liked this item",
      },
      HttpStatusCodes.CONFLICT
    );
  }

  const [inserted] = await db.insert(like).values(likeEntry).returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single like entry route handler
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const likeEntry = await db.query.like.findFirst({
    where: eq(like.id, id),
  });

  if (!likeEntry)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );

  return c.json(
    {
      userId: likeEntry.userId,
      id: likeEntry.id,
      createdAt:
        likeEntry.createdAt instanceof Date
          ? likeEntry.createdAt.toISOString()
          : (likeEntry.createdAt ?? null),
      isActive: likeEntry.isActive ?? false,
      postId: likeEntry.postId ?? undefined,
      commentId: likeEntry.commentId ?? undefined,
    },
    HttpStatusCodes.OK
  );
};

// Update like entry route handler
export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if like entry exists
  const existingEntry = await db.query.like.findFirst({
    where: eq(like.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Update the like entry
  const [updated] = await db
    .update(like)
    .set(body)
    .where(eq(like.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete like entry route handler
export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if like entry exists
  const existingEntry = await db.query.like.findFirst({
    where: eq(like.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Delete the like entry
  await db.delete(like).where(eq(like.id, id));

  return c.json(
    { message: "Like entry deleted successfully" },
    HttpStatusCodes.OK
  );
};

// Toggle like/unlike route handler
export const toggle: AppRouteHandler<ToggleRoute> = async (c) => {
  const toggleData = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: "This user is unauthenticated, You need to sign in first !",
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if like already exists
  const existingLike = await db.query.like.findFirst({
    where: (fields, { eq, and }) => {
      const conditions = [
        eq(fields.userId, toggleData.userId),
        eq(fields.isActive, true),
      ];

      if (toggleData.postId) {
        conditions.push(eq(fields.postId, toggleData.postId));
      }

      if (toggleData.commentId) {
        conditions.push(eq(fields.commentId, toggleData.commentId));
      }

      return and(...conditions);
    },
  });

  if (existingLike) {
    // Unlike: Set isActive to false (soft delete)
    const [updated] = await db
      .update(like)
      .set({ isActive: false })
      .where(eq(like.id, existingLike.id))
      .returning();

    const normalizedLike = updated
      ? {
          userId: updated.userId,
          id: updated.id,
          createdAt:
            updated.createdAt instanceof Date
              ? updated.createdAt.toISOString()
              : (updated.createdAt ?? null),
          isActive: updated.isActive ?? false,
          postId: updated.postId ?? undefined,
          commentId: updated.commentId ?? undefined,
        }
      : undefined;

    return c.json(
      {
        message: "Item unliked successfully",
        action: "unliked" as const,
        like: normalizedLike,
      },
      HttpStatusCodes.OK
    );
  } else {
    // Like: Create new like entry
    const [inserted] = await db.insert(like).values(toggleData).returning();

    const normalizedLike = inserted
      ? {
          userId: inserted.userId,
          id: inserted.id,
          createdAt:
            inserted.createdAt instanceof Date
              ? inserted.createdAt.toISOString()
              : (inserted.createdAt ?? null),
          isActive: inserted.isActive ?? false,
          postId: inserted.postId ?? undefined,
          commentId: inserted.commentId ?? undefined,
        }
      : undefined;

    return c.json(
      {
        message: "Item liked successfully",
        action: "liked" as const,
        like: normalizedLike,
      },
      HttpStatusCodes.OK
    );
  }
};

// Get like count route handler
export const getCount: AppRouteHandler<GetCountRoute> = async (c) => {
  const { postId, commentId, userId } = c.req.valid("query");

  // Build where conditions
  const whereConditions = [eq(like.isActive, true)];

  if (postId) {
    whereConditions.push(eq(like.postId, postId));
  }

  if (commentId) {
    whereConditions.push(eq(like.commentId, commentId));
  }

  // Get all likes for the item
  const likesQuery = db
    .select()
    .from(like)
    .where(and(...whereConditions));

  const likes = await likesQuery;

  // Count upvotes and downvotes
  let upvotes = 0;
  let downvotes = 0;
  let userVote = null;

  likes.forEach((likeEntry) => {
    // If you have voteType field, use it. Otherwise, treat all as upvotes
    const voteType = likeEntry.voteType || "upvote";

    if (voteType === "upvote") {
      upvotes++;
    } else if (voteType === "downvote") {
      downvotes++;
    }

    // Check user's vote
    if (userId && likeEntry.userId === userId) {
      userVote = voteType;
    }
  });

  return c.json(
    {
      postId,
      commentId,
      upvotes,
      downvotes,
      count: upvotes - downvotes, // Net score
      userVote,
      userHasLiked: !!userVote, // For backward compatibility
    },
    HttpStatusCodes.OK
  );
};

// Get user like status route handler
export const getUserStatus: AppRouteHandler<GetUserStatusRoute> = async (c) => {
  const { postId, commentId, userId } = c.req.valid("query");
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if user has liked
  const userLike = await db.query.like.findFirst({
    where: (fields, { eq, and }) => {
      const conditions = [eq(fields.userId, userId), eq(fields.isActive, true)];

      if (postId) {
        conditions.push(eq(fields.postId, postId));
      }

      if (commentId) {
        conditions.push(eq(fields.commentId, commentId));
      }

      return and(...conditions);
    },
  });

  return c.json(
    {
      postId,
      commentId,
      userId,
      hasLiked: !!userLike,
    },
    HttpStatusCodes.OK
  );
};
