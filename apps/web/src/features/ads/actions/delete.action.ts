"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";

export async function deleteAds(id: string) {
  const rpcClient = await client();

  const response = await rpcClient.api.ads[":id"].$delete({
    param: { id }
  });

  const result = await response.json();

  // Revalidate the page to show the updated ads list
  revalidatePath("/dashboard/ads");

  return result;
}
