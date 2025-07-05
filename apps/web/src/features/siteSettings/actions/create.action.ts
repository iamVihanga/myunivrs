"use server";

import { client } from "@/lib/rpc";
import type { InsertSiteSettings } from "../schemas";

export async function createSiteSetting(data: InsertSiteSettings) {
  const rpcClient = await client();

  const response = await rpcClient.api["site-settings"].$post({
    json: data,
  });

  if (!response.ok) {
    const { message } = await response.json();
    console.log({ message });

    throw new Error(message);
  }

  const createdSiteSetting = await response.json();

  return createdSiteSetting;
}
