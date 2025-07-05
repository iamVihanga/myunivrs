import { desc, ilike, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import { db } from "@/db";
import type { AppRouteHandler } from "@/types";
import { organization } from "@repo/database";

import type * as routes from "./organizations.routes";

type ListRoute = typeof routes.list;

// List organizations
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "desc",
    search
  } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  try {
    // Build search condition
    const searchCondition = search
      ? ilike(organization.name, `%${search}%`)
      : undefined;

    // Get total count
    const [countResult] = await db
      .select({
        count: sql<number>`cast(count(*) as integer)`
      })
      .from(organization)
      .where(searchCondition);

    // Get organizations with pagination
    const items = await db
      .select()
      .from(organization)
      .where(searchCondition)
      .limit(limitNum)
      .offset(offset)
      .orderBy(
        sort === "asc" ? organization.createdAt : desc(organization.createdAt)
      );

    const total = countResult?.count ?? 0;

    return c.json(
      {
        data: items,
        meta: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalCount: total,
          limit: limitNum
        }
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return c.json(
      { message: "Failed to fetch organizations" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
