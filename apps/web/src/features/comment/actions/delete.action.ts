"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";

export async function deleteComment(id: string) {
  const rpcClient = await client();

  const response = await rpcClient.api.comment[":id"].$delete({
    param: { id }
  });

  const result = await response.json();

  // Revalidate the page to show the updated comment list
  revalidatePath("/dashboard/comment");

  return result;
}
