import { desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/types";

import { db } from "@/db";
import { housing } from "@repo/database/schemas";

import type {
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  ListRoute,
  UpdateRoute,
} from "./housing.routes";

// List housing entries route handler
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
  const query = db.query.housing.findMany({
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
            ilike(fields.address, `%${search}%`),
            ilike(fields.city, `%${search}%`),
            ilike(fields.state, `%${search}%`),
            ilike(fields.zipCode, `%${search}%`),
            ilike(fields.price, `%${search}%`),
            ilike(fields.bedrooms, `%${search}%`),
            ilike(fields.bathrooms, `%${search}%`),
            ilike(fields.parking, `%${search}%`),
            ilike(fields.contactNumber, `%${search}%`),
            ilike(fields.housingType, `%${search}%`)
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
    .from(housing)
    .where(
      search
        ? or(
            ilike(housing.title, `%${search}%`),
            ilike(housing.description, `%${search}%`),
            ilike(housing.address, `%${search}%`),
            ilike(housing.city, `%${search}%`),
            ilike(housing.state, `%${search}%`),
            ilike(housing.zipCode, `%${search}%`),
            ilike(housing.price, `%${search}%`),
            ilike(housing.bedrooms, `%${search}%`),
            ilike(housing.bathrooms, `%${search}%`),
            ilike(housing.parking, `%${search}%`),
            ilike(housing.contactNumber, `%${search}%`),
            ilike(housing.housingType, `%${search}%`)
          )
        : undefined
    );

  const [housingEntries, _totalCount] = await Promise.all([
    query,
    totalCountQuery,
  ]);

  const totalCount = _totalCount[0]?.count || 0;

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limitNum);

  // Map and normalize the data to match the expected response type
  const normalizedEntries = housingEntries.map((entry) => ({
    ...entry,
    id: entry.id ?? "", // ensure id is present
    title: entry.title ?? "",
    description: entry.description ?? null,
    status: entry.status ?? null,
    createdAt:
      entry.createdAt instanceof Date
        ? entry.createdAt.toISOString()
        : entry.createdAt,
    updatedAt: entry.updatedAt
      ? entry.updatedAt instanceof Date
        ? entry.updatedAt.toISOString()
        : entry.updatedAt
      : null,
    bedrooms: entry.bedrooms ?? "",
    bathrooms: entry.bathrooms ?? "",
    address: entry.address ?? "",
    city: entry.city ?? "",
    state: entry.state ?? "",
    zipCode: entry.zipCode ?? "",
    price: entry.price ?? "",
    parking: entry.parking ?? "",
    contactNumber: entry.contactNumber ?? "",
    housingType: entry.housingType ?? "",
    images: Array.isArray(entry.images)
      ? entry.images
      : entry.images === null
        ? null
        : [], // always string[] or null
    isFurnished: entry.isFurnished ?? undefined, // optional boolean
    agentProfile: entry.agentProfile ?? null,
    // Add any other required fields with default values if needed
  }));

  return c.json(
    {
      data: normalizedEntries,
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

// Create new housing entry route handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const housingEntry = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }
  if (!session.activeOrganizationId) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const allowedStatuses = [
    "published",
    "draft",
    "pending_approval",
    "deleted",
  ] as const;
  type StatusType = (typeof allowedStatuses)[number];

  // Only pick fields that exist in the schema and ensure status is correct type
  const insertData = {
    title: housingEntry.title ?? "",
    description: housingEntry.description ?? null,
    status: allowedStatuses.includes(housingEntry.status as StatusType)
      ? (housingEntry.status as StatusType)
      : null,
    createdAt: new Date(),
    updatedAt: new Date(),
    bedrooms: housingEntry.bedrooms ?? "",
    bathrooms: housingEntry.bathrooms ?? "",
    address: housingEntry.address ?? "",
    city: housingEntry.city ?? "",
    state: housingEntry.state ?? "",
    zipCode: housingEntry.zipCode ?? "",
    price: housingEntry.price ?? "",
    parking: housingEntry.parking ?? "",
    contactNumber: housingEntry.contactNumber ?? "",
    housingType: housingEntry.housingType ?? "",
    images: housingEntry.images ?? [],
    isFurnished: housingEntry.isFurnished ?? undefined,
    agentProfile: session.activeOrganizationId,
    // Add any other required fields with default values if needed
  };

  const [inserted] = await db.insert(housing).values(insertData).returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single housing entry route handler
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const housingEntry = await db.query.housing.findFirst({
    where: eq(housing.id, id),
  });

  if (!housingEntry)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );

  // Normalize the response to match the expected type
  const normalizedEntry = {
    ...housingEntry,
    id: housingEntry.id ?? "",
    title: housingEntry.title ?? "",
    description: housingEntry.description ?? null,
    status: housingEntry.status ?? null,
    createdAt:
      housingEntry.createdAt instanceof Date
        ? housingEntry.createdAt.toISOString()
        : (housingEntry.createdAt ?? ""),
    updatedAt: housingEntry.updatedAt
      ? housingEntry.updatedAt instanceof Date
        ? housingEntry.updatedAt.toISOString()
        : housingEntry.updatedAt
      : null,
    bedrooms: housingEntry.bedrooms ?? "",
    bathrooms: housingEntry.bathrooms ?? "",
    address: housingEntry.address ?? "",
    city: housingEntry.city ?? "",
    state: housingEntry.state ?? "",
    zipCode: housingEntry.zipCode ?? "",
    price: housingEntry.price ?? "",
    parking: housingEntry.parking ?? "",
    contactNumber: housingEntry.contactNumber ?? "",
    housingType: housingEntry.housingType ?? "",
    images: Array.isArray(housingEntry.images) ? housingEntry.images : [], // always string[]
    isFurnished: housingEntry.isFurnished ?? undefined,
    agentProfile: housingEntry.agentProfile ?? null,
    // Add any other required fields with default values if needed
  };

  return c.json(normalizedEntry, HttpStatusCodes.OK);
};

// Update housing entry route handler
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

  // Check if housing entry exists
  const existingEntry = await db.query.housing.findFirst({
    where: eq(housing.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Update the housing entry with all new attributes
  const allowedStatuses = [
    "published",
    "draft",
    "pending_approval",
    "deleted",
  ] as const;
  type StatusType = (typeof allowedStatuses)[number];

  const updateData = {
    ...body,
    status: allowedStatuses.includes(body.status as StatusType)
      ? (body.status as StatusType)
      : null,
    updatedAt: new Date(),
  };

  const [updated] = await db
    .update(housing)
    .set(updateData)
    .where(eq(housing.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete housing entry route handler
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

  // Check if housing entry exists
  const existingEntry = await db.query.housing.findFirst({
    where: eq(housing.id, id),
  });

  if (!existingEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Delete the housing entry
  await db.delete(housing).where(eq(housing.id, id));

  return c.json(
    { message: "Housing entry deleted successfully" },
    HttpStatusCodes.OK
  );
};
