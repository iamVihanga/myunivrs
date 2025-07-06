"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { updateNotificationSchema } from "../schemas";

// Type inferred from schema
type UpdateInput = z.infer<typeof updateNotificationSchema>;

export async function updateNotification(id: string, data: UpdateInput) {
  const rpcClient = await client();

  const parsed = updateNotificationSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid notification data");
  }

  const result = await rpcClient.api.notifications[":id"].$put({
    param: { id },
    json: parsed.data,
  });

  if (!result.ok) {
    throw new Error("Failed to update notification");
  }

  revalidatePath("/dashboard/notifications"); // Adjust the path if needed
}
