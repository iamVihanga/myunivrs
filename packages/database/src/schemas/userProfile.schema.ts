import { sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

import { timestamps } from "../utils/helpers";
import { user } from "./auth.schema";

export const userProfile = pgTable("user_profiles", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    })
    .unique(), // One profile per user
  images: text("images").array().default([]),
  username: text("username").notNull().unique(),
  universityName: text("university_name"),
  studentId: text("student_id"),
  courseOfStudy: text("course_of_study"),
  yearsOfStudy: text("years_of_study"), // e.g., "1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"
  interest: text("interest"), // User's interests/hobbies

  ...timestamps,
});
