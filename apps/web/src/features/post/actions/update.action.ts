"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { updatePostSchema } from "../schemas";

type UpdateInput = z.infer<typeof updatePostSchema>;

export async function updatePost(id: string, data: UpdateInput) {
  const rpcClient = await client();

  try {
    const parsed = updatePostSchema.safeParse(data);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new Error(`Validation failed: ${errorMessage}`);
    }

    const result = await rpcClient.api.post[":id"].$put({
      param: { id },
      json: parsed.data,
    });

    if (!result.ok) {
      const errorData = await result.json().catch(() => ({}));
      throw new Error(
        typeof errorData === "object" &&
        errorData !== null &&
        "message" in errorData &&
        typeof (errorData as any).message === "string"
          ? (errorData as any).message
          : `Failed to update post: ${result.status}`
      );
    }

    revalidatePath("/dashboard/post");
    return { success: true, data: await result.json() };
  } catch (error) {
    console.error("Post update error:", error);
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while updating post");
  }
}
