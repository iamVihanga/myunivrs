"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";

export async function deleteEvent(id: string) {
  const rpcClient = await client();

  const response = await rpcClient.api.events[":id"].$delete({
    param: { id }
  });

  const result = await response.json();

  // Revalidate the page to show the updated events list
  revalidatePath("/dashboard/events");

  return result;
}