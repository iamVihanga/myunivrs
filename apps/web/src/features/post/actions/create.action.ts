"use server";

import { client } from "@/lib/rpc";
import type { InsertPost } from "../schemas";

export async function createPost(data: InsertPost) {
  const rpcClient = await client();

  const response = await rpcClient.api.post.$post({
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

  const createdPost = await response.json();

  return createdPost;
}
