"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";

export async function deleteAdsPaymentPlan(id: string) {
  const rpcClient = await client();

  const response = await rpcClient.api["ads-payment-plan"][":id"].$delete({
    param: { id },
  });

  const result = await response.json();

  // Revalidate the page to show the updated adsPaymentPlan list
  revalidatePath("/dashboard/ads-payment-plan");

  return result;
}
