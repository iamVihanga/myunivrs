"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { updateAdsSchema } from "../schemas";

type UpdateInput = z.infer<typeof updateAdsSchema>;

export async function updateAds(id: string, data: UpdateInput) {
  const rpcClient = await client();

  try {
    const parsed = updateAdsSchema.safeParse(data);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new Error(`Validation failed: ${errorMessage}`);
    }

    const result = await rpcClient.api.ads[":id"].$put({
      param: { id },
      json: parsed.data,
    });

    if (!result.ok) {
      const errorData = await result.json().catch(() => ({}));
      throw new Error(
        typeof errorData === "object" &&
        "message" in errorData &&
        typeof errorData.message === "string"
          ? errorData.message
          : `Failed to update ad: ${result.status}`
      );
    }

    revalidatePath("/dashboard/ads");
    return { success: true, data: await result.json() };
  } catch (error) {
    console.error("Ad update error:", error);
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while updating ad");
  }
}
