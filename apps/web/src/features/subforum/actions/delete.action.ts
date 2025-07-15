"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";

export async function deleteSubforum(id: string) {
  try {
    const rpcClient = await client();

    const response = await rpcClient.api.subforum[":id"].$delete({
      param: { id },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete subforum: ${response.statusText}`);
    }

    // Check if there's actual JSON content before parsing
    const contentType = response.headers.get("content-type");
    const result =
      contentType?.includes("application/json") && (await response.json());

    // Revalidate both forum and subforum paths
    revalidatePath("/dashboard/forum");
    revalidatePath("/dashboard/subforum");

    return result;
  } catch (error) {
    console.error("Delete subforum error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete subforum"
    );
  }
}
