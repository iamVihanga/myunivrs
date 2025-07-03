import rpc from "@nextplate/rpc";
import { getCookies } from "cookies-next/client";

export const getClient = async () => {
  const cookieStore = getCookies();

  let cookiesList;

  if (cookieStore) {
    cookiesList = Object.entries(cookieStore)
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");
  } else {
    cookiesList = "";
  }

  return rpc(process.env.NEXT_PUBLIC_APP_URL!, {
    headers: {
      cookie: cookiesList
    }
  });
};
