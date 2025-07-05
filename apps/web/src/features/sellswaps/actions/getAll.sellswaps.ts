"use server";

import { client } from "@/lib/rpc";

type GetSellSwapsParams = {
  page?: string;
  limit?: string;
  sort?: "asc" | "desc";
  search?: string;
};

export async function getAllSellSwaps({
  page = "1",
  limit = "8",
  sort = "desc",
  search = "",
}: GetSellSwapsParams = {}) {
  const rpcClient = await client();

  const response = await rpcClient.api.sellswaps.$get({
    query: {
      page,
      limit,
      sort,
      search,
    },
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const data = await response.json();
  return data;
}
