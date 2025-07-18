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

    // Convert createdAt in options to ISO string if it's a Date
    const options = optionsRaw.map((opt) => ({
      ...opt,
      createdAt:
        opt.createdAt instanceof Date
          ? opt.createdAt.toISOString()
          : opt.createdAt,
    }));

    if (!pollData[0]) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    const pollWithOptions = {
      ...pollData[0],
      createdAt:
        pollData[0].createdAt instanceof Date
          ? pollData[0].createdAt.toISOString()
          : pollData[0].createdAt,
      expiresAt:
        pollData[0].expiresAt instanceof Date
          ? pollData[0].expiresAt.toISOString()
          : pollData[0].expiresAt,
      options,
    };

    return c.json({ success: true, data: pollWithOptions }, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Error fetching poll:", error);
    return c.json(
      { message: "Failed to fetch poll" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const data = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
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
      return c.json(
        { message: "Not authorized to update this poll" },
        HttpStatusCodes.FORBIDDEN
      );
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
      return c.json(
        { message: "Failed to update poll" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    const options = await db
      .select()
      .from(pollOption)
      .where(eq(pollOption.pollId, id));

    return c.json({
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
    });
  } catch (error) {
    console.error("Error updating poll:", error);
    return c.json(
      { message: "Failed to update poll" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const remove: AppRouteHandler<DeleteRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
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
      return c.json(
        { message: "Not authorized to delete this poll" },
        HttpStatusCodes.FORBIDDEN
      );
    }

    // Delete poll (options will be deleted automatically due to CASCADE)
    await db.delete(poll).where(eq(poll.id, id));

    return c.json({ message: "Poll deleted successfully" }, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Error deleting poll:", error);
    return c.json(
      { message: "Failed to delete poll" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
