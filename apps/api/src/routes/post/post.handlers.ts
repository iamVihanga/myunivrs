import { desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@/db";
import type { AppRouteHandler } from "@/types";
import { post } from "@repo/database/schemas";
import type {
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  ListRoute,
  UpdateRoute,
} from "./post.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search,
  } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  const query = db.query.post.findMany({
    limit: limitNum,
    offset,
    where: search
      ? (fields) =>
          or(
            ilike(fields.title, `%${search}%`),
            ilike(fields.content || "", `%${search}%`)
          )
      : undefined,
    orderBy: (fields) =>
      sort.toLowerCase() === "asc" ? fields.createdAt : desc(fields.createdAt),
    with: {
      subforum: true,
    },
  });

  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(post)
    .where(
      search
        ? or(
            ilike(post.title, `%${search}%`),
            ilike(post.content || "", `%${search}%`)
          )
        : undefined
    );

  const [posts, _totalCount] = await Promise.all([query, totalCountQuery]);
  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: posts,
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

  const [inserted] = await db.insert(post).values(insertData).returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const postEntry = await db.query.post.findFirst({
    where: eq(post.id, id),
    with: {
      subforum: true,
    },
  });

  if (!postEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(postEntry, HttpStatusCodes.OK);
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

  const existingEntry = await db.query.post.findFirst({
    where: eq(post.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  if (existingEntry.createdBy !== session.userId) {
    return c.json(
      { message: "Not authorized to update this post" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const updateData = { ...data } as typeof data & Partial<{ updatedAt: Date }>;
  (updateData as any).updatedAt = new Date();

  const [updated] = await db
    .update(post)
    .set(updateData)
    .where(eq(post.id, id))
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

  const existingEntry = await db.query.post.findFirst({
    where: eq(post.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  if (existingEntry.createdBy !== session.userId) {
    return c.json(
      { message: "Not authorized to delete this post" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  await db.delete(post).where(eq(post.id, id));

  return new Response(null, { status: HttpStatusCodes.NO_CONTENT });
};
