import rpc from "@nextplate/rpc";

import { env } from "@/lib/env";
import { cookies } from "next/headers";

export const client = async () => {
  const cookiesStore = await cookies();

  const cookiesList = cookiesStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return rpc(env.NEXT_PUBLIC_BACKEND_URL!, {
    headers: {
      cookie: cookiesList
    }
  });
};
