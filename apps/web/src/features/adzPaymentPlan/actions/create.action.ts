"use server";

import { client } from "@/lib/rpc";
import type { InsertAdsPaymentPlan } from "../schemas";

export async function createAdsPaymentPlan(data: InsertAdsPaymentPlan) {
  const rpcClient = await client();

  const response = await rpcClient.api["ads-payment-plan"].$post({
    json: data,
  });

  if (!response.ok) {
    const { message } = await response.json();
    console.log({ message });

    throw new Error(message);
  }

  const createdAdsPaymentPlan = await response.json();

  return createdAdsPaymentPlan;
}
