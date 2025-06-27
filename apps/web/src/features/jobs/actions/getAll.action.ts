"use server";

import { client } from "@/lib/rpc";

type GetJobsParams = {
  page?: string;
  limit?: string;
  sort?: "asc" | "desc";
  search?: string;
};

export async function getAllJobs({
  page = "1",
  limit = "8",
  sort = "desc",
  search = "",
}: GetJobsParams = {}) {
  const rpcClient = await client();

  const response = await rpcClient.api.jobs.$get({
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
