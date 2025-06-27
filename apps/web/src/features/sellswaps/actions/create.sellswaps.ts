"use server";

import { client } from "@/lib/rpc";
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

  return createdSellSwaps;
}
