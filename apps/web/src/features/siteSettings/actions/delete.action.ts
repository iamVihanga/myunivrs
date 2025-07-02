"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";

export async function deleteSiteSetting(id: string) {
  const rpcClient = await client();

  const response = await rpcClient.api["site-settings"][":id"].$delete({
    param: { id },
  });

  const result = await response.json();

  // Revalidate the page to show the updated site setting list
  revalidatePath("/dashboard/site-settings");

  return result;
}
