import { sql } from "drizzle-orm";
import { integer, json, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { organization, user } from "./auth.schema";

// Enum for role types
export const talentRolesEnum = () =>
  text("role")
    .$type<
      | "model"
      | "photographer"
      | "fashion_designer"
      | "makeup_artist"
      | "stylist"
      | "agency"
      | "videographer"
      | "hair_stylist"
      | "event_organizer"
      | "retoucher"
      | "casting_director"
      | "client"
    >()
    .notNull();

export const talent = pgTable("talent", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  name: varchar("name", { length: 100 }).notNull(),
  role: talentRolesEnum(),
  location: varchar("location", { length: 100 }),
  bio: text("bio"),
  experienceYears: integer("experience_years"),
  hourlyRate: integer("hourly_rate"), // or text if you want flexible formatting

  portfolioUrls: json("portfolio_urls").$type<string[]>(),
  socialLinks: json("social_links").$type<Record<string, string>>(), // ex: { instagram: "...", linkedin: "..." }

  createdBy: text("created_by").references(() => user.id, {
    onDelete: "cascade",
  }),

  organizationId: text("organization_id").references(() => organization.id, {
    onDelete: "cascade",
  }),

  ...timestamps,
});
