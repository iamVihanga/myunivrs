import { organization } from "@repo/database";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Select schema (for fetching organizations from DB)
export const selectOrganizationSchema = createSelectSchema(organization);

// Type Definitions
export type Organization = z.infer<typeof selectOrganizationSchema>;
