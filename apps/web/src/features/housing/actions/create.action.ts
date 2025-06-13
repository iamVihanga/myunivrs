"use server";

import { client } from "@/lib/rpc";
import type { InsertHousing } from "../schemas";

export async function createHousing(data: InsertHousing) {
  const response = await client.api.housing.$post({
    json: data
  });

  const createdHousing = await response.json();

  return createdHousing;
}
