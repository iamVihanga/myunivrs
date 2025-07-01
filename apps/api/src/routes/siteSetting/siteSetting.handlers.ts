import { desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/types";

import { db } from "@/db";
import { siteSettings } from "@repo/database/schemas";

import type {
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  ListRoute,
  UpdateRoute,
} from "./siteSetting.routes";

// List siteSetting entries route handler
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
  const query = db.query.siteSettings.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, and, or }) => {
      const conditions = [];

      // Add search condition if search parameter is provided
      if (search) {
        conditions.push(
          or(
            ilike(fields.siteName, `%${search}%`),
            ilike(fields.siteDescription, `%${search}%`)
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
    .from(siteSettings)
    .where(
      search
        ? or(
            ilike(siteSettings.siteName, `%${search}%`),
            ilike(siteSettings.siteDescription, `%${search}%`)
          )
        : undefined
    );

  const [siteSettingEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: siteSettingEntries,
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

// Create new siteSetting entry route handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const siteSettingEntry = c.req.valid("json");
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
    .insert(siteSettings)
    .values(siteSettingEntry)
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single siteSetting entry route handler
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const siteSettingEntry = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.id, id),
  });

  if (!siteSettingEntry)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );

  return c.json(siteSettingEntry, HttpStatusCodes.OK);
};

// Update siteSetting entry route handler
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

  // Check if siteSettings entry exists
  const existingEntry = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Update the siteSettings entry
  const [updated] = await db
    .update(siteSettings)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(siteSettings.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete siteSettings entry route handler
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

  // Check if siteSettings entry exists
  const existingEntry = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Delete the siteSettings entry
  await db.delete(siteSettings).where(eq(siteSettings.id, id));

  return c.json(
    { message: "Site Settings entry deleted successfully" },
    HttpStatusCodes.OK
  );
};
