"use server";

import { client } from "@/lib/rpc";
import type { InsertSubforum } from "../schemas";

export async function createSubforum(data: InsertSubforum) {
  const rpcClient = await client();

  const response = await rpcClient.api.subforum.$post({
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

  const createdSubforum = await response.json();

  return createdSubforum;
}
