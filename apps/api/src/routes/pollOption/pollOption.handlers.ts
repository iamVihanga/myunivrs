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
  UpdateRoute,
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

    return c.json({
      data: options.map((opt) => ({
        ...opt,
        createdAt:
          opt.createdAt instanceof Date
            ? opt.createdAt.toISOString()
            : opt.createdAt,
      })),
      meta: {
        currentPage: pageNum,
        totalPages: Math.ceil(Number(count) / limitNum),
        totalCount: Number(count),
        limit: limitNum,
      },
    });
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
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  try {
    // Verify poll exists and user owns it
    const pollData = await db
      .select()
      .from(poll)
      .where(eq(poll.id, data.pollId))
      .limit(1);

    if (!pollData.length) {
      return c.json(
        { message: "Poll not found" },
        HttpStatusCodes.UNPROCESSABLE_ENTITY
      );
    }

    if (!pollData[0] || pollData[0].createdBy !== session.userId) {
      return c.json(
        { message: "Not authorized to add options to this poll" },
        HttpStatusCodes.FORBIDDEN
      );
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
      return c.json(
        { message: "Failed to create poll option" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
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
  } catch (error) {
    console.error("Error creating poll option:", error);
    return c.json(
      { message: "Failed to create poll option" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  try {
    const option = await db
      .select()
      .from(pollOption)
      .where(eq(pollOption.id, id))
      .limit(1);

    if (!option.length) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    if (!option[0]) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }
    return c.json({
      ...option[0],
      createdAt:
        option[0].createdAt instanceof Date
          ? option[0].createdAt.toISOString()
          : option[0].createdAt,
    });
  } catch (error) {
    console.error("Error fetching poll option:", error);
    return c.json(
      { message: "Failed to fetch poll option" },
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
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    if (!option[0] || option[0].pollCreatedBy !== session.userId) {
      return c.json(
        { message: "Not authorized to update this option" },
        HttpStatusCodes.FORBIDDEN
      );
    }

    const [updated] = await db
      .update(pollOption)
      .set({
        optionText: data.optionText,
      })
      .where(eq(pollOption.id, id))
      .returning();

    if (!updated) {
      return c.json(
        { message: "Failed to update poll option" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    return c.json({
      ...updated,
      createdAt:
        updated.createdAt instanceof Date
          ? updated.createdAt.toISOString()
          : updated.createdAt,
    });
  } catch (error) {
    console.error("Error updating poll option:", error);
    return c.json(
      { message: "Failed to update poll option" },
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
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    if (!option[0] || option[0].pollCreatedBy !== session.userId) {
      return c.json(
        { message: "Not authorized to delete this option" },
        HttpStatusCodes.FORBIDDEN
      );
    }

    await db.delete(pollOption).where(eq(pollOption.id, id));

    return c.json(
      { message: "Poll option deleted successfully" },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error deleting poll option:", error);
    return c.json(
      { message: "Failed to delete poll option" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
