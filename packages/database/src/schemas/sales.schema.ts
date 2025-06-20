import { sql } from "drizzle-orm";
import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { timestamps } from "../utils/helpers";
import { organization, user } from "./auth.schema";
import { statusEnum } from "./shared.schema";

export const sales = pgTable("sales", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  productName: text("product_name").notNull(),

  quantity: integer("quantity").notNull(),

  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),

  paymentMethod: text("payment_method").notNull(), // e.g., "cash", "credit card", etc.

  transactionDate: timestamp("transaction_date", { mode: "date" }).defaultNow(),

  customerName: text("customer_name").notNull(),

  salesAgentId: text("sales_agent_id").references(() => user.id, {
    onDelete: "set null",
  }),

  branchId: text("branch_id").references(() => organization.id, {
    onDelete: "set null",
  }),

  status: statusEnum().default("published"),

  ...timestamps,
});
