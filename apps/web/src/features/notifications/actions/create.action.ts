"use server";

import { client } from "@/lib/rpc";
import type { InsertNotification } from "../schemas";

export async function createNotifications(data: InsertNotification) {
  const rpcClient = await client();

  const response = await rpcClient.api.notifications.$post({
    json: data,
  });

  // if (!response.ok) {
  //   const { message } = await response.json();
  //   console.log({ message });

  //   throw new Error(message);
  // }

  if (!response.ok) {
    const errorData = await response.json();
    console.error("API Error Response:", errorData);

    // Throw an error with full info (stringify if you want)
    throw new Error(
      errorData.message || JSON.stringify(errorData) || "Unknown error"
    );
  }

  const createdNotifications = await response.json();

  return createdNotifications;
}
