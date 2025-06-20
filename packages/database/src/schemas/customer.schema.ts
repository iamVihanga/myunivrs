import { sql } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";

import { timestamps } from "../utils/helpers";
import { user } from "./auth.schema";
import { statusEnum } from "./shared.schema";

export const customer = pgTable("customer", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  name: text("name").notNull(),

  address: text("address").notNull(),

  age: integer("age"),

  gender: text("gender").notNull(), // You could replace this with an enum if needed

  createdBy: text("created_by").references(() => user.id, {
    onDelete: "cascade",
  }),

  status: statusEnum().default("published"),

  ...timestamps,
});
