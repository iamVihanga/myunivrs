
// import { jobs } from "@repo/database";
// import { createInsertSchema, createSelectSchema } from "drizzle-zod";
// import { z } from "zod";

// export const selectJobSchema = createSelectSchema(jobs);

// export const insertJobsSchema = createInsertSchema(jobs, {
//   title: (val) => val.min(1).max(500),
// }).omit({
//   createdAt: true,
//   agentProfile: true,
//   id: true,
//   createdBy: true,
//   updatedAt: true,
// });

// export const updateJobsSchema = createInsertSchema(jobs)
//   .omit({
//     id: true,
//     createdAt: true,
//     updatedAt: true,
//   })
//   .partial();

// //export definitions

// export type Jobs = z.infer<typeof selectJobSchema>;

// export type InsertJobs = z.infer<typeof insertJobsSchema>;

// export type UpdateJobs = z.infer<typeof updateJobsSchema>;

// import { jobs } from "@repo/database";
// import { createInsertSchema, createSelectSchema } from "drizzle-zod";
// import { z } from "zod";

// export const selectJobSchema = createSelectSchema(jobs);

// export const insertJobsSchema = createInsertSchema(jobs, {
//   title: (val) => val.min(1).max(500)
// }).omit({
//   createdAt: true,
//   agentProfile: true,
//   id: true,
//   createdBy: true,
//   updatedAt: true
// });

// export const updateJobsSchema = createInsertSchema(jobs)
//   .omit({
//     id: true,
//     createdAt: true,
//     updatedAt: true
//   })
//   .partial();

// //export definitions

// export type Jobs = z.infer<typeof selectJobSchema>;

// export type InsertJobs = z.infer<typeof insertJobsSchema>;

// export type UpdateJobs = z.infer<typeof updateJobsSchema>;


import { jobs } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Define the jobType enum values to match the pgEnum in the database schema
const jobTypeEnum = z.enum([
  "full_time",
  "part_time",
  "contract",
  "internship",
  "temporary",
]);

// Schema for selecting jobs (includes all fields)
export const selectJobSchema = createSelectSchema(jobs, {
  jobType: jobTypeEnum,
  requiredSkills: z.array(z.string()).default([]),
  salaryRange: z.record(z.any()).default({}), // jsonb is treated as a generic record
  actionUrl: z.string().url().optional(),
  cvRequired: z.boolean().default(false),
});

// Schema for inserting jobs (omits id, createdAt, updatedAt, createdBy, agentProfile)
export const insertJobsSchema = createInsertSchema(jobs, {
  title: z
    .string()
    .min(1, "Title is required")
    .max(500, "Title cannot exceed 500 characters"),
  description: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
  isFeatured: z.boolean().default(false),
  company: z.string().min(1, "Company name is required"),
  status: z.enum(["published", "draft", "archived"]).default("published"), // Adjust based on statusEnum definition
  requiredSkills: z.array(z.string()).optional().default([]),
  salaryRange: z
    .object({
      min: z.number().nonnegative().optional(),
      max: z.number().nonnegative().optional(),
      currency: z.string().optional(),
    })
    .optional()
    .default({}),
  actionUrl: z.string().optional(),
  jobType: jobTypeEnum.default("full_time"),
  cvRequired: z.boolean().default(false),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  agentProfile: true,
});

// Schema for updating jobs (all fields optional, omits id, createdAt, updatedAt)
export const updateJobsSchema = createInsertSchema(jobs, {
  title: z
    .string()
    .min(1, "Title is required")
    .max(500, "Title cannot exceed 500 characters"),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false),
  company: z.string().min(1, "Company name is required"),
  status: z.enum(["published", "draft", "archived"]).default("published"), // Adjust based on statusEnum
  requiredSkills: z.array(z.string()).optional(),
  salaryRange: z
    .object({
      min: z.number().nonnegative().optional(),
      max: z.number().nonnegative().optional(),
      currency: z.string().optional(),
    })
    .optional(),
  actionUrl: z.string().url("Must be a valid URL").optional(),
  jobType: jobTypeEnum,
  cvRequired: z.boolean().default(false),
})

  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();


// Export type definitions
export type Jobs = z.infer<typeof selectJobSchema>;
export type InsertJobs = z.infer<typeof insertJobsSchema>;

export type UpdateJobs = z.infer<typeof updateJobsSchema>;
