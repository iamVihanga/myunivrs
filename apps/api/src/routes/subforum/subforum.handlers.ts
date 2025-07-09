import { desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@/db";
import type { AppRouteHandler } from "@/types";
import { subforum } from "@repo/database/schemas";
import type {
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  ListRoute,
  UpdateRoute,
} from "./subforum.routes";

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

  const query = db.query.subforum.findMany({
    limit: limitNum,
    offset,
    where: search
      ? (fields) =>
          or(
            ilike(fields.name, `%${search}%`),
            ilike(fields.description || "", `%${search}%`)
          )
      : undefined,
    orderBy: (fields) =>
      sort.toLowerCase() === "asc" ? fields.createdAt : desc(fields.createdAt),
  });

  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(subforum)
    .where(
      search
        ? or(
            ilike(subforum.name, `%${search}%`),
            ilike(subforum.description || "", `%${search}%`)
          )
        : undefined
    );

  const [subforums, _totalCount] = await Promise.all([query, totalCountQuery]);
  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  const normalizedEntries = subforums.map((entry) => ({
    ...entry,
    id: entry.id ?? "",
    name: entry.name ?? "",
    description: entry.description ?? null,
    createdBy: entry.createdBy ?? null,
    createdAt:
      entry.createdAt instanceof Date
        ? entry.createdAt.toISOString()
        : entry.createdAt,
  }));

  return c.json(
    {
      data: normalizedEntries,
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

  const [inserted] = await db.insert(subforum).values(insertData).returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const subforumEntry = await db.query.subforum.findFirst({
    where: eq(subforum.id, id),
  });

  if (!subforumEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const normalizedEntry = {
    ...subforumEntry,
    id: subforumEntry.id ?? "",
    name: subforumEntry.name ?? "",
    description: subforumEntry.description ?? null,
    createdBy: subforumEntry.createdBy ?? null,
    createdAt:
      subforumEntry.createdAt instanceof Date
        ? subforumEntry.createdAt.toISOString()
        : subforumEntry.createdAt,
  };

  return c.json(normalizedEntry, HttpStatusCodes.OK);
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

  const existingEntry = await db.query.subforum.findFirst({
    where: eq(subforum.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Check if user is the creator
  if (existingEntry.createdBy !== session.userId) {
    // Return 404 to avoid leaking existence of the resource, or use 401 if preferred
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const [updated] = await db
    .update(subforum)
    .set(data)
    .where(eq(subforum.id, id))
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

  const existingEntry = await db.query.subforum.findFirst({
    where: eq(subforum.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Check if user is the creator
  if (existingEntry.createdBy !== session.userId) {
    return c.json(
      { message: "Not authorized to delete this subforum" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  await db.delete(subforum).where(eq(subforum.id, id));

  // Return empty response with 204 status
  return new Response(null, { status: HttpStatusCodes.NO_CONTENT });
};
