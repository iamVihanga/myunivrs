"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";

export async function deletePost(id: string) {
  const rpcClient = await client();

  const response = await rpcClient.api.post[":id"].$delete({
    param: { id },
  });

  const result = await response.json();

  // Revalidate the page to show the updated post list
  revalidatePath("/dashboard/post");

  return result;
}
