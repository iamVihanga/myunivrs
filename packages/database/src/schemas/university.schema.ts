import { sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { statusEnum } from "./shared.schema";

export const university = pgTable("university", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  countryCode: text("countryCode").notNull(),
  status: statusEnum().default("published"),
  ...timestamps,
});
