import { and, desc, eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@/db";
import type { AppRouteHandler } from "@/types";
import { pollOption, pollVote } from "@repo/database/schemas";
import type {
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  ListRoute,
} from "./pollVote.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    pollId,
    optionId,
  } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  try {
    const query = db
      .select()
      .from(pollVote)
      .where(
        and(
          pollId ? eq(pollVote.pollId, pollId) : undefined,
          optionId ? eq(pollVote.optionId, optionId) : undefined
        )
      )
      .orderBy(sort === "asc" ? pollVote.createdAt : desc(pollVote.createdAt))
      .limit(limitNum)
      .offset(offset);

    const votes = await query;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(pollVote)
      .where(
        and(
          pollId ? eq(pollVote.pollId, pollId) : undefined,
          optionId ? eq(pollVote.optionId, optionId) : undefined
        )
      );
    const count = countResult?.[0]?.count ?? 0;

    return c.json({
      data: votes.map((vote) => ({
        ...vote,
        createdAt:
          vote.createdAt instanceof Date
            ? vote.createdAt.toISOString()
            : vote.createdAt,
      })),
      meta: {
        currentPage: pageNum,
        totalPages: Math.ceil(Number(count) / limitNum),
        totalCount: Number(count),
        limit: limitNum,
      },
      message: "Votes fetched successfully",
    });
  } catch (error) {
    console.error("Error listing votes:", error);
    return c.json(
      { message: "Failed to list votes" },
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
    // Check if user has already voted on this poll
    const existingVote = await db
      .select()
      .from(pollVote)
      .where(
        and(
          eq(pollVote.pollId, data.pollId),
          eq(pollVote.userId, session.userId)
        )
      )
      .limit(1);

    if (existingVote.length > 0) {
      return c.json(
        { message: "User has already voted on this poll" },
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      );
    }

    // Create vote and increment option count atomically
    const [vote] = await db.transaction(async (tx) => {
      const [createdVote] = await tx
        .insert(pollVote)
        .values({
          pollId: data.pollId,
          optionId: data.optionId,
          userId: session.userId,
          createdAt: new Date(),
        })
        .returning();

      await tx
        .update(pollOption)
        .set({
          voteCount: sql`${pollOption.voteCount} + 1`,
        })
        .where(eq(pollOption.id, data.optionId));

      return [createdVote];
    });

    return c.json(
      vote
        ? {
            ...vote,
            createdAt:
              vote.createdAt instanceof Date
                ? vote.createdAt.toISOString()
                : vote.createdAt,
          }
        : { message: "Vote creation failed" },
      HttpStatusCodes.CREATED
    );
  } catch (error) {
    console.error("Error creating vote:", error);
    return c.json(
      { message: "Failed to create vote" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  try {
    const vote = await db
      .select()
      .from(pollVote)
      .where(eq(pollVote.id, id))
      .limit(1);

    if (!vote.length) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    if (!vote[0]) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }
    return c.json({
      ...vote[0],
      createdAt:
        vote[0].createdAt instanceof Date
          ? vote[0].createdAt.toISOString()
          : vote[0].createdAt,
    });
  } catch (error) {
    console.error("Error fetching vote:", error);
    return c.json(
      { message: "Failed to fetch vote" },
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
    const vote = await db
      .select()
      .from(pollVote)
      .where(eq(pollVote.id, id))
      .limit(1);

    if (!vote.length) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    if (!vote[0] || vote[0].userId !== session.userId) {
      return c.json(
        { message: "Not authorized to remove this vote" },
        HttpStatusCodes.FORBIDDEN
      );
    }

    // Remove vote and decrement option count atomically
    if (!vote[0]) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }
    await db.transaction(async (tx) => {
      await tx.delete(pollVote).where(eq(pollVote.id, id));
      if (vote[0]) {
        await tx
          .update(pollOption)
          .set({
            voteCount: sql`${pollOption.voteCount} - 1`,
          })
          .where(eq(pollOption.id, vote[0].optionId));
      }
    });

    return c.json({ message: "Vote removed successfully" }, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Error removing vote:", error);
    return c.json(
      { message: "Failed to remove vote" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
