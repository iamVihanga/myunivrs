"use server";

import { revalidatePath } from "next/cache";

export async function deleteHousing(id: string) {
  // Note: You'll need to implement this endpoint in your API
  // await client.api.housing[":id"].$delete({
  //   param: { id }
  // });

  // Revalidate the page to show the updated housing list
  revalidatePath("/dashboard/housing");
}
