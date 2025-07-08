import { sql } from "drizzle-orm";
import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { user } from "./auth.schema";
import { conditionEnum, statusEnum } from "./shared.schema";

// Define productCategories table (minimal, adjust if you have a specific schema)
export const productCategories = pgTable("product_categories", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  ...timestamps,
});

export const products = pgTable("products", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  images: text("images").array().default([]), // Maps to Facebook's image_link
  price: text("price").notNull(), // Maps to Facebook's price
  discountPercentage: text("discount_percentage").default("0"), // Used to derive sale_price
  location: text("location").notNull(),
  condition: conditionEnum("condition").notNull().default("used"), // Maps to Facebook's condition
  stockQuantity: text("stock_quantity").notNull().default("1"), // Maps to Facebook's availability
  isNegotiable: boolean("is_negotiable").notNull().default(false),
  categoryId: text("category_id").references(() => productCategories.id, {
    onDelete: "set null",
  }), // Maps to Facebook's category
  brand: text("brand"), // Facebook required field
  link: text("link"), // Facebook required field
  shipping: text("shipping"), // Facebook optional field (e.g., JSON or text description)
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "cascade",
  }),
  agentProfile: text("agent_id").references(() => user.id, {
    onDelete: "cascade",
  }),
  status: statusEnum().default("published"),
  ...timestamps,
});

export { conditionEnum };
