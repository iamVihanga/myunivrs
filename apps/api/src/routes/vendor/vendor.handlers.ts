import { desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@/db";
import type { AppRouteHandler } from "@/types";
import { vendor } from "@repo/database/schemas";

import type {
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  ListRoute,
  UpdateRoute,
} from "./vendor.routes";

// List vendor entries route handler
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

  const query = db.query.vendor.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, and, or }) => {
      const conditions = [];

      if (search) {
        conditions.push(or(ilike(fields.name, `%${search}%`)));
      }

      return conditions.length ? and(...conditions) : undefined;
    },
    orderBy: (fields) =>
      sort.toLowerCase() === "asc" ? fields.createdAt : desc(fields.createdAt),
  });

  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(vendor)
    .where(search ? or(ilike(vendor.name, `%${search}%`)) : undefined);

  const [vendors, _totalCount] = await Promise.all([query, totalCountQuery]);

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: vendors,
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

// Create new vendor entry route handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const vendorEntry = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [inserted] = await db.insert(vendor).values(vendorEntry).returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single vendor entry route handler
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const vendorEntry = await db.query.vendor.findFirst({
    where: eq(vendor.id, id),
  });

  if (!vendorEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(vendorEntry, HttpStatusCodes.OK);
};

// Update vendor entry route handler
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

  const existingEntry = await db.query.vendor.findFirst({
    where: eq(vendor.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const [updated] = await db
    .update(vendor)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(vendor.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete vendor entry route handler
export const remove: AppRouteHandler<DeleteRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const existingEntry = await db.query.vendor.findFirst({
    where: eq(vendor.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  await db.delete(vendor).where(eq(vendor.id, id));

  return c.json(
    { message: "Vendor entry deleted successfully" },
    HttpStatusCodes.OK
  );
};
