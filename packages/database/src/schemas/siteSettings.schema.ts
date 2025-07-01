import { sql } from "drizzle-orm";
import { boolean, jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { statusEnum } from "./shared.schema";

export const siteSettings = pgTable("site_settings", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  siteName: text("site_name").notNull(),
  siteDescription: text("site_description"),
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),
  primaryEmail: text("primary_email"),
  maintenanceMode: boolean("maintenance_mode").default(false),
  metaTags: jsonb("meta_tags").default({}),
  status: statusEnum().default("published"),
  ...timestamps,
});
