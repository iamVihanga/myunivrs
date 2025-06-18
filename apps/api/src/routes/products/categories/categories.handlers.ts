import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/types";

import { db } from "@/db";
import { productCategories, products } from "@repo/database/schemas";

import type {
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  GetProductsRoute,
  ListRoute,
  UpdateRoute
} from "./categories.routes";

// List product categories route handler
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const query = db.query.productCategories.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike }) => {
      const conditions = [];

      // Add search condition if search parameter is provided
      if (search) {
        conditions.push(ilike(fields.name, `%${search}%`));
      }

      return conditions.length ? and(...conditions) : undefined;
    },
    orderBy: (fields) => {
      // Handle sorting direction
      if (sort.toLowerCase() === "asc") {
        return fields.name;
      }
      return desc(fields.name);
    }
  });

  // Get total count for pagination metadata
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(productCategories)
    .where(search ? ilike(productCategories.name, `%${search}%`) : undefined);

  const [categoriesEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery
  ]);

  const totalCount = _totalCount[0]?.count || 0;

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: categoriesEntries,
      meta: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum
      }
    },
    HttpStatusCodes.OK
  );
};

// Create new product category route handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const categoryEntry = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [inserted] = await db
    .insert(productCategories)
    .values(categoryEntry)
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single product category route handler
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const category = await db.query.productCategories.findFirst({
    where: eq(productCategories.id, id)
  });

  if (!category)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );

  return c.json(category, HttpStatusCodes.OK);
};

// Update product category route handler
export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if category entry exists
  const existingEntry = await db.query.productCategories.findFirst({
    where: eq(productCategories.id, id)
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Update the category entry
  const [updated] = await db
    .update(productCategories)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(productCategories.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete product category route handler
export const remove: AppRouteHandler<DeleteRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if category entry exists
  const existingEntry = await db.query.productCategories.findFirst({
    where: eq(productCategories.id, id)
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Delete the category entry
  await db.delete(productCategories).where(eq(productCategories.id, id));

  return c.json(
    { message: "Product category deleted successfully" },
    HttpStatusCodes.OK
  );
};

// Get products by category route handler
export const getProducts: AppRouteHandler<GetProductsRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search
  } = c.req.valid("query");

  // Check if category exists
  const category = await db.query.productCategories.findFirst({
    where: eq(productCategories.id, id)
  });

  if (!category) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
  const offset = (pageNum - 1) * limitNum;

  // Build query to get products in this category
  const query = db.query.products.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, and }) => {
      const conditions = [eq(fields.categoryId, id)];

      // Add search condition if search parameter is provided
      if (search) {
        conditions.push(ilike(fields.title, `%${search}%`));
      }

      return and(...conditions);
    },
    orderBy: (fields) => {
      // Handle sorting direction
      if (sort.toLowerCase() === "asc") {
        return fields.createdAt;
      }
      return desc(fields.createdAt);
    }
  });

  // Get total count for pagination metadata
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(
      and(
        eq(products.categoryId, id),
        search
          ? or(
              ilike(products.title, `%${search}%`),
              ilike(products.description, `%${search}%`)
            )
          : undefined
      )
    );

  const [productEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery
  ]);

  const totalCount = _totalCount[0]?.count || 0;

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: productEntries,
      meta: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum
      }
    },
    HttpStatusCodes.OK
  );
};
