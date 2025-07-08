"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";
import type { UpdateAdsPaymentPlan } from "../schemas";

export async function updateAdsPaymentPlan(
  id: string,
  data: UpdateAdsPaymentPlan
) {
  const rpcClient = await client();

  try {
    // Fix: Use "ads-payment-plan" instead of "adzPaymentPlan" in the route
    const result = await rpcClient.api["ads-payment-plan"][":id"].$put({
      param: { id },
      json: data,
    });

    if (!result.ok) {
      const errorData = await result.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to update payment plan: ${result.status}`
      );
    }

    revalidatePath("/dashboard/ads-payment-plan");
    return result.json();
  } catch (error) {
    console.error("Payment plan update error:", error);
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while updating payment plan");
  }
}
