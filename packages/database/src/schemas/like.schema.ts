import { sql } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { comment, post } from "./forum.schema";

// 🔹 Likes Table for Posts and Comments
export const like = pgTable("likes", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  // What is being liked (either post or comment)
  postId: text("post_id").references(() => post.id, {
    onDelete: "cascade",
  }),
  commentId: text("comment_id").references(() => comment.id, {
    onDelete: "cascade",
  }),

  // Who liked it
  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),

  // When it was liked
  createdAt: timestamp("created_at").defaultNow(),

  // Optional: Track if it's currently liked (for soft deletes)
  isActive: boolean("is_active").default(true),
});
