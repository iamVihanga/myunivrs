"use server";

import { client } from "@/lib/rpc";
import type { InsertEvent } from "../schemas";

export async function createEvent(data: InsertEvent) {
  const rpcClient = await client();

  const response = await rpcClient.api.events.$post({
    json: data
  });

  if (!response.ok) {
    const { message } = await response.json();
    console.log({ message });

    throw new Error(message);
  }

  const createdEvent = await response.json();

  return createdEvent;
}