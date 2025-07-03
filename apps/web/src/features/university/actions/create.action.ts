"use server";

import { client } from "@/lib/rpc";

import type { InsertUniversity } from "../schemas";

export async function createUniversity(data: InsertUniversity) {
  const rpcClient = await client();

  const response = await rpcClient.api.university.$post({
    json: data,
  });

  if (!response.ok) {
    const { message } = await response.json();
    console.log({ message });

    throw new Error(message);
  }

  const createdUni = await response.json();

  return createdUni;

}
