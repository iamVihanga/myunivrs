"use server";

import { client } from "@/lib/rpc";
import type { InsertHousing } from "../schemas";

export async function createHousing(data: InsertHousing) {
  const response = await client.api.housing.$post({
    json: data
  });

  if (!response.ok) {
    const { message } = await response.json();
    console.log({ message });

    throw new Error(message);
  }

  const createdHousing = await response.json();

  return createdHousing;
}
