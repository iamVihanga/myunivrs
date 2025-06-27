import { sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";

export const university = pgTable("university", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  countryCode: text("countryCode").notNull(),
  ...timestamps,
});
