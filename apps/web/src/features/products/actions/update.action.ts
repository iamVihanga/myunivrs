"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { updateProductSchema } from "../schemas";

type UpdateInput = z.infer<typeof updateProductSchema>;

export async function updateProduct(id: string, data: UpdateInput) {
  const rpcClient = await client();

  try {
    // Transform and sanitize input data
    const sanitizedData = {
      title: typeof data.title === "string" ? data.title.trim() : undefined,
      description:
        typeof data.description === "string"
          ? data.description.trim()
          : undefined,
      images: Array.isArray(data.images) ? data.images.filter(Boolean) : [],
      price: data.price != null ? String(data.price) : undefined,
      discountPercentage:
        data.discountPercentage != null ? String(data.discountPercentage) : "0",
      location:
        typeof data.location === "string" ? data.location.trim() : undefined,
      condition: data.condition || "used",
      stockQuantity:
        data.stockQuantity != null ? String(data.stockQuantity) : "1",
      isNegotiable: Boolean(data.isNegotiable),
      categoryId: data.categoryId || undefined,
      status: data.status || "published",
      brand: typeof data.brand === "string" ? data.brand.trim() : undefined,
      link: data.link == null ? undefined : String(data.link).trim(),
      shipping:
        data.shipping == null ? undefined : String(data.shipping).trim(),
    };

    // Validate required fields
    if (
      !sanitizedData.title ||
      !sanitizedData.description ||
      !sanitizedData.location
    ) {
      throw new Error("Title, description, and location are required");
    }

    // Validate price format
    if (!/^\d+(\.\d{1,2})?$/.test(sanitizedData.price || "")) {
      throw new Error("Price must be a valid number");
    }

    // Validate transformed data
    const parsed = updateProductSchema.safeParse(sanitizedData);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new Error(`Validation failed: ${errorMessage}`);
    }

    // Make API request
    const result = await rpcClient.api.products[":id"].$put({
      param: { id },
      json: parsed.data,
    });

    // Handle API response
    const responseData = await result.json().catch(() => null);

    if (!result.ok || !responseData) {
      throw new Error(
        (responseData && "message" in responseData
          ? responseData.message
          : undefined) ||
          `Failed to update product (${result.status}): Please check all required fields`
      );
    }

    // Revalidate cache and return success
    revalidatePath("/dashboard/products");
    return { success: true, data: responseData };
  } catch (error) {
    console.error("Product update error:", error);
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while updating product");
  }
}
