import { jobs } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectJobSchema = createSelectSchema(jobs);

export const insertJobsSchema = createInsertSchema(jobs, {
  title: (val) => val.min(1).max(500),
}).omit({
  createdAt: true,
  agentProfile: true,
  id: true,
  createdBy: true,
  updatedAt: true,
});

export const updateJobsSchema = createInsertSchema(jobs)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

//export definitions

export type Jobs = z.infer<typeof selectJobSchema>;

export type InsertJobs = z.infer<typeof insertJobsSchema>;

export type UpdateJobs = z.infer<typeof updateJobsSchema>;
