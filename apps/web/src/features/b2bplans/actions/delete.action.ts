"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";

export async function deleteB2bplans(id: string) {
  const rpcClient = await client();

  const response = await rpcClient.api.b2bplans[":id"].$delete({
    param: { id },
  });

  const result = await response.json();

  // Revalidate the page to show the updated b2bplans list
  revalidatePath("/dashboard/b2bplans");

  return result;
}
