import { sql } from "drizzle-orm";
import { boolean, pgTable, text } from "drizzle-orm/pg-core";

import { timestamps } from "../utils/helpers";
import { user } from "./auth.schema";
import { statusEnum } from "./shared.schema";

export const bank = pgTable("bank", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  name: text("name").notNull(), // Bank name

  branch: text("branch").notNull(), // Branch name

  accountNumber: text("account_number").notNull(), // Account number

  accountHolder: text("account_holder").notNull(), // Account holder name

  swiftCode: text("swift_code"), // Optional field

  isActive: boolean("is_active").default(true), // For enabling/disabling a bank record

  createdBy: text("created_by").references(() => user.id, {
    onDelete: "cascade",
  }),

  status: statusEnum().default("published"),

  ...timestamps,
});
