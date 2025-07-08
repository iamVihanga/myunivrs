import { desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@/db";
import type { AppRouteHandler } from "@/types";
import { university } from "@repo/database/schemas";
import type {
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  ListRoute,
  UpdateRoute,
} from "./university.routes";

// List universities route handler
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

  const query = db.query.university.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, and, or }) => {
      const conditions = [];

      if (search) {
        conditions.push(
          or(
            ilike(fields.name, `%${search}%`),
            ilike(fields.countryCode, `%${search}%`),
            ilike(fields.status, `%${search}%`)
          )
        );
      }

      return conditions.length ? and(...conditions) : undefined;
    },
    orderBy: (fields) =>
      sort.toLowerCase() === "asc" ? fields.createdAt : desc(fields.createdAt),
  });

  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(university)
    .where(
      search
        ? or(
            ilike(university.name, `%${search}%`),
            ilike(university.countryCode, `%${search}%`),
            ilike(university.status, `%${search}%`)
          )
        : undefined
    );

  const [universities, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);
  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  // Normalize the response data
  const normalizedEntries = universities.map((entry) => ({
    ...entry,
    id: entry.id ?? "",
    name: entry.name ?? "",
    countryCode: entry.countryCode ?? "",
    status: entry.status ?? "published",
    createdAt:
      entry.createdAt instanceof Date
        ? entry.createdAt.toISOString()
        : entry.createdAt,
    updatedAt:
      entry.updatedAt instanceof Date
        ? entry.updatedAt.toISOString()
        : entry.updatedAt,
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

// Get single university handler
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const universityEntry = await db.query.university.findFirst({
    where: eq(university.id, id),
  });

  if (!universityEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Normalize the response data
  const normalizedEntry = {
    ...universityEntry,
    id: universityEntry.id ?? "",
    name: universityEntry.name ?? "",
    countryCode: universityEntry.countryCode ?? "",
    status: universityEntry.status ?? "published",
    createdAt:
      universityEntry.createdAt instanceof Date
        ? universityEntry.createdAt.toISOString()
        : universityEntry.createdAt,
    updatedAt:
      universityEntry.updatedAt instanceof Date
        ? universityEntry.updatedAt.toISOString()
        : universityEntry.updatedAt,
  };

  return c.json(normalizedEntry, HttpStatusCodes.OK);
};

// Create university handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const universityEntry = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Prepare insert data with defaults
  const insertData = {
    name: universityEntry.name,
    countryCode: universityEntry.countryCode,
    status: universityEntry.status ?? "published",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [inserted] = await db.insert(university).values(insertData).returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Update university handler
export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const existingEntry = await db.query.university.findFirst({
    where: eq(university.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const updateData = {
    ...body,
    status: ["published", "draft", "archived"].includes(body.status as string)
      ? body.status
      : existingEntry.status,
    updatedAt: new Date(),
  };

  const [updated] = await db
    .update(university)
    .set(updateData)
    .where(eq(university.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete university handler
export const remove: AppRouteHandler<DeleteRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const existingEntry = await db.query.university.findFirst({
    where: eq(university.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  await db.delete(university).where(eq(university.id, id));

  return c.json(null, HttpStatusCodes.NO_CONTENT as any);
};
