import { sql } from "drizzle-orm";
import { integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";

export const mediaTypeEnum = pgEnum("media_type", [
  "image",
  "video",
  "audio",
  "document"
]);

export const media = pgTable("media", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  url: text("url").notNull(),
  type: mediaTypeEnum("type").notNull(),
  filename: text("filename").notNull(),
  size: integer("size").notNull(),

  ...timestamps
});
