"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";

export async function deleteNotifications(id: string) {
  const rpcClient = await client();

  const response = await rpcClient.api.notifications[":id"].$delete({
    param: { id }
  });

  const result = await response.json();

  // Revalidate the page to show the updated notifications list
  revalidatePath("/dashboard/notifications");

  return result;
}
