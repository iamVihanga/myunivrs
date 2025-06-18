"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";

export async function deleteTask(id: number) {
  const rpcClient = await client();

  const res = await rpcClient.api.tasks[":id"].$delete({
    param: { id }
  });

  // Revalidate the page to show the new task
  revalidatePath("/");
}
