"use server";

import { client } from "@/lib/rpc";
import type { InsertProduct } from "../schemas";

export async function createProducts(data: InsertProduct) {
  const rpcClient = await client();

  const response = await rpcClient.api.products.$post({
    json: data,
  });

  if (!response.ok) {
    const { message } = await response.json();
    console.log({ message });

    throw new Error(message);
  }

  const createProducts = await response.json();

  return createProducts;
}
