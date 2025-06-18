"use server";

import { client } from "@/lib/rpc";
import { revalidatePath } from "next/cache";
import { type AddTaskSchema } from "../schemas";

export async function addTask(data: AddTaskSchema) {
  if (!data.name) {
    throw new Error("Task name is required");
  }

  const rpcClient = await client();

  await rpcClient.api.tasks.$post({
    json: {
      ...data,
      done: false
    }
  });

  // Revalidate the page to show the new task
  revalidatePath("/");
}
