import { pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
  "published",
  "draft",
  "pending_approval",
  "deleted",
  "active", // new adding
  "sold", // new adding
  "swapped", // new adding
  "expired", // new adding
]);
