import { test } from "@repo/database"; //import the test table schema from the database package
import { createInsertSchema, createSelectSchema } from "drizzle-zod"; //import the necessary functions from drizzle-zod
import { z } from "zod"; //for validation purposes

export const selectTestSchema = createSelectSchema(test); //create a schema for selecting data from the test table

export const insertTestSchema = createInsertSchema(test, {
  name: (val) => val.min(1).max(100), //validate the name field to be between 1 and 100 characters
})
  .required({
    description: true, //the description field is required
  })
  .omit({
    createdAt: true,
    updatedAt: true, //omit the createdAt and updatedAt fields from the insert schema
  });

export const updateTestSchema = createInsertSchema(test)
  .omit({
    createdAt: true,
    updatedAt: true, //omit the createdAt and updatedAt fields from the update schema
  })

  .partial(); //make all fields optional for the update schema

//type definitions for the test table
export type Test = z.infer<typeof selectTestSchema>;

export type InsertTest = z.infer<typeof insertTestSchema>;

export type UpdateTest = z.infer<typeof updateTestSchema>;
