

import { sql } from "drizzle-orm";
import { boolean, pgTable, text } from "drizzle-orm/pg-core";

import { timestamps } from "../utils/helpers";
import { organization, user } from "./auth.schema";
import { statusEnum } from "./shared.schema";

export const housing = pgTable("housing", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  images: text("images").array().default([]),
  address: text("address").notNull(),
  city: text("city"), // <-- remove .notNull()
  state: text("state"),
  zipCode: text("zip_code"),
  price: text("price").notNull(),
  bedrooms: text("bedrooms"),
  bathrooms: text("bathrooms"),
  parking: text("parking"),
  contactNumber: text("contact_number"),
  housingType: text("housing_type"),
  squareFootage: text("square_footage"),
  yearBuilt: text("year_built"),
  isFurnished: boolean("is_furnished").notNull().default(false),
  link: text("link"),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "cascade",
  }),
  agentProfile: text("agent_id").references(() => organization.id, {
    onDelete: "cascade",
  }),
  status: statusEnum().default("published"),
  ...timestamps,
});
