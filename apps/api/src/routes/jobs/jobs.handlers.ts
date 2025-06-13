import { db } from "@/db";
import { AppRouteHandler } from "@/types";
import { jobs } from "@repo/database";
import { desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute,
} from "./jobs.routes";

// List jobs entries route handler
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search,
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const query = db.query.jobs.findMany({
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
    .from(jobs)
    .where(
      search
        ? or(
            ilike(jobs.title, `%${search}%`),
            ilike(jobs.description, `%${search}%`)
          )
        : undefined
    );

  const [jobsEntities, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: jobsEntities,
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

// Create new jobs entry route handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const jobsEntry = c.req.valid("json");

  const [inserted] = await db.insert(jobs).values(jobsEntry).returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single jobs entry route handler
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const jobsEntry = await db.query.jobs.findFirst({
    where: eq(jobs.id, id),
  });

  if (!jobsEntry)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );

  return c.json(jobsEntry, HttpStatusCodes.OK);
};

// Update housing entry route handler
export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  //Check if jobs entry exists
  const existingEntry = await db.query.jobs.findFirst({
    where: eq(jobs.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Update the jobs entry
  const [updated] = await db
    .update(jobs)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(jobs.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete housing entry route handler
export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  // Check if jobs entry exists
  const existingEntry = await db.query.jobs.findFirst({
    where: eq(jobs.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Delete the housing entry
  await db.delete(jobs).where(eq(jobs.id, id));

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
