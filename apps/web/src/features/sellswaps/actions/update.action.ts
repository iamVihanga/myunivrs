"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { updateSellSwapSchema } from "../schemas";

type UpdateInput = z.infer<typeof updateSellSwapSchema>;

export async function updateSellSwap(id: string, data: UpdateInput) {
  const rpcClient = await client();

  try {
    // Transform price to string or null
    const transformedData = {
      ...data,
      price:
        data.price === "" || data.price === null ? null : String(data.price),
    };

    const parsed = updateSellSwapSchema.safeParse(transformedData);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new Error(`Validation failed: ${errorMessage}`);
    }

    const result = await rpcClient.api.sellswaps[":id"].$put({
      param: { id },
      json: parsed.data,
    });

    if (!result.ok) {
      const errorData = await result.json().catch(() => ({}));
      throw new Error(
        (typeof errorData === "object" &&
        errorData !== null &&
        "message" in errorData
          ? (errorData as { message?: string }).message
          : undefined) || `Failed to update sell/swap listing: ${result.status}`
      );
    }

    revalidatePath("/dashboard/sellswap");
    return { success: true, data: await result.json() };
  } catch (error) {
    console.error("Sell/Swap update error:", error);
    throw error instanceof Error
      ? error
      : new Error(
          "An unexpected error occurred while updating sell/swap listing"
        );
  }
}
