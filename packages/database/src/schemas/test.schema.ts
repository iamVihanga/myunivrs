import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";

export const test = pgTable("test", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name"),
  description: text("description"),
  done: boolean("done").notNull().default(false),
  ...timestamps,
});
