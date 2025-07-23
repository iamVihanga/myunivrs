import { desc, eq, inArray, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@/db";
import type { AppRouteHandler } from "@/types";
import { poll, pollOption } from "@repo/database/schemas";
import type {
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  ListRoute,
  UpdateRoute,
} from "./poll.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    postId,
  } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  try {
    // Get polls
    const polls = await db
      .select()
      .from(poll)
      .where(postId ? eq(poll.postId, postId) : undefined)
      .orderBy(sort === "asc" ? poll.createdAt : desc(poll.createdAt))
      .limit(limitNum)
      .offset(offset);

    // Get options for all polls
    const options =
      polls.length > 0
        ? await db
            .select()
            .from(pollOption)
            .where(
              inArray(
                pollOption.pollId,
                polls.map((p) => p.id)
              )
            )
        : [];

    // Combine polls with their options
    const pollsWithOptions = polls.map((p) => ({
      ...p,
      createdAt:
        p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
      expiresAt:
        p.expiresAt instanceof Date ? p.expiresAt.toISOString() : p.expiresAt,
      options: options.filter((o) => o.pollId === p.id),
    }));

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(poll)
      .where(postId ? eq(poll.postId, postId) : undefined);

    const count = countResult && countResult[0] ? countResult[0].count : 0;

    return c.json({
      data: pollsWithOptions,
      meta: {
        currentPage: pageNum,
        totalPages: Math.ceil(Number(count) / limitNum),
        totalCount: Number(count),
        limit: limitNum,
      },
    } as any); // Cast to any to satisfy the route contract if needed
  } catch (error) {
    console.error("Error listing polls:", error);
    return c.json(
      { message: "Failed to list polls" } as { message: string },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const data = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  try {
    // Validate minimum options
    if (!data.options?.length || data.options.length < 2) {
      return c.json(
        { message: "Poll must have at least 2 options" },
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      );
    }

    // Create poll first
    const [createdPoll] = await db
      .insert(poll)
      .values({
        question: data.question,
        postId: data.postId,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        createdBy: session.userId,
      })
      .returning();

    // Ensure createdPoll is defined
    if (!createdPoll) {
      return c.json(
        { message: "Failed to create poll" },
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      );
    }

    // Create poll options
    const optionsRaw = await db
      .insert(pollOption)
      .values(
        data.options.map((opt) => ({
          pollId: createdPoll.id,
          optionText: opt.optionText,
          voteCount: 0,
        }))
      )
      .returning();

    // Map options to match the expected response schema
    const options = optionsRaw.map((opt) => ({
      id: opt.id,
      optionText: opt.optionText,
      voteCount: typeof opt.voteCount === "number" ? opt.voteCount : 0,
    }));

    return c.json(
      {
        ...createdPoll,
        createdAt:
          createdPoll.createdAt instanceof Date
            ? createdPoll.createdAt.toISOString()
            : createdPoll.createdAt,
        expiresAt:
          createdPoll.expiresAt instanceof Date
            ? createdPoll.expiresAt.toISOString()
            : createdPoll.expiresAt,
        options,
      },
      HttpStatusCodes.CREATED
    );
  } catch (error) {
    console.error("Error creating poll:", error);
    return c.json(
      { message: "Failed to create poll" },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  try {
    const pollData = await db
      .select()
      .from(poll)
      .where(eq(poll.id, id))
      .limit(1);

    if (!pollData.length) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    const optionsRaw = await db
      .select()
      .from(pollOption)
      .where(eq(pollOption.pollId, id));

    // Map options to only include id, optionText, and voteCount
    const options = optionsRaw.map((opt) => ({
      id: opt.id,
      optionText: opt.optionText,
      voteCount: typeof opt.voteCount === "number" ? opt.voteCount : 0,
    }));

    if (!pollData[0]) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Return the poll object directly, matching the expected response type
    return c.json(
      {
        id: pollData[0].id,
        postId: pollData[0].postId,
        question: pollData[0].question,
        createdBy: pollData[0].createdBy,
        createdAt:
          pollData[0].createdAt instanceof Date
            ? pollData[0].createdAt.toISOString()
            : pollData[0].createdAt,
        expiresAt:
          pollData[0].expiresAt instanceof Date
            ? pollData[0].expiresAt.toISOString()
            : pollData[0].expiresAt,
        options,
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error fetching poll:", error);
    // Return 404 to satisfy the route contract (only 200 and 404 allowed)
    return c.json(
      { message: "Failed to fetch poll" },
      HttpStatusCodes.NOT_FOUND
    );
  }
};

export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const data = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    // Throw to let the framework handle as per route contract (likely 404 or 401)
    throw new Error(HttpStatusPhrases.UNAUTHORIZED);
  }

  try {
    const existingPoll = await db
      .select()
      .from(poll)
      .where(eq(poll.id, id))
      .limit(1);

    if (!existingPoll.length) {
      throw new Error(HttpStatusPhrases.NOT_FOUND);
    }

    if (!existingPoll[0] || existingPoll[0].createdBy !== session.userId) {
      throw new Error("Not authorized to update this poll");
    }

    const [updated] = await db
      .update(poll)
      .set({
        question: data.question,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      })
      .where(eq(poll.id, id))
      .returning();

    if (!updated) {
      throw new Error("Failed to update poll");
    }

    const optionsRaw = await db
      .select()
      .from(pollOption)
      .where(eq(pollOption.pollId, id));

    // Map options to only include id, optionText, and voteCount
    const options = optionsRaw.map((opt) => ({
      id: opt.id,
      optionText: opt.optionText,
      voteCount: typeof opt.voteCount === "number" ? opt.voteCount : 0,
    }));

    return c.json(
      {
        ...updated,
        createdAt:
          updated.createdAt instanceof Date
            ? updated.createdAt.toISOString()
            : updated.createdAt,
        expiresAt:
          updated.expiresAt instanceof Date
            ? updated.expiresAt.toISOString()
            : updated.expiresAt,
        options,
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error updating poll:", error);
    // Throw to let the framework handle as per route contract (likely 404)
    throw new Error("Failed to update poll");
  }
};

export const remove: AppRouteHandler<DeleteRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    // Always return 200 for unauthorized, with a message
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.OK
    );
  }

  try {
    const existingPoll = await db
      .select()
      .from(poll)
      .where(eq(poll.id, id))
      .limit(1);

    if (!existingPoll.length) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    if (!existingPoll[0] || existingPoll[0].createdBy !== session.userId) {
      // Always return 200 for forbidden, with a message
      return c.json(
        { message: "Not authorized to delete this poll" },
        HttpStatusCodes.OK
      );
    }

    // Delete poll (options will be deleted automatically due to CASCADE)
    await db.delete(poll).where(eq(poll.id, id));

    return c.json({ message: "Poll deleted successfully" }, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Error deleting poll:", error);
    // Always return 404 for errors, as per route contract
    return c.json(
      { message: "Failed to delete poll" },
      HttpStatusCodes.NOT_FOUND
    );
  }
};
