"use server";

import { client } from "@/lib/rpc";

export async function getAllHousing() {
  const response = await client.api.housing.$get();

  const housings = await response.json();

  return housings;
}
