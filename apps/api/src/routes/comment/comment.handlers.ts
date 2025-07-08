import { and, desc, eq, sql } from "drizzle-orm";
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
    parentCommentId,
  } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  const whereConditions = [];
  if (postId) whereConditions.push(eq(comment.postId, postId));
  if (parentCommentId)
    whereConditions.push(eq(comment.parentCommentId, parentCommentId));

  const query = db.query.comment.findMany({
    limit: limitNum,
    offset,
    where: whereConditions.length ? and(...whereConditions) : undefined,
    orderBy: (fields) =>
      sort.toLowerCase() === "asc" ? fields.createdAt : desc(fields.createdAt),
    with: {
      user: true,
      post: true,
    },
  });

  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(comment)
    .where(whereConditions.length ? and(...whereConditions) : undefined);

  const [comments, _totalCount] = await Promise.all([query, totalCountQuery]);
  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: comments,
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

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const data = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const insertData = {
    ...data,
    createdBy: session.userId,
    createdAt: new Date(),
  };

  const [inserted] = await db.insert(comment).values(insertData).returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const commentEntry = await db.query.comment.findFirst({
    where: eq(comment.id, id),
    with: {
      user: true,
      post: true,
    },
  });

  if (!commentEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(commentEntry, HttpStatusCodes.OK);
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

  const existingEntry = await db.query.comment.findFirst({
    where: eq(comment.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  if (existingEntry.createdBy !== session.userId) {
    return c.json(
      { message: "Not authorized to update this comment" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [updated] = await db
    .update(comment)
    .set(data)
    .where(eq(comment.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
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

  const existingEntry = await db.query.comment.findFirst({
    where: eq(comment.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  if (existingEntry.createdBy !== session.userId) {
    return c.json(
      { message: "Not authorized to delete this comment" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  await db.delete(comment).where(eq(comment.id, id));

  return new Response(null, { status: HttpStatusCodes.NO_CONTENT });
};
