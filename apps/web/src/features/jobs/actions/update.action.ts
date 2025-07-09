"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { updateJobsSchema } from "../schemas";

type UpdateInput = z.infer<typeof updateJobsSchema>;

export async function updateJob(id: string, data: UpdateInput) {
  const rpcClient = await client();

  try {
    const parsed = updateJobsSchema.safeParse(data);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new Error(`Validation failed: ${errorMessage}`);
    }

    const sanitizedData = {
      ...parsed.data,
      actionUrl:
        parsed.data.actionUrl === null ? undefined : parsed.data.actionUrl,
    };

    const result = await rpcClient.api.jobs[":id"].$put({
      param: { id },
      json: sanitizedData,
    });

    if (result.status !== 200) {
      const errorData = await result.json().catch(() => ({}));
      throw new Error(
        (errorData as { message?: string })?.message ||
          `Failed to update job: ${result.status}`
      );
    }

    revalidatePath("/dashboard/jobs");
    return { success: true, data: await result.json() };
  } catch (error) {
    console.error("Job update error:", error);
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while updating job");
  }
}
