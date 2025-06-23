// test.handlers.ts

import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@/db";
import type { AppRouteHandler } from "@/types";
import { test } from "@repo/database/schemas";

import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute,
} from "./test.routes";

// List all tests
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const allTests = await db.query.test.findMany();
  return c.json(allTests, HttpStatusCodes.OK);
};

// Create a new test
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const newTest = c.req.valid("json");
  const [created] = await db.insert(test).values(newTest).returning();
  return c.json(created, HttpStatusCodes.CREATED);
};

// Get one test by ID
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const foundTest = await db.query.test.findFirst({
    where: eq(test.id, id),
  });

  if (!foundTest) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(foundTest, HttpStatusCodes.OK);
};

// Update (patch) a test
export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const [updated] = await db
    .update(test)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(test.id, id))
    .returning();

  if (!updated) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete a test
export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const result = await db.delete(test).where(eq(test.id, id));

  if (result.rows.length === 0) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
