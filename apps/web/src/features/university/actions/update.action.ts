"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";
import { UpdateUniversity } from "../schemas";

export async function updateUniversity(id: string, data: UpdateUniversity) {
  const rpcClient = await client();

  try {
    const result = await rpcClient.api.university[":id"].$put({
      param: { id },
      json: data,
    });

    if (!result.ok) {
      throw new Error(`Failed to update university: ${result.status}`);
    }

    revalidatePath("/dashboard/university");
    return result.json();
  } catch (error) {
    console.error("Update university error:", error);
    throw error;
  }
}
