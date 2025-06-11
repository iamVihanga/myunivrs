import { desc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/types";

import { db } from "@/db";
import { housing } from "@repo/database/schemas";

import type { CreateRoute, GetOneRoute, ListRoute } from "./housing.routes";

// List housing entries route handler
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const housingEntries = await db.query.housing.findMany({
    orderBy(fields) {
      return desc(fields.createdAt);
    }
  });

  return c.json(housingEntries);
};

// Create new housing entry route handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const housingEntry = c.req.valid("json");

  const [inserted] = await db.insert(housing).values(housingEntry).returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get single housing entry route handler
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const housingEntry = await db.query.housing.findFirst({
    where: eq(housing.id, id)
  });

  if (!housingEntry)
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );

  return c.json(housingEntry, HttpStatusCodes.OK);
};
