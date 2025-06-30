// import { sql } from "drizzle-orm";
// import { integer, pgTable, text } from "drizzle-orm/pg-core";

// import { relations } from "drizzle-orm";
// import { timestamps } from "../utils/helpers";
// import { organization, user } from "./auth.schema";
// import { statusEnum } from "./shared.schema";

// export const productCategories = pgTable("product_categories", {
//   id: text("id")
//     .primaryKey()
//     .default(sql`gen_random_uuid()`),

//   name: text("name").notNull(),

//   ...timestamps
// });

// export const products = pgTable("products", {
//   id: text("id")
//     .primaryKey()
//     .default(sql`gen_random_uuid()`),
//   title: text("title").notNull(),
//   description: text("description"),

//   images: text("images").array().default([]),
//   price: integer("price").notNull(),
//   discountPrecentage: integer("discount_percentage").default(0),

//   categoryId: text("category_id").references(() => productCategories.id),
//   createdBy: text("created_by").references(() => user.id, {
//     onDelete: "cascade"
//   }),
//   agentProfile: text("agent_id").references(() => organization.id, {
//     onDelete: "cascade"
//   }),
//   status: statusEnum().default("published"),

//   ...timestamps
// });

// // Relations
// export const productCategoriesRelations = relations(
//   productCategories,
//   ({ many }) => ({
//     products: many(products)
//   })
// );

// export const productRelations = relations(products, ({ one }) => ({
//   category: one(productCategories, {
//     fields: [products.categoryId],
//     references: [productCategories.id]
//   })
// }));

import { relations, sql } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { organization, user } from "./auth.schema";
import { statusEnum } from "./shared.schema";

// Enum for product condition
export const conditionEnum = pgEnum("condition", [
  "new",
  "used",
  "refurbished",
  "for_parts",
]);

export const productCategories = pgTable("product_categories", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  ...timestamps,
});

export const products = pgTable("products", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  images: text("images").array().default([]),
  price: integer("price").notNull(),
  discountPercentage: integer("discount_percentage").default(0),
  location: text("location").notNull(), // e.g., "New York, NY" or JSON
  condition: conditionEnum("condition").notNull().default("used"),
  stockQuantity: integer("stock_quantity").notNull().default(1),
  isNegotiable: boolean("is_negotiable").default(false),
  categoryId: text("category_id").references(() => productCategories.id),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "cascade",
  }),
  agentProfile: text("agent_id").references(() => organization.id, {
    onDelete: "cascade",
  }),
  status: statusEnum().default("published"),
  ...timestamps,
});

// Relations
export const productCategoriesRelations = relations(
  productCategories,
  ({ many }) => ({
    products: many(products),
  })
);

export const productRelations = relations(products, ({ one }) => ({
  category: one(productCategories, {
    fields: [products.categoryId],
    references: [productCategories.id],
  }),
}));
