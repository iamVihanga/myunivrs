import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/types";

import { db } from "@/db";
import { b2bProfile } from "@repo/database/schemas";

import type {
  CreateRoute,
  DeleteRoute,
  GetMeRoute,
  GetOneRoute,
  ListRoute,
  UpdateMeRoute,
  UpdateRoute,
} from "./b2bProfile.routes";

// List B2B profile entries route handler
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search,
    username,
    businessName,
    businessType,
    subscriptionPlan,
    verified,
    hasImages,
    address,
  } = c.req.valid("query");

  // Convert to numbers and validate
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
  const offset = (pageNum - 1) * limitNum;

  // Build query conditions
  const conditions = [];

  // Add search condition if search parameter is provided
  if (search) {
    conditions.push(
      or(
        ilike(b2bProfile.username, `%${search}%`),
        ilike(b2bProfile.businessName, `%${search}%`),
        ilike(b2bProfile.businessType, `%${search}%`),
        ilike(b2bProfile.contactPerson, `%${search}%`),
        ilike(b2bProfile.address, `%${search}%`)
      )
    );
  }

  // Add specific filter conditions
  if (username) {
    conditions.push(ilike(b2bProfile.username, `%${username}%`));
  }
  if (businessName) {
    conditions.push(ilike(b2bProfile.businessName, `%${businessName}%`));
  }
  if (businessType) {
    conditions.push(eq(b2bProfile.businessType, businessType));
  }
  if (subscriptionPlan) {
    conditions.push(eq(b2bProfile.subscriptionPlan, subscriptionPlan));
  }
  if (verified) {
    conditions.push(eq(b2bProfile.verified, verified === "true"));
  }
  if (address) {
    conditions.push(ilike(b2bProfile.address, `%${address}%`));
  }

  // Add images filter
  if (hasImages === "true") {
    conditions.push(sql`array_length(${b2bProfile.images}, 1) > 0`);
  } else if (hasImages === "false") {
    conditions.push(
      or(
        sql`array_length(${b2bProfile.images}, 1) = 0`,
        sql`${b2bProfile.images} IS NULL`
      )
    );
  }

  // Build the main query
  const query = db
    .select()
    .from(b2bProfile)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(
      sort.toLowerCase() === "asc"
        ? b2bProfile.createdAt
        : desc(b2bProfile.createdAt)
    )
    .limit(limitNum)
    .offset(offset);

  // Get total count for pagination metadata
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(b2bProfile)
    .where(conditions.length ? and(...conditions) : undefined);

  const [b2bProfileEntries, totalCountResult] = await Promise.all([
    query,
    totalCountQuery,
  ]);
  const totalCount =
    totalCountResult && totalCountResult[0] ? totalCountResult[0].count : 0;

  // Calculate pagination metadata
  const totalPages = Math.ceil(Number(totalCount) / limitNum);

  return c.json(
    {
      data: b2bProfileEntries,
      meta: {
        currentPage: pageNum,
        totalPages,
        totalCount: Number(totalCount),
        limit: limitNum,
      },
    },
    HttpStatusCodes.OK
  );
};

