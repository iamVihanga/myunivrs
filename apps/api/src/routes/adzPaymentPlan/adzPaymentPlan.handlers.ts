import { desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/types";

import { db } from "@/db";
import { adsPaymentPlan } from "@repo/database/schemas";

import type {
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  ListRoute,
  UpdateRoute,
} from "./adzPaymentPlan.routes";

// List adzPaymentPlan entries route handler
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
  const query = db.query.adsPaymentPlan.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, and, or }) => {
      const conditions = [];

      // Add search condition if search parameter is provided
      if (search) {
        conditions.push(
          or(
            ilike(fields.planName, `%${search}%`),
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
    .from(adsPaymentPlan)
    .where(
      search
        ? or(
            ilike(adsPaymentPlan.planName, `%${search}%`),
            ilike(adsPaymentPlan.description, `%${search}%`)
          )
        : undefined
    );

  const [adzPaymentPlanEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: adzPaymentPlanEntries,
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

// Create new adzPaymentPlan entry route handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const adzPaymentPlanEntry = c.req.valid("json");
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
    .insert(adsPaymentPlan)
    .values(adzPaymentPlanEntry)
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single adzPaymentPlan entry route handler
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const adzPaymentPlanEntry = await db.query.adsPaymentPlan.findFirst({
    where: eq(adsPaymentPlan.id, id),
  });

  if (!adzPaymentPlanEntry)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );

  return c.json(adzPaymentPlanEntry, HttpStatusCodes.OK);
};

// Update adzPaymentPlan entry route handler
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

  // Check if adzPaymentPlan entry exists
  const existingEntry = await db.query.adsPaymentPlan.findFirst({
    where: eq(adsPaymentPlan.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Update the adzPaymentPlan entry
  const [updated] = await db
    .update(adsPaymentPlan)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(adsPaymentPlan.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete adzPaymentPlan entry route handler
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

  // Check if adzPaymentPlan entry exists
  const existingEntry = await db.query.adsPaymentPlan.findFirst({
    where: eq(adsPaymentPlan.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Delete the adzPaymentPlan entry
  await db.delete(adsPaymentPlan).where(eq(adsPaymentPlan.id, id));

  return c.json(
    { message: "Adz Payment Plan entry deleted successfully" },
    HttpStatusCodes.OK
  );
};
