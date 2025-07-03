import { desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/types";

import { db } from "@/db";
import { ads } from "@repo/database/schemas";

import type {
  CreateAdsRoute,
  DeleteAdRoute,
  GetOneAdRoute,
  ListAdsRoute,
  UpdateAdRoute,
} from "./ads.routes";

// List ads handler
export const list: AppRouteHandler<ListAdsRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "asc",
    search,
  } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  const query = db.query.ads.findMany({
    limit: limitNum,
    offset,
    where: (fields, { ilike, or, and }) => {
      const conditions = [];
      if (search) {
        conditions.push(
          or(
            ilike(fields.title, `%${search}%`),
            ilike(fields.description, `%${search}%`),
            ilike(fields.companyName, `%${search}%`),
            ilike(fields.contactInformation, `%${search}%`)
          )
        );
      }
      return conditions.length ? and(...conditions) : undefined;
    },
    orderBy: (fields) =>
      sort.toLowerCase() === "asc" ? fields.createdAt : desc(fields.createdAt),
  });

  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(ads)
    .where(
      search
        ? or(
            ilike(ads.title, `%${search}%`),
            ilike(ads.description, `%${search}%`),
            ilike(ads.companyName, `%${search}%`),
            ilike(ads.contactInformation, `%${search}%`)
          )
        : undefined
    );

  const [results, totalResult] = await Promise.all([query, totalCountQuery]);
  const totalCount = totalResult[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limitNum);

  const normalized = results.map((entry) => ({
    ...entry,
    images: Array.isArray(entry.images) ? entry.images : [],
    createdAt:
      entry.createdAt instanceof Date
        ? entry.createdAt.toISOString()
        : entry.createdAt,
    updatedAt:
      entry.updatedAt instanceof Date
        ? entry.updatedAt.toISOString()
        : entry.updatedAt,
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

// Create ad handler
export const create: AppRouteHandler<CreateAdsRoute> = async (c) => {
  const ad = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const insertData = {
    title: ad.title,
    postType: ad.postType,
    images: ad.images ?? [],
    description: ad.description ?? null,
    contactInformation: ad.contactInformation ?? null,
    isFeatured: ad.isFeatured ?? false,
    companyName: ad.companyName ?? null,
    occurrence: ad.occurrence ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [createdAd] = await db.insert(ads).values(insertData).returning();
  return c.json(createdAd, HttpStatusCodes.CREATED);
};

// Get single ad handler
export const getOne: AppRouteHandler<GetOneAdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const adEntry = await db.query.ads.findFirst({
    where: eq(ads.id, id),
  });

  if (!adEntry) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(
    {
      ...adEntry,
      images: Array.isArray(adEntry.images) ? adEntry.images : [],
      createdAt:
        adEntry.createdAt instanceof Date
          ? adEntry.createdAt.toISOString()
          : adEntry.createdAt,
      updatedAt:
        adEntry.updatedAt instanceof Date
          ? adEntry.updatedAt.toISOString()
          : adEntry.updatedAt,
    },
    HttpStatusCodes.OK
  );
};

// Update ad handler
export const update: AppRouteHandler<UpdateAdRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updatePayload = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const existingAd = await db.query.ads.findFirst({
    where: eq(ads.id, id),
  });

  if (!existingAd) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const updateData = {
    ...updatePayload,
    updatedAt: new Date(),
  };

  const [updated] = await db
    .update(ads)
    .set(updateData)
    .where(eq(ads.id, id))
    .returning();
  return c.json(updated, HttpStatusCodes.OK);
};

// Delete ad handler
export const remove: AppRouteHandler<DeleteAdRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const existingAd = await db.query.ads.findFirst({
    where: eq(ads.id, id),
  });

  if (!existingAd) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  await db.delete(ads).where(eq(ads.id, id));

  return c.json({ message: "Ad deleted successfully" }, HttpStatusCodes.OK);
};