// Create new B2B profile entry route handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const b2bProfileEntry = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }

  // Check if user already has a B2B profile
  const existingProfile = await db
    .select()
    .from(b2bProfile)
    .where(eq(b2bProfile.userId, session.userId))
    .limit(1);

  if (existingProfile.length > 0) {
    return c.json(
      { message: "User already has a B2B profile" },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }

  // Check if username is already taken
  const existingUsername = await db
    .select()
    .from(b2bProfile)
    .where(eq(b2bProfile.username, b2bProfileEntry.username))
    .limit(1);

  if (existingUsername.length > 0) {
    return c.json(
      { message: "Username already taken" },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }

  const [inserted] = await db
    .insert(b2bProfile)
    .values({
      ...b2bProfileEntry,
      userId: session.userId,
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single B2B profile entry route handler
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const b2bProfileEntry = await db
    .select()
    .from(b2bProfile)
    .where(eq(b2bProfile.id, id))
    .limit(1);

  if (!b2bProfileEntry.length) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(b2bProfileEntry[0], HttpStatusCodes.OK);
};

// Get current user's B2B profile route handler
export const getMe: AppRouteHandler<GetMeRoute> = async (c) => {
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const b2bProfileEntry = await db
    .select()
    .from(b2bProfile)
    .where(eq(b2bProfile.userId, session.userId))
    .limit(1);

  if (!b2bProfileEntry.length) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(b2bProfileEntry[0], HttpStatusCodes.OK);
};

// Update B2B profile entry route handler
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

  try {
    // Check if username is provided (mandatory for update)
    if (!body.username) {
      return c.json(
        { message: "Username is required" },
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      );
    }

    // Check if B2B profile entry exists
    const existingEntry = await db
      .select()
      .from(b2bProfile)
      .where(eq(b2bProfile.id, id))
      .limit(1);

    if (!existingEntry.length) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      );
    }

    // Check if user owns this profile
    if (existingEntry[0] && existingEntry[0].userId !== session.userId) {
      return c.json(
        { message: "Not authorized to update this profile" },
        HttpStatusCodes.FORBIDDEN
      );
    }

    // Check if username is already taken (if being updated)
    if (
      body.username &&
      existingEntry[0] &&
      body.username !== existingEntry[0].username
    ) {
      const existingUsername = await db
        .select()
        .from(b2bProfile)
        .where(eq(b2bProfile.username, body.username))
        .limit(1);

      if (existingUsername.length > 0) {
        return c.json(
          {
            message: "Username already taken",
          },
          HttpStatusCodes.UNPROCESSABLE_ENTITY
        );
      }
    }

    // Update the B2B profile entry - only update fields that are provided
    const updateData: any = {
      username: body.username, // Username is mandatory
      updatedAt: new Date(),
    };

    // Handle images array
    if (body.images !== undefined) {
      updateData.images = body.images; // Set the entire array
    }

    // Add business fields only if they are provided and not empty strings
    if (body.businessName !== undefined && body.businessName !== "") {
      updateData.businessName = body.businessName;
    } else if (body.businessName === "") {
      updateData.businessName = null; // Set to null if empty string
    }

    if (body.businessType !== undefined) {
      updateData.businessType = body.businessType;
    }

    if (body.contactPerson !== undefined && body.contactPerson !== "") {
      updateData.contactPerson = body.contactPerson;
    } else if (body.contactPerson === "") {
      updateData.contactPerson = null;
    }

    if (body.phoneNumber !== undefined && body.phoneNumber !== "") {
      updateData.phoneNumber = body.phoneNumber;
    } else if (body.phoneNumber === "") {
      updateData.phoneNumber = null;
    }

    if (body.address !== undefined && body.address !== "") {
      updateData.address = body.address;
    } else if (body.address === "") {
      updateData.address = null;
    }

    if (body.subscriptionPlan !== undefined) {
      updateData.subscriptionPlan = body.subscriptionPlan;
    }

    if (body.planExpiryDate !== undefined) {
      updateData.planExpiryDate = body.planExpiryDate;
    }

    if (body.verified !== undefined) {
      updateData.verified = body.verified;
    }

    const [updated] = await db
      .update(b2bProfile)
      .set(updateData)
      .where(eq(b2bProfile.id, id))
      .returning();

    return c.json(updated, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Error updating B2B profile:", error);
    return c.json(
      {
        message: "Failed to update B2B profile",
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

// Update current user's B2B profile route handler
export const updateMe: AppRouteHandler<UpdateMeRoute> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    throw new Error(HttpStatusPhrases.UNAUTHORIZED);
  }

  // Check if username is provided (mandatory for update)
  if (!body.username) {
    throw new Error("Username is required");
  }

  // Check if user has a B2B profile
  const existingEntry = await db
    .select()
    .from(b2bProfile)
    .where(eq(b2bProfile.userId, session.userId))
    .limit(1);

  if (!existingEntry.length) {
    // Return an empty object or throw, depending on your OpenAPI/handler expectations
    return c.json(undefined, HttpStatusCodes.OK);
  }

  // Check if username is already taken (if being updated)
  if (
    body.username &&
    existingEntry[0] &&
    body.username !== existingEntry[0].username
  ) {
    const existingUsername = await db
      .select()
      .from(b2bProfile)
      .where(eq(b2bProfile.username, body.username))
      .limit(1);

    if (existingUsername.length > 0) {
      throw new Error("Username already taken");
    }
  }

  // Update the B2B profile entry - only update fields that are provided
  const updateData: any = {
    username: body.username, // Username is mandatory
    updatedAt: new Date(),
  };

  // Handle images array
  if (body.images !== undefined) {
    updateData.images = body.images; // Set the entire array
  }

  // Add business fields only if they are provided and not empty strings
  if (body.businessName !== undefined && body.businessName !== "") {
    updateData.businessName = body.businessName;
  } else if (body.businessName === "") {
    updateData.businessName = null; // Set to null if empty string
  }

  if (body.businessType !== undefined) {
    updateData.businessType = body.businessType;
  }

  if (body.contactPerson !== undefined && body.contactPerson !== "") {
    updateData.contactPerson = body.contactPerson;
  } else if (body.contactPerson === "") {
    updateData.contactPerson = null;
  }

  if (body.phoneNumber !== undefined && body.phoneNumber !== "") {
    updateData.phoneNumber = body.phoneNumber;
  } else if (body.phoneNumber === "") {
    updateData.phoneNumber = null;
  }

  if (body.address !== undefined && body.address !== "") {
    updateData.address = body.address;
  } else if (body.address === "") {
    updateData.address = null;
  }

  if (body.subscriptionPlan !== undefined) {
    updateData.subscriptionPlan = body.subscriptionPlan;
  }

  if (body.planExpiryDate !== undefined) {
    updateData.planExpiryDate = body.planExpiryDate;
  }

  if (body.verified !== undefined) {
    updateData.verified = body.verified;
  }

  const [updated] = await db
    .update(b2bProfile)
    .set(updateData)
    .where(eq(b2bProfile.userId, session.userId))
    .returning();

  // Always return the updated profile or undefined, matching the expected response type
  return c.json(updated, HttpStatusCodes.OK);
};

// Delete B2B profile entry route handler
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

  try {
    // Check if B2B profile entry exists
    const existingEntry = await db
      .select()
      .from(b2bProfile)
      .where(eq(b2bProfile.id, id))
      .limit(1);

    if (!existingEntry.length) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Check if user owns this profile
    if (existingEntry[0] && existingEntry[0].userId !== session.userId) {
      return c.json(
        { message: "Not authorized to delete this profile" },
        HttpStatusCodes.FORBIDDEN
      );
    }

    // Delete the B2B profile entry
    await db.delete(b2bProfile).where(eq(b2bProfile.id, id));

    return c.json(
      { message: "B2B profile entry deleted successfully" },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error deleting B2B profile:", error);
    return c.json(
      {
        error: {
          issues: [
            {
              code: "unprocessable_entity",
              path: [],
              message: "Failed to delete B2B profile",
            },
          ],
          name: "UnprocessableEntityError",
        },
        success: false,
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};
