import { desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@/db";
import type { AppRouteHandler } from "@/types";
import { talent } from "@repo/database/schemas";

import type {
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  ListRoute,
  UpdateRoute,
} from "./talent.routes";

// List all talent entries
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

  const query = db.query.talent.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, and, or }) => {
      const conditions = [];

      if (search) {
        conditions.push(
          or(
            ilike(fields.name, `%${search}%`),
            ilike(fields.role, `%${search}%`),
            ilike(fields.location, `%${search}%`)
          )
        );
      }

      return conditions.length ? and(...conditions) : undefined;
    },
    orderBy: (fields) =>
      sort.toLowerCase() === "asc" ? fields.createdAt : desc(fields.createdAt),
  });

  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(talent)
    .where(
      search
        ? or(
            ilike(talent.name, `%${search}%`),
            ilike(talent.role, `%${search}%`),
            ilike(talent.location, `%${search}%`)
          )
        : undefined
    );

  const [talentEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: talentEntries,
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

// Create a new talent entry
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const talentEntry = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Validate 'role' to ensure it matches allowed enum values
  const allowedRoles = [
    "model",
    "photographer",
    "fashion_designer",
    "makeup_artist",
    "stylist",
    "agency",
    "videographer",
    "hair_stylist",
    "event_organizer",
    "retoucher",
    "casting_director",
    "client",
  ] as const;

  if (!allowedRoles.includes(talentEntry.role as any)) {
    return c.json(
      { message: "Invalid role value" },
      422 // Unprocessable Entity for validation errors
    );
  }

  // Insert and return full inserted row
  const insertedArray = await db
    .insert(talent)
    .values({
      ...talentEntry,
      role: talentEntry.role as (typeof allowedRoles)[number],
    })
    .returning();
  const inserted = insertedArray[0];

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single talent entry
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const entry = await db.query.talent.findFirst({
    where: eq(talent.id, id),
  });

  if (!entry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(entry, HttpStatusCodes.OK);
};

// Update a talent entry
export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json") as Record<string, unknown>;
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const existing = await db.query.talent.findFirst({
    where: eq(talent.id, id),
  });

  if (!existing) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Whitelist allowed fields for update
  const allowedFields = [
    "name",
    "role",
    "location",
    "bio",
    "experienceYears",
    "hourlyRate",
    "portfolioUrls",
    "socialLinks",
  ];

  const updates: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in body) {
      updates[key] = body[key];
    }
  }
  updates.updatedAt = new Date();

  const updatedArray = await db
    .update(talent)
    .set(updates)
    .where(eq(talent.id, id))
    .returning();

  const updated = updatedArray[0];

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete a talent entry
export const remove: AppRouteHandler<DeleteRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const existing = await db.query.talent.findFirst({
    where: eq(talent.id, id),
  });

  if (!existing) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  await db.delete(talent).where(eq(talent.id, id));

  return c.json(
    { message: "Talent entry deleted successfully" },
    HttpStatusCodes.OK
  );
};
