"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { updateB2bplanSchema } from "../schemas";

type UpdateInput = z.infer<typeof updateB2bplanSchema>;

export async function updateB2bplan(id: string, data: UpdateInput) {
  const rpcClient = await client();

  try {
    const parsed = updateB2bplanSchema.safeParse(data);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new Error(`Validation failed: ${errorMessage}`);
    }

    const result = await rpcClient.api.b2bplans[":id"].$put({
      param: { id },
      json: parsed.data,
    });

    if (result.status !== 200) {
      const errorData = await result.json().catch(() => ({}));
      throw new Error(
        typeof errorData === "object" &&
        errorData !== null &&
        "message" in errorData &&
        typeof (errorData as any).message === "string"
          ? (errorData as any).message
          : `Failed to update B2B plan: ${result.status}`
      );
    }

    revalidatePath("/dashboard/b2bplans");
    return { success: true, data: await result.json() };
  } catch (error) {
    console.error("B2B plan update error:", error);
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while updating B2B plan");
  }
}
