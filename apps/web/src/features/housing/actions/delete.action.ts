"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";

export async function deleteHousing(id: string) {
  const rpcClient = await client();

  const response = await rpcClient.api.housing[":id"].$delete({
    param: { id }
  });

  const result = await response.json();

  // Revalidate the page to show the updated housing list
  revalidatePath("/dashboard/housing");

  return result;
}
