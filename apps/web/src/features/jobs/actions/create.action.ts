"use server";

import { client } from "@/lib/rpc";
import type { InsertJobs } from "../schemas";

export async function createJob(data: InsertJobs) {
  const rpcClient = await client();

  const response = await rpcClient.api.jobs.$post({
    json: data,
  });

  if (!response.ok) {
    const { message } = await response.json();
    console.log({ message });

    throw new Error(message);
  }

  const createdJob = await response.json();

  return createdJob;
}
