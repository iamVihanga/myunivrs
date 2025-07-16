import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@/db";
import type { AppRouteHandler } from "@/types";
import { comment } from "@repo/database/schemas";
import type {
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  ListRoute,
  UpdateRoute,
} from "./comment.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    postId,
  } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  try {
    // Get parent comments first
    const parentComments = await db
      .select()
      .from(comment)
      .where(
        and(
          postId ? eq(comment.postId, postId) : undefined,
          isNull(comment.parentCommentId)
        )
      )
      .orderBy(sort === "asc" ? comment.createdAt : desc(comment.createdAt))
      .limit(limitNum)
      .offset(offset);

    // Get replies for these parent comments
    const replies =
      parentComments.length > 0
        ? await db
            .select()
            .from(comment)
            .where(
              and(
                postId ? eq(comment.postId, postId) : undefined,
                inArray(
                  comment.parentCommentId,
                  parentComments.map((c) => c.id)
                )
              )
            )
            .orderBy(comment.createdAt)
        : [];

    // Structure comments with their replies
    const commentsWithReplies = parentComments.map((parent) => ({
      ...parent,
      replies: replies.filter((reply) => reply.parentCommentId === parent.id),
    }));

    // Get total count of parent comments
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(comment)
      .where(
        and(
          postId ? eq(comment.postId, postId) : undefined,
          isNull(comment.parentCommentId)
        )
      );
    const count = countResult?.[0]?.count ?? 0;

    return c.json(
      {
        data: commentsWithReplies,
        meta: {
          currentPage: pageNum,
          totalPages: Math.ceil(count / limitNum),
          totalCount: Number(count),
          limit: limitNum,
        },
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error listing comments:", error);
    return c.json(
      { message: "Failed to list comments" },
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
    // Validate required fields
    if (!data.content?.trim() || !data.postId?.trim()) {
      return c.json(
        { message: "Content and postId are required" },
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      );
    }

    // Validate parent comment if provided
    if (data.parentCommentId?.trim()) {
      const [parentComment] = await db
        .select()
        .from(comment)
        .where(eq(comment.id, data.parentCommentId))
        .limit(1);

      if (!parentComment) {
        return c.json(
          { message: "Parent comment not found" },
          HttpStatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      if (parentComment.postId !== data.postId) {
        return c.json(
          { message: "Parent comment must belong to the same post" },
          HttpStatusCodes.UNPROCESSABLE_ENTITY
        );
      }
    }

    const [inserted] = await db
      .insert(comment)
      .values({
        content: data.content.trim(),
        postId: data.postId,
        parentCommentId: data.parentCommentId?.trim() || null,
        createdBy: session.userId,
        createdAt: new Date(),
        voteScore: 0,
      })
      .returning();

    if (!inserted) {
      throw new Error("Failed to insert comment");
    }

    return c.json(inserted, HttpStatusCodes.CREATED);
  } catch (error) {
    console.error("Error creating comment:", error);
    return c.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to create comment",
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  try {
    const [commentData] = await db
      .select()
      .from(comment)
      .where(eq(comment.id, id))
      .limit(1);

    if (!commentData) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Get replies if this is a parent comment
    const replies = await db
      .select()
      .from(comment)
      .where(eq(comment.parentCommentId, id))
      .orderBy(comment.createdAt);

    return c.json(
      {
        ...commentData,
        replies: replies.length > 0 ? replies : undefined,
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error fetching comment:", error);
    return c.json(
      {
        error: {
          issues: [
            {
              code: "internal_server_error",
              path: [],
              message:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch comment",
            },
          ],
          name: "InternalServerError",
        },
        success: false,
      },
      422
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
    const [comment_to_delete] = await db
      .select()
      .from(comment)
      .where(eq(comment.id, id))
      .limit(1);

    if (!comment_to_delete) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    if (comment_to_delete.createdBy !== session.userId) {
      return c.json(
        { message: "Not authorized to delete this comment" },
        HttpStatusCodes.FORBIDDEN
      );
    }

    // Delete all replies first
    await db.delete(comment).where(eq(comment.parentCommentId, id));

    // Then delete the comment itself
    await db.delete(comment).where(eq(comment.id, id));

    return new Response(null, { status: HttpStatusCodes.NO_CONTENT });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return c.json(
      { message: "Failed to delete comment" },
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
    const [existingComment] = await db
      .select()
      .from(comment)
      .where(eq(comment.id, id));

    if (!existingComment) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    if (existingComment.createdBy !== session.userId) {
      return c.json(
        { message: "Not authorized to update this comment" },
        HttpStatusCodes.FORBIDDEN
      );
    }

    const [updated] = await db
      .update(comment)
      .set({
        content: data.content,
        // Don't allow updating other fields
      })
      .where(eq(comment.id, id))
      .returning();

    if (!updated) {
      // If update failed for some reason, return 404 (not found)
      return c.json(
        { message: "Failed to update comment" },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(updated, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Error updating comment:", error);
    return c.json(
      { message: "Failed to update comment" },
      HttpStatusCodes.FORBIDDEN // Changed from UNPROCESSABLE_ENTITY (422) to FORBIDDEN (403)
    );
  }
};
