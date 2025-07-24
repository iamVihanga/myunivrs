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
  }: {
    page?: string;
    limit?: string;
    sort?: string;
    search?: string;
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
            ilike(fields.description, `%${search}%`),
            ilike(fields.company, `%${search}%`),
            ilike(fields.jobType, `%${search}%`),
            ilike(fields.status, `%${search}%`),
            ilike(fields.actionUrl, `%${search}%`)
            // Add more fields as needed
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
            ilike(jobs.description, `%${search}%`),
            ilike(jobs.company, `%${search}%`),
            ilike(jobs.jobType, `%${search}%`),
            ilike(jobs.status, `%${search}%`),
            ilike(jobs.actionUrl, `%${search}%`)
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
      data: jobsEntities.map((job) => ({
        ...job,
        createdAt:
          job.createdAt instanceof Date
            ? job.createdAt.toISOString()
            : job.createdAt,
        updatedAt:
          job.updatedAt instanceof Date
            ? job.updatedAt.toISOString()
            : job.updatedAt,
        requiredSkills:
          job.requiredSkills === null ? undefined : job.requiredSkills,
        cvRequired: job.cvRequired === null ? undefined : job.cvRequired,
        actionUrl: job.actionUrl === null ? undefined : job.actionUrl,
      })),
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
  const session = c.get("session");

  // Check if user is authenticated
  if (!session) {
    return c.json(
      {
        message: "This user is unauthenticated, You need to sign in first !",
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Ensure status is valid
  const { status, ...rest } = jobsEntry;
  const allowedStatus = [
    "published",
    "draft",
    "pending_approval",
    "deleted",
  ] as const;
  // Ensure only allowed statuses are used (do not include "archived")
  const safeStatus =
    typeof status === "string" && allowedStatus.includes(status as any)
      ? (status as (typeof allowedStatus)[number])
      : "draft";

  const [inserted] = await db
    .insert(jobs)
    .values({
      ...rest,
      status: safeStatus,
      // If you need to store agentProfile, ensure the column exists in the schema
      // agentProfile: session?.activeOrganizationId,
    })
    .returning();

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

// Update jobs entry route handler
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

  // Update the jobs entry
  // Ensure status is valid for update
  const allowedStatus = ["published", "draft", "pending_approval", "deleted"];
  const safeStatus =
    body.status && allowedStatus.includes(body.status as string)
      ? (body.status as
          | "published"
          | "draft"
          | "pending_approval"
          | "deleted"
          | null)
      : existingEntry.status;

  const [updated] = await db
    .update(jobs)
    .set({ ...body, status: safeStatus, updatedAt: new Date() })
    .where(eq(jobs.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete jobs entry route handler
export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
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

  // Delete the jobs entry
  await db.delete(jobs).where(eq(jobs.id, id));

  return c.json(
    { message: "Job entry deleted successfully" },
    HttpStatusCodes.OK
  );
};
