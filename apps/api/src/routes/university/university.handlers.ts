import { desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/types";

import { db } from "@/db";
import { university } from "@repo/database/schemas";

import type { CreateRoute, ListRoute, RemoveRoute } from "./university.routes";

// List university entries route handler
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search,
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const query = db.query.university.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, and, or }) => {
      const conditions = [];

      // Add search condition if search parameter is provided
      if (search) {
        conditions.push(
          or(
            ilike(fields.name, `%${search}%`),
            ilike(fields.countryCode, `%${search}%`)
          )
        );
      }

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
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(university)
    .where(
      search
        ? or(
            ilike(university.name, `%${search}%`),
            ilike(university.countryCode, `%${search}%`)
          )
        : undefined
    );

  const [universityEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: universityEntries,
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

// Create new university entry route handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const universityEntry = c.req.valid("json");
  const session = c.get("session");

  console.log({ session });

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [inserted] = await db
    .insert(university)
    .values(universityEntry)
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Delete university entry route handler
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

  // Check if university entry exists
  const existingEntry = await db.query.university.findFirst({
    where: eq(university.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Delete the university entry
  await db.delete(university).where(eq(university.id, id));

  return c.json(
    { message: "University entry deleted successfully" },
    HttpStatusCodes.OK
  );
};
