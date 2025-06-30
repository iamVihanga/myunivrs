"use server";

import { client } from "@/lib/rpc";
import type { InsertProduct } from "../schemas";

export async function createProducts(data: InsertProduct) {
  const rpcClient = await client();

  const response = await rpcClient.api.products.$post({
    json: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API Error Response:", errorData);

    // Throw an error with full info (stringify if you want)
    throw new Error(
      errorData.message || JSON.stringify(errorData) || "Unknown error"
    );
  }

  const createProducts = await response.json();

  return createProducts;
}
