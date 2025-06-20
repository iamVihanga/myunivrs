import { desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/types";

import { db } from "@/db";
import { sales } from "@repo/database/schemas";

import type {
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  ListRoute,
  UpdateRoute,
} from "./sales.routes";

// List sales entries route handler
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search,
  } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
  const offset = (pageNum - 1) * limitNum;

  const query = db.query.sales.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, and, or }) => {
      const conditions = [];

      if (search) {
        // Adjust these field names based on your sales schema
        conditions.push(or(ilike(fields.productName, `%${search}%`)));
      }

      return conditions.length ? and(...conditions) : undefined;
    },
    orderBy: (fields) => {
      if (sort.toLowerCase() === "asc") {
        return fields.createdAt;
      }
      return desc(fields.createdAt);
    },
  });

  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(sales)
    .where(
      search
        ? or(
            ilike(sales.productName, `%${search}%`),
            ilike(sales.productName, `%${search}%`)
          )
        : undefined
    );

  const [salesEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: salesEntries,
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

// Create new sales entry route handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const salesEntry = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (salesEntry.totalPrice === undefined) {
    return c.json(
      { message: "totalPrice is required" },
      HttpStatusCodes.UNPROCESSABLE_ENTITY // 422
    );
  }

  const insertValues = {
    ...salesEntry,
    totalPrice: String(salesEntry.totalPrice),
  };

  const [inserted] = await db.insert(sales).values(insertValues).returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single sales entry route handler
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const salesEntry = await db.query.sales.findFirst({
    where: eq(sales.id, id),
  });

  if (!salesEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(salesEntry, HttpStatusCodes.OK);
};

// Update sales entry route handler
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

  const existingEntry = await db.query.sales.findFirst({
    where: eq(sales.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const [updated] = await db
    .update(sales)
    .set({
      ...body,
      totalPrice:
        body.totalPrice !== undefined ? String(body.totalPrice) : undefined,
      updatedAt: new Date(),
    })
    .where(eq(sales.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete sales entry route handler
export const remove: AppRouteHandler<DeleteRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const existingEntry = await db.query.sales.findFirst({
    where: eq(sales.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  await db.delete(sales).where(eq(sales.id, id));

  return c.json(
    { message: "Sales entry deleted successfully" },
    HttpStatusCodes.OK
  );
};
