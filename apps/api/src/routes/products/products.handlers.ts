import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@/db";
import type { AppRouteHandler } from "@/types";
import { products } from "@repo/database";
import type {
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  ListRoute,
  UpdateRoute,
} from "./products.routes";
import { InsertProduct, UpdateProduct } from "./products.schema";

// List products
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "desc",
    search,
  } = c.req.valid("query");

  const session = c.get("session");
  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.INTERNAL_SERVER_ERROR // Use 500 if that's what your OpenAPI expects
    );
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Build search conditions
  const conditions = [
    eq(products.createdBy, session.userId), // Only self-created products
  ];

  if (search) {
    conditions.push(
      or(
        ilike(products.title, `%${search}%`),
        ilike(products.description, `%${search}%`),
        ilike(products.location, `%${search}%`),
        ilike(products.brand, `%${search}%`)
      )
    );
  }

  const whereCondition = conditions.length ? and(...conditions) : undefined;

  const [items, total] = await Promise.all([
    db.query.products.findMany({
      where: whereCondition,
      limit: limitNum,
      offset,
      orderBy: sort === "asc" ? products.createdAt : desc(products.createdAt),
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(whereCondition),
  ]);

  const totalCount = total[0]?.count ?? 0;

  return c.json(
    {
      data: items,
      meta: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
        limit: limitNum,
      },
    },
    HttpStatusCodes.OK
  );
};

// Create product
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const input = c.req.valid("json") as InsertProduct;
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const now = new Date();

  const [inserted] = await db
    .insert(products)
    .values({
      ...input,
      createdBy: session.userId,
      agentProfile: session.userId,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get product by ID
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!product) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(product, HttpStatusCodes.OK);
};

// Update product
export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const input = c.req.valid("json") as UpdateProduct;
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const existing = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!existing) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const [updated] = await db
    .update(products)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete product
export const remove: AppRouteHandler<DeleteRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const existing = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!existing) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  await db.delete(products).where(eq(products.id, id));

  return c.json(
    { message: "Product entry deleted successfully" },
    HttpStatusCodes.OK
  );
};
