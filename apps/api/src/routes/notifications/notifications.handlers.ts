import { eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@/db";
import type { AppRouteHandler } from "@/types";
import { notifications } from "@repo/database/schemas";

import type {
  CreateRoute,
  DeleteRoute,
  GetOneRoute,
  ListRoute,
  UpdateRoute,
} from "./notifications.routes";

// List notifications (optional: you could add userId-based filtering)
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const { page = "1", limit = "10" } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  const [results, totalCountResult] = await Promise.all([
    db.query.notifications.findMany({
      limit: limitNum,
      offset,
      orderBy: (fields) => fields.createdAt,
    }),
    db.select({ count: sql<number>`count(*)` }).from(notifications),
  ]);

  const totalCount = totalCountResult[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  const normalized = results.map((n) => ({
    ...n,
    createdAt: n.createdAt?.toISOString?.() ?? null,
    updatedAt: n.updatedAt?.toISOString?.() ?? null,
  }));

  return c.json(
    {
      data: normalized,
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

// Create notification
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const session = c.get("session");
  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const body = c.req.valid("json");
  const [created] = await db.insert(notifications).values(body).returning();

  return c.json(created, HttpStatusCodes.CREATED);
};

// Get single notification
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const result = await db.query.notifications.findFirst({
    where: eq(notifications.id, id),
  });

  if (!result) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const normalized = {
    ...result,
    createdAt: result.createdAt?.toISOString?.() ?? null,
    updatedAt: result.updatedAt?.toISOString?.() ?? null,
  };

  return c.json(normalized, HttpStatusCodes.OK);
};

// Update notification (e.g., mark as read)
export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const data = c.req.valid("json");

  const existing = await db.query.notifications.findFirst({
    where: eq(notifications.id, id),
  });

  if (!existing) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const [updated] = await db
    .update(notifications)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(notifications.id, id))
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete notification
export const remove: AppRouteHandler<DeleteRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const existing = await db.query.notifications.findFirst({
    where: eq(notifications.id, id),
  });

  if (!existing) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  await db.delete(notifications).where(eq(notifications.id, id));

  return c.json(
    { message: "Notification deleted successfully" },
    HttpStatusCodes.OK
  );
};
