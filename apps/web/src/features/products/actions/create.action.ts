"use server";

import { client } from "@/lib/rpc";
import type { InsertProduct } from "../schemas";

export async function createProducts(data: InsertProduct) {
  const rpcClient = await client();


  const cleanData: InsertProduct = {
    ...data,
    price: data.price.trim(),
    discountPercentage: data.discountPercentage?.trim() || "0",
    stockQuantity: data.stockQuantity?.trim() || "1",
    brand: data.brand?.trim() || undefined,
    link: data.link?.trim() || undefined,
    shipping: data.shipping?.trim() || undefined,
    categoryId: data.categoryId?.trim() || undefined,
    images: Array.isArray(data.images) ? data.images : [],
  };

  const response = await rpcClient.api.products.$post({
    json: cleanData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API Error Response:", errorData);

    throw new Error(
      errorData.message || JSON.stringify(errorData) || "Unknown error"
    );
  }

  const createdProduct = await response.json();
  return createdProduct;

}
