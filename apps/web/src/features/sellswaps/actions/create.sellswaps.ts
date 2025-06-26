"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";
import type { InsertSellSwap } from "../schemas";

export async function createSellSwap(data: InsertSellSwap) {
  const rpcClient = await client();

  const response = await rpcClient.api.sellswaps.$post({
    json: data,
  });

  if (!response.ok) {
    const { message } = await response.json();
    console.log({ message });

    throw new Error(message);
  }

  const createdSellSwaps = await response.json();

  // Revalidate the page to show the new task
  revalidatePath("/dashboard/sellswap");

  return createdSellSwaps;
}
