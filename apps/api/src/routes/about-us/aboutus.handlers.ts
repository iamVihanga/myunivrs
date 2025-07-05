import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/types";

import { db } from "@/db";
import { aboutus } from "@repo/database";
import { GetRoute, UpdateRoute } from "./aboutus.routes";

// ✅ GET: Fetch About Us data
export const get: AppRouteHandler<GetRoute> = async (c) => {
  const entry = await db.query.aboutus.findFirst();

  if (!entry) {
    return c.json(
      { message: "About Us content not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(entry, HttpStatusCodes.OK);
};

// Update aboutus entry route handler
export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Check if aboutus entry exists
  const existingEntry = await db.query.aboutus.findFirst();

  if (!existingEntry) {
    const [created] = await db.insert(aboutus).values(body).returning();
    return c.json(created, HttpStatusCodes.OK);
  }

  // Update the aboutus entry
  const [updated] = await db
    .update(aboutus)
    .set({ ...body, updatedAt: new Date() })
    .returning();

  return c.json(updated, HttpStatusCodes.OK);
};
