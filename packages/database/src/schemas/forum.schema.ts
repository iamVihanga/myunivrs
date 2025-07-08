import { sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth.schema"; // reuse your existing user schema

// Optional: Enum for post status
export const postStatusEnum = () =>
  text("status", { enum: ["published", "draft", "deleted"] });

// 🔹 Subforums Table
export const subforum = pgTable("subforums", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow(),
});

// 🔹 Posts Table
export const post = pgTable("posts", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content"),
  images: text("images").array().default([]), // Optional
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "cascade",
  }),
  subforumId: text("subforum_id")
    .references(() => subforum.id, {
      onDelete: "cascade",
    })
    .notNull(),
  voteScore: integer("vote_score").default(0),
  status: postStatusEnum().default("published"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 🔹 Comments Table
export const comment = pgTable("comments", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  postId: text("post_id").references(() => post.id, {
    onDelete: "cascade",
  }),
  parentCommentId: text("parent_comment_id").references((): any => comment.id),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "cascade",
  }),
  content: text("content").notNull(),
  voteScore: integer("vote_score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// 🔹 Votes Table
export const vote = pgTable("votes", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  postId: text("post_id").references(() => post.id, {
    onDelete: "cascade",
  }),
  commentId: text("comment_id").references(() => comment.id, {
    onDelete: "cascade",
  }),
  userId: text("user_id").references(() => user.id, {
    onDelete: "cascade",
  }),
  value: integer("value").notNull(), // 1 for upvote, -1 for downvote
  createdAt: timestamp("created_at").defaultNow(),
});
