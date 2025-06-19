import { desc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/types";

import { db } from "@/db";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";
import { university } from "@repo/database/schemas";

import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute,
} from "./university.routes";

// List universities route handler
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const universities = await db.query.university.findMany({
    orderBy(fields) {
      return desc(fields.createdAt);
    },
  });

  return c.json(universities);
};

// Create new university route handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const uni = c.req.valid("json");

  const [inserted] = await db.insert(university).values(uni).returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single university route handler
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const uni = await db.query.university.findFirst({
    where: eq(university.id, String(id)),
  });

  if (!uni)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );

  return c.json(uni, HttpStatusCodes.OK);
};

// Update university route handler
export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  if (Object.keys(updates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }

  const [updatedUni] = await db
    .update(university)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(university.id, String(id)))
    .returning();

  if (!updatedUni) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updatedUni, HttpStatusCodes.OK);
};

// Remove university route handler
export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const result = await db
    .delete(university)
    .where(eq(university.id, String(id)));

  if (result.rows.length === 0) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
