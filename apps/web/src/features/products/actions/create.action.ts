"use server";

import { client } from "@/lib/rpc";
import { z } from "zod";
import type { InsertProduct } from "../schemas";
import { insertProductSchema } from "../schemas";

export async function createProducts(data: InsertProduct) {
  // Validate data against the schema
  try {
    const validatedData = insertProductSchema.parse({
      ...data,
      description: data.description || undefined, // Convert empty string to undefined
      categoryId: data.categoryId || undefined, // Convert empty string to undefined
    });

    const rpcClient = await client();

    const response = await rpcClient.api.products.$post({
      json: validatedData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Response:", errorData);

      // Provide more specific error messages based on the response
      throw new Error(
        errorData.message ||
          `Failed to create product: ${JSON.stringify(errorData)}`
      );
    }

    const createdProduct = await response.json();
    return createdProduct;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation Error:", error.errors);
      throw new Error(`Validation failed: ${error.message}`);
    }
    console.error("Create Product Error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
}
