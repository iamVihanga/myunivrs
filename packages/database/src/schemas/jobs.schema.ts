import { sql } from "drizzle-orm";
import { boolean, jsonb, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { organization, user } from "./auth.schema";
import { statusEnum } from "./shared.schema";

export const jobTypeEnum = pgEnum("job_type", [
  "full_time",
  "part_time",
  "contract",
  "internship",
  "temporary",
]);

export const jobs = pgTable("jobs", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  images: text("images").array(),
  isFeatured: boolean("is_featured").default(false),
  company: text("company").notNull(),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "cascade",
  }),
  agentProfile: text("agent_id").references(() => organization.id, {
    onDelete: "cascade",
  }),
  status: statusEnum().default("published"),
  requiredSkills: text("required_skills").array().default([]),
  salaryRange: jsonb("salary_range").default({}),
  actionUrl: text("action_url"),
  jobType: jobTypeEnum("job_type").notNull().default("full_time"),
  cvRequired: boolean("cv_required").default(false),
  ...timestamps,
});
