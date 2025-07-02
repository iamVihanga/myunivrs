"use server";

import { client } from "@/lib/rpc";

type GetB2bplansParams = {
  page?: string;
  limit?: string;
  sort?: "asc" | "desc";
  search?: string;
};

export async function getAllB2bplans({
  page = "1",
  limit = "8",
  sort = "desc",
  search = "",
}: GetB2bplansParams = {}) {
  const rpcClient = await client();

  const response = await rpcClient.api.b2bplans.$get({
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
