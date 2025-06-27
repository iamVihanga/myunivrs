import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/types";

import { db } from "@/db";
import { productCategories, sellSwaps } from "@repo/database/schemas";

import type {
  CreateRoute,
  DeleteRoute,
  GetByCategoryRoute,
  GetMyListingsRoute,
  GetOneRoute,
  ListRoute,
  UpdateRoute,
} from "./sellswaps.routes";

// List sell/swap items route handler
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
  const query = db.query.sellSwaps.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, and, or }) => {
      const conditions = [];

      // Add search condition if search parameter is provided
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
    .from(sellSwaps)
    .where(
      search
        ? or(
            ilike(sellSwaps.title, `%${search}%`),
            ilike(sellSwaps.description, `%${search}%`)
          )
        : undefined
    );

  const [sellSwapsEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: sellSwapsEntries,
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

// Create new sell/swap item route handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const sellSwapEntry = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if category exists (if provided)
  if (sellSwapEntry.categoryId) {
    const category = await db.query.productCategories.findFirst({
      where: eq(productCategories.id, sellSwapEntry.categoryId),
    });

    if (!category) {
      return c.json(
        { message: "Invalid category ID" },
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      );
    }
  }

  const [inserted] = await db
    .insert(sellSwaps)
    .values({
      ...sellSwapEntry,
      userId: session.userId,
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single sell/swap item route handler
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const sellSwapItem = await db.query.sellSwaps.findFirst({
    where: eq(sellSwaps.id, id),
    // with: {
    //   category: true,
    //   user: true,
    // },
  });

  if (!sellSwapItem)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );

  return c.json(sellSwapItem, HttpStatusCodes.OK);
};

// Update sell/swap item route handler
export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if sell/swap item exists and belongs to the user
  const existingItem = await db.query.sellSwaps.findFirst({
    where: eq(sellSwaps.id, id),
  });

  if (!existingItem) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Only the owner can update their listing
  if (existingItem.userId !== session.userId) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Check if category exists (if updating category)
  if (body.categoryId) {
    const category = await db.query.productCategories.findFirst({
      where: eq(productCategories.id, body.categoryId),
    });

    if (!category) {
      return c.json(
        { message: "Invalid category ID" },
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      );
    }
  }

  // Update the sell/swap item
  const [updated] = await db
    .update(sellSwaps)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(sellSwaps.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete sell/swap item route handler
export const remove: AppRouteHandler<DeleteRoute> = async (c) => {
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

  // Check if sell/swap item exists and belongs to the user
  const existingItem = await db.query.sellSwaps.findFirst({
    where: eq(sellSwaps.id, id),
  });

  if (!existingItem) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Only the owner can delete their listing
  if (existingItem.userId !== session.userId) {
    return c.json(
      { message: HttpStatusPhrases.FORBIDDEN },
      HttpStatusCodes.FORBIDDEN
    );
  }

  // Delete the sell/swap item
  await db.delete(sellSwaps).where(eq(sellSwaps.id, id));

  return c.json(
    { message: "Sell/swap item deleted successfully" },
    HttpStatusCodes.OK
  );
};

// Get sell/swap items by category route handler
export const getByCategory: AppRouteHandler<GetByCategoryRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const {
    page = "1",
    limit = "10",
    sort = "desc",
    search,
  } = c.req.valid("query");

  // Check if category exists
  const category = await db.query.productCategories.findFirst({
    where: eq(productCategories.id, id),
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

  // Build query to get items in this category
  const query = db.query.sellSwaps.findMany({
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
    },
    with: {
      user: true,
    },
  });

  // Get total count for pagination metadata
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(sellSwaps)
    .where(
      and(
        eq(sellSwaps.categoryId, id),
        search
          ? or(
              ilike(sellSwaps.title, `%${search}%`),
              ilike(sellSwaps.description, `%${search}%`)
            )
          : undefined
      )
    );

  const [sellSwapEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: sellSwapEntries,
      meta: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
        category,
      },
    },
    HttpStatusCodes.OK
  );
};

// Get user's own listings route handler
export const getMyListings: AppRouteHandler<GetMyListingsRoute> = async (c) => {
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const {
    page = "1",
    limit = "10",
    sort = "desc",
    search,
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
  const offset = (pageNum - 1) * limitNum;

  // Build query to get user's own items
  const query = db.query.sellSwaps.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, and }) => {
      const conditions = [eq(fields.userId, session.userId)];

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
    },
    with: {
      category: true,
    },
  });

  // Get total count for pagination metadata
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(sellSwaps)
    .where(
      and(
        eq(sellSwaps.userId, session.userId),
        search
          ? or(
              ilike(sellSwaps.title, `%${search}%`),
              ilike(sellSwaps.description, `%${search}%`)
            )
          : undefined
      )
    );

  const [sellSwapEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: sellSwapEntries,
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
