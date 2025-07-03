import { desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/types";

import { db } from "@/db";
import { b2bplans } from "@repo/database/schemas";

import type {
  CreateB2BPlanRoute,
  DeleteB2BPlanRoute,
  GetOneB2BPlanRoute,
  ListB2BPlanRoute,
  UpdateB2BPlanRoute,
} from "./b2bplans.routes";

// List B2B plans
export const list: AppRouteHandler<ListB2BPlanRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search,
  } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  const query = db.query.b2bplans.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, or, and }) => {
      const conditions = [];
      if (search) {
        conditions.push(
          or(
            ilike(fields.title, `%${search}%`),
            ilike(fields.description, `%${search}%`)
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
    .from(b2bplans)
    .where(
      search
        ? or(
            ilike(b2bplans.title, `%${search}%`),
            ilike(b2bplans.description, `%${search}%`)
          )
        : undefined
    );

  const [results, totalResult] = await Promise.all([query, totalCountQuery]);
  const totalCount = totalResult[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  const normalized = results.map((entry) => ({
    ...entry,
    images: Array.isArray(entry.images) ? entry.images : [],
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
      data: normalized,
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

// Create B2B plan
export const create: AppRouteHandler<CreateB2BPlanRoute> = async (c) => {
  const payload = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const insertData = {
    title: payload.title,
    images: payload.images ?? [],
    description: payload.description ?? null,
    prize: payload.prize,
    type: payload.type ?? "yearly", // Default to "basic" if not provided
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [created] = await db.insert(b2bplans).values(insertData).returning();
  return c.json(created, HttpStatusCodes.CREATED);
};

// Get a B2B plan by ID
export const getOne: AppRouteHandler<GetOneB2BPlanRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const entry = await db.query.b2bplans.findFirst({
    where: eq(b2bplans.id, id),
  });

  if (!entry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(
    {
      ...entry,
      images: Array.isArray(entry.images) ? entry.images : [],
      createdAt:
        entry.createdAt instanceof Date
          ? entry.createdAt.toISOString()
          : entry.createdAt,
      updatedAt:
        entry.updatedAt instanceof Date
          ? entry.updatedAt.toISOString()
          : entry.updatedAt,
    },
    HttpStatusCodes.OK
  );
};

// Update B2B plan
export const update: AppRouteHandler<UpdateB2BPlanRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const payload = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const existing = await db.query.b2bplans.findFirst({
    where: eq(b2bplans.id, id),
  });

  if (!existing) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const updateData = {
    ...payload,
    updatedAt: new Date(),
  };

  const [updated] = await db
    .update(b2bplans)
    .set(updateData)
    .where(eq(b2bplans.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete B2B plan
export const remove: AppRouteHandler<DeleteB2BPlanRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const existing = await db.query.b2bplans.findFirst({
    where: eq(b2bplans.id, id),
  });

  if (!existing) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  await db.delete(b2bplans).where(eq(b2bplans.id, id));

  return c.json(
    { message: "B2B plan deleted successfully" },
    HttpStatusCodes.OK
  );
};
