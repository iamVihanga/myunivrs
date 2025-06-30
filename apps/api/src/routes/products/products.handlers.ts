import { desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/types";

import { db } from "@/db";
import { products } from "@repo/database/schemas";

import type {
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  ListRoute,
  UpdateRoute,
} from "./products.routes";

// List products route handler
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
  const query = db.query.products.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, and, or }) => {
      const conditions = [];

      // Add search condition if search parameter is provided
      if (search) {
        conditions.push(
          or(
            ilike(fields.title, `%${search}%`),
            ilike(fields.description, `%${search}%`),
            ilike(fields.location, `%${search}%`),
            ilike(fields.condition, `%${search}%`),
            ilike(fields.status, `%${search}%`),
            ilike(fields.categoryId, `%${search}%`)
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
    with: {
      category: true,
    },
  });

  // Get total count for pagination metadata
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(
      search
        ? or(
            ilike(products.title, `%${search}%`),
            ilike(products.description, `%${search}%`),
            ilike(products.location, `%${search}%`),
            ilike(products.condition, `%${search}%`),
            ilike(products.status, `%${search}%`),
            ilike(products.categoryId, `%${search}%`)
          )
        : undefined
    );

  const [productEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limitNum);

  const allowedStatuses = ["published", "draft", "pending_approval", "deleted"];
  const allowedConditions = ["new", "used", "refurbished", "for_parts"];

  // Map product entries to match the expected response type
  const mappedEntries = productEntries.map((product) => ({
    ...product,
    createdAt:
      product.createdAt instanceof Date
        ? product.createdAt.toISOString()
        : product.createdAt,
    updatedAt:
      product.updatedAt instanceof Date
        ? product.updatedAt.toISOString()
        : product.updatedAt === null
          ? null
          : product.updatedAt,
    status: allowedStatuses.includes(product.status ?? "")
      ? product.status
      : "draft",
    // Ensure images is always an array or undefined
    images: Array.isArray(product.images)
      ? product.images
      : product.images === null || product.images === undefined
        ? []
        : [product.images],
    condition: allowedConditions.includes(product.condition)
      ? product.condition
      : "used",
    discountPercentage:
      typeof product.discountPercentage === "number"
        ? product.discountPercentage
        : 0,
    stockQuantity:
      typeof product.stockQuantity === "number" ? product.stockQuantity : 1,
    isNegotiable:
      typeof product.isNegotiable === "boolean" ? product.isNegotiable : false,
    category: product.category ?? null,
    agentProfile: product.agentProfile ?? null,
  }));

  return c.json(
    {
      data: mappedEntries,
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

// Create new product route handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const productEntry = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const allowedStatuses = ["published", "draft", "pending_approval", "deleted"];
  const allowedConditions = ["new", "used", "refurbished", "for_parts"];

  // Ensure status is valid and not "archived"
  // Map "archived" or any invalid status to "draft"
  let status:
    | "published"
    | "draft"
    | "pending_approval"
    | "deleted"
    | null
    | undefined =
    productEntry.status === "archived"
      ? "draft"
      : allowedStatuses.includes(productEntry.status ?? "")
        ? (productEntry.status as
            | "published"
            | "draft"
            | "pending_approval"
            | "deleted")
        : "draft";
  const [inserted] = await db
    .insert(products)
    .values({
      ...productEntry,
      status,
      condition: allowedConditions.includes(productEntry.condition)
        ? productEntry.condition
        : "used",
      agentProfile: session?.activeOrganizationId,
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single product route handler
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: { category: true },
  });

  if (!product)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );

  const allowedStatuses = ["published", "draft", "pending_approval", "deleted"];
  const allowedConditions = ["new", "used", "refurbished", "for_parts"];

  // Map product fields to match the expected response type
  const mappedProduct = {
    ...product,
    createdAt:
      product.createdAt instanceof Date
        ? product.createdAt.toISOString()
        : product.createdAt,
    updatedAt:
      product.updatedAt instanceof Date || product.updatedAt === null
        ? product.updatedAt
          ? product.updatedAt.toISOString()
          : null
        : product.updatedAt,
    status: allowedStatuses.includes(product.status ?? "")
      ? product.status
      : "draft",
    // Ensure images is always an array
    images: Array.isArray(product.images)
      ? product.images
      : product.images === null || product.images === undefined
        ? []
        : [product.images],
    condition: allowedConditions.includes(product.condition)
      ? product.condition
      : "used",
    discountPercentage:
      typeof product.discountPercentage === "number"
        ? product.discountPercentage
        : 0,
    stockQuantity:
      typeof product.stockQuantity === "number" ? product.stockQuantity : 1,
    isNegotiable:
      typeof product.isNegotiable === "boolean" ? product.isNegotiable : false,
    category: product.category ?? null,
    agentProfile: product.agentProfile ?? null,
  };

  return c.json(mappedProduct, HttpStatusCodes.OK);
};

// Update product route handler
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

  // Check if product entry exists
  const existingEntry = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const allowedStatuses = ["published", "draft", "pending_approval", "deleted"];
  const allowedConditions = ["new", "used", "refurbished", "for_parts"];

  const updateData: Record<string, any> = {
    ...body,
    updatedAt: new Date(),
  };

  if (body.status && allowedStatuses.includes(body.status)) {
    updateData.status = body.status;
  }
  if (body.condition && allowedConditions.includes(body.condition)) {
    updateData.condition = body.condition;
  }

  const [updated] = await db
    .update(products)
    .set(updateData)
    .where(eq(products.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete product route handler
export const remove: AppRouteHandler<DeleteRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if product entry exists
  const existingEntry = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Delete the product entry
  await db.delete(products).where(eq(products.id, id));

  return c.json(
    { message: "Product deleted successfully" },
    HttpStatusCodes.OK
  );
};
