import { desc, eq, sql } from "drizzle-orm";
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
} from "./pollOption.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    pollId,
  } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  try {
    const options = await db
      .select()
      .from(pollOption)
      .where(pollId ? eq(pollOption.pollId, pollId) : undefined)
      .orderBy(
        sort === "asc" ? pollOption.createdAt : desc(pollOption.createdAt)
      )
      .limit(limitNum)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(pollOption)
      .where(pollId ? eq(pollOption.pollId, pollId) : undefined);

    const count = countResult && countResult[0] ? countResult[0].count : 0;

    return c.json(
      {
        data: options[0]
          ? {
              pollId: options[0].pollId,
              id: options[0].id,
              optionText: options[0].optionText,
              voteCount: options[0].voteCount ?? null,
              createdAt:
                options[0].createdAt instanceof Date
                  ? options[0].createdAt.toISOString()
                  : (options[0].createdAt ?? null),
            }
          : {
              pollId: "",
              id: "",
              optionText: "",
              voteCount: null,
              createdAt: null,
            },
        meta: {
          limit: limitNum,
          currentPage: pageNum,
          totalPages: Math.ceil(Number(count) / limitNum),
          totalCount: Number(count),
        },
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error listing poll options:", error);
    return c.json(
      { message: "Failed to list poll options" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const data = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    throw new Error(HttpStatusPhrases.UNAUTHORIZED);
  }

  // Verify poll exists and user owns it
  const pollData = await db
    .select()
    .from(poll)
    .where(eq(poll.id, data.pollId))
    .limit(1);

  if (!pollData.length) {
    throw new Error("Poll not found");
  }

  if (!pollData[0] || pollData[0].createdBy !== session.userId) {
    throw new Error("Not authorized to add options to this poll");
  }

  const [created] = await db
    .insert(pollOption)
    .values({
      ...data,
      voteCount: 0,
      createdAt: new Date(),
    })
    .returning();

  if (!created) {
    throw new Error("Failed to create poll option");
  }
  return c.json(
    {
      ...created,
      createdAt:
        created.createdAt instanceof Date
          ? created.createdAt.toISOString()
          : created.createdAt,
    },
    HttpStatusCodes.CREATED
  );
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  try {
    const option = await db
      .select()
      .from(pollOption)
      .where(eq(pollOption.id, id))
      .limit(1);

    if (!option.length || !option[0]) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }
    return c.json(
      {
        ...option[0],
        createdAt:
          option[0].createdAt instanceof Date
            ? option[0].createdAt.toISOString()
            : option[0].createdAt,
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error fetching poll option:", error);
    // Let the framework handle 422/validation errors, only return 404 and 200 explicitly
    throw error;
  }
};

export const remove: AppRouteHandler<DeleteRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { success: false, message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.OK
    );
  }

  try {
    // Get option and check poll ownership
    const option = await db
      .select({
        option: pollOption,
        pollCreatedBy: poll.createdBy,
      })
      .from(pollOption)
      .leftJoin(poll, eq(pollOption.pollId, poll.id))
      .where(eq(pollOption.id, id))
      .limit(1);

    if (!option.length) {
      return c.json(
        { success: false, message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.OK
      );
    }

    if (!option[0] || option[0].pollCreatedBy !== session.userId) {
      return c.json(
        { success: false, message: "Not authorized to delete this option" },
        HttpStatusCodes.OK
      );
    }

    await db.delete(pollOption).where(eq(pollOption.id, id));

    return c.json(
      { success: true, message: "Poll option deleted successfully" },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error deleting poll option:", error);
    return c.json(
      { success: false, message: "Failed to delete poll option" },
      HttpStatusCodes.OK
    );
  }
};
