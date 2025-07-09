import { and, desc, eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@/db";
import type { AppRouteHandler } from "@/types";
import { comment, post, vote } from "@repo/database/schemas";
import type {
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  ListRoute,
  UpdateRoute,
} from "./vote.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    postId,
    commentId,
    userId,
  } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  const whereConditions = [];
  if (postId) whereConditions.push(eq(vote.postId, postId));
  if (commentId) whereConditions.push(eq(vote.commentId, commentId));
  if (userId) whereConditions.push(eq(vote.userId, userId));

  const query = db.query.vote.findMany({
    limit: limitNum,
    offset,
    where: whereConditions.length ? and(...whereConditions) : undefined,
    orderBy: (fields) =>
      sort.toLowerCase() === "asc" ? fields.createdAt : desc(fields.createdAt),
    with: {
      user: true,
      post: true,
      comment: true,
    },
  });

  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(vote)
    .where(whereConditions.length ? and(...whereConditions) : undefined);

  const [votes, _totalCount] = await Promise.all([query, totalCountQuery]);
  const totalCount = _totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  return c.json(
    {
      data: votes,
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

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const data = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json({ message: HttpStatusPhrases.UNAUTHORIZED }, 422);
  }

  // Check for existing vote
  const existingVote = await db.query.vote.findFirst({
    where: and(
      eq(vote.userId, session.userId),
      data.postId
        ? eq(vote.postId, data.postId)
        : eq(vote.commentId, data.commentId!)
    ),
  });

  if (existingVote) {
    return c.json({ message: "User has already voted on this item" }, 422);
  }

  const insertData = {
    ...data,
    userId: session.userId,
    createdAt: new Date(),
  };

  const [inserted] = await db.transaction(async (tx) => {
    const [voteRow] = await tx.insert(vote).values(insertData).returning();

    // Update vote score
    if (data.postId) {
      await tx
        .update(post)
        .set({ voteScore: sql`vote_score + ${data.value}` })
        .where(eq(post.id, data.postId));
    } else if (data.commentId) {
      await tx
        .update(comment)
        .set({ voteScore: sql`vote_score + ${data.value}` })
        .where(eq(comment.id, data.commentId));
    }

    return [voteRow];
  });

  return c.json(inserted, HttpStatusCodes.CREATED);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const voteEntry = await db.query.vote.findFirst({
    where: eq(vote.id, id),
    with: {
      user: true,
      post: true,
      comment: true,
    },
  });

  if (!voteEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(voteEntry, HttpStatusCodes.OK);
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

  const existingVote = await db.query.vote.findFirst({
    where: eq(vote.id, id),
  });

  if (!existingVote) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  if (existingVote.userId !== session.userId) {
    return c.json(
      { message: "Not authorized to update this vote" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [updatedVote] = await db.transaction(async (tx) => {
    // Calculate vote score change
    const scoreDiff = data.value - existingVote.value;

    const [updated] = await tx
      .update(vote)
      .set(data)
      .where(eq(vote.id, id))
      .returning();

    // Update target's vote score
    if (existingVote.postId) {
      await tx
        .update(post)
        .set({ voteScore: sql`vote_score + ${scoreDiff}` })
        .where(eq(post.id, existingVote.postId));
    } else if (existingVote.commentId) {
      await tx
        .update(comment)
        .set({ voteScore: sql`vote_score + ${scoreDiff}` })
        .where(eq(comment.id, existingVote.commentId));
    }

    return [updated];
  });

  if (!updatedVote) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updatedVote, HttpStatusCodes.OK);
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

  const existingVote = await db.query.vote.findFirst({
    where: eq(vote.id, id),
  });

  if (!existingVote) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  if (existingVote.userId !== session.userId) {
    return c.json(
      { message: "Not authorized to delete this vote" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  await db.transaction(async (tx) => {
    // Remove vote score
    if (existingVote.postId) {
      await tx
        .update(post)
        .set({ voteScore: sql`vote_score - ${existingVote.value}` })
        .where(eq(post.id, existingVote.postId));
    } else if (existingVote.commentId) {
      await tx
        .update(comment)
        .set({ voteScore: sql`vote_score - ${existingVote.value}` })
        .where(eq(comment.id, existingVote.commentId));
    }

    await tx.delete(vote).where(eq(vote.id, id));
  });

  return new Response(null, { status: HttpStatusCodes.NO_CONTENT });
};
