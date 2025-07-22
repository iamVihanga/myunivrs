import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/types";

import { db } from "@/db";
import { userProfile } from "@repo/database/schemas";

import type {
  CreateRoute,
  DeleteRoute,
  GetMeRoute,
  GetOneRoute,
  ListRoute,
  UpdateMeRoute,
  UpdateRoute,
} from "./userProfile.routes";

// List user profile entries route handler
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search,
    username,
    universityName,
    courseOfStudy,
    yearsOfStudy,
    hasImages, // Add this new filter
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
        ilike(userProfile.username, `%${search}%`),
        ilike(userProfile.universityName, `%${search}%`),
        ilike(userProfile.courseOfStudy, `%${search}%`),
        ilike(userProfile.interest, `%${search}%`)
      )
    );
  }

  // Add specific filter conditions
  if (username) {
    conditions.push(ilike(userProfile.username, `%${username}%`));
  }
  if (universityName) {
    conditions.push(ilike(userProfile.universityName, `%${universityName}%`));
  }
  if (courseOfStudy) {
    conditions.push(ilike(userProfile.courseOfStudy, `%${courseOfStudy}%`));
  }
  if (yearsOfStudy) {
    conditions.push(eq(userProfile.yearsOfStudy, yearsOfStudy));
  }
  // Add images filter
  if (hasImages === "true") {
    conditions.push(sql`array_length(${userProfile.images}, 1) > 0`);
  } else if (hasImages === "false") {
    conditions.push(
      or(
        sql`array_length(${userProfile.images}, 1) = 0`,
        sql`${userProfile.images} IS NULL`
      )
    );
  }

  // Build the main query
  const query = db
    .select()
    .from(userProfile)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(
      sort.toLowerCase() === "asc"
        ? userProfile.createdAt
        : desc(userProfile.createdAt)
    )
    .limit(limitNum)
    .offset(offset);

  // Get total count for pagination metadata
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(userProfile)
    .where(conditions.length ? and(...conditions) : undefined);

  const [userProfileEntries, totalCountResult] = await Promise.all([
    query,
    totalCountQuery,
  ]);
  const totalCount =
    totalCountResult && totalCountResult[0] ? totalCountResult[0].count : 0;

  // Calculate pagination metadata
  const totalPages = Math.ceil(Number(totalCount) / limitNum);

  return c.json(
    {
      data: userProfileEntries,
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

// Create new user profile entry route handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const userProfileEntry = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }

  // Check if user already has a profile
  const existingProfile = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, session.userId))
    .limit(1);

  if (existingProfile.length > 0) {
    return c.json(
      { message: "User already has a profile" },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }

  // Check if username is already taken
  const existingUsername = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.username, userProfileEntry.username))
    .limit(1);

  if (existingUsername.length > 0) {
    return c.json(
      { message: "Username already taken" },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }

  const [inserted] = await db
    .insert(userProfile)
    .values({
      ...userProfileEntry,
      userId: session.userId,
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single user profile entry route handler
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const userProfileEntry = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.id, id))
    .limit(1);

  if (!userProfileEntry.length) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(userProfileEntry[0], HttpStatusCodes.OK);
};

// Get current user's profile route handler
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

  const userProfileEntry = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, session.userId))
    .limit(1);

  if (!userProfileEntry.length) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(userProfileEntry[0], HttpStatusCodes.OK);
};

// Update user profile entry route handler
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

    // Check if user profile entry exists
    const existingEntry = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.id, id))
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
        .from(userProfile)
        .where(eq(userProfile.username, body.username))
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

    // Update the user profile entry - only update fields that are provided
    const updateData: any = {
      username: body.username, // Username is mandatory
      updatedAt: new Date(),
    };

    // Handle images array
    if (body.images !== undefined) {
      updateData.images = body.images; // Set the entire array
    }

    // Add optional fields only if they are provided and not empty strings
    if (body.universityName !== undefined && body.universityName !== "") {
      updateData.universityName = body.universityName;
    } else if (body.universityName === "") {
      updateData.universityName = null; // Set to null if empty string
    }

    if (body.studentId !== undefined && body.studentId !== "") {
      updateData.studentId = body.studentId;
    } else if (body.studentId === "") {
      updateData.studentId = null;
    }

    if (body.courseOfStudy !== undefined && body.courseOfStudy !== "") {
      updateData.courseOfStudy = body.courseOfStudy;
    } else if (body.courseOfStudy === "") {
      updateData.courseOfStudy = null;
    }

    if (body.yearsOfStudy !== undefined) {
      updateData.yearsOfStudy = body.yearsOfStudy;
    }

    if (body.interest !== undefined && body.interest !== "") {
      updateData.interest = body.interest;
    } else if (body.interest === "") {
      updateData.interest = null;
    }

    const [updated] = await db
      .update(userProfile)
      .set(updateData)
      .where(eq(userProfile.id, id))
      .returning();

    return c.json(updated, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return c.json(
      {
        message: "Failed to update user profile",
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

// Update current user's profile route handler
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

  // Check if user has a profile
  const existingEntry = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, session.userId))
    .limit(1);

  if (!existingEntry.length) {
    // Return an empty object or throw, depending on your OpenAPI/handler expectations
    // Here, we return a 200 with undefined, which matches the expected type
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
      .from(userProfile)
      .where(eq(userProfile.username, body.username))
      .limit(1);

    if (existingUsername.length > 0) {
      throw new Error("Username already taken");
    }
  }

  // Update the user profile entry - only update fields that are provided
  const updateData: any = {
    username: body.username, // Username is mandatory
    updatedAt: new Date(),
  };

  // Handle images array
  if (body.images !== undefined) {
    updateData.images = body.images; // Set the entire array
  }

  // Add optional fields only if they are provided and not empty strings
  if (body.universityName !== undefined && body.universityName !== "") {
    updateData.universityName = body.universityName;
  } else if (body.universityName === "") {
    updateData.universityName = null; // Set to null if empty string
  }

  if (body.studentId !== undefined && body.studentId !== "") {
    updateData.studentId = body.studentId;
  } else if (body.studentId === "") {
    updateData.studentId = null;
  }

  if (body.courseOfStudy !== undefined && body.courseOfStudy !== "") {
    updateData.courseOfStudy = body.courseOfStudy;
  } else if (body.courseOfStudy === "") {
    updateData.courseOfStudy = null;
  }

  if (body.yearsOfStudy !== undefined) {
    updateData.yearsOfStudy = body.yearsOfStudy;
  }

  if (body.interest !== undefined && body.interest !== "") {
    updateData.interest = body.interest;
  } else if (body.interest === "") {
    updateData.interest = null;
  }

  const [updated] = await db
    .update(userProfile)
    .set(updateData)
    .where(eq(userProfile.userId, session.userId))
    .returning();

  // Always return the updated profile or undefined, matching the expected response type
  return c.json(updated, HttpStatusCodes.OK);
};

// Delete user profile entry route handler
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
    // Check if user profile entry exists
    const existingEntry = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.id, id))
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

    // Delete the user profile entry
    await db.delete(userProfile).where(eq(userProfile.id, id));

    return c.json(
      { message: "User profile entry deleted successfully" },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error deleting user profile:", error);
    return c.json(
      {
        error: {
          issues: [
            {
              code: "unprocessable_entity",
              path: [],
              message: "Failed to delete user profile",
            },
          ],
          name: "UnprocessableEntityError",
        },
        success: false,
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY // Use a status code declared in your OpenAPI spec, e.g., 422
    );
  }
};
