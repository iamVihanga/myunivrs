// "use server";

// import { client } from "@/lib/rpc";

// type GetPostParams = {
//   page?: string;
//   limit?: string;
//   sort?: "asc" | "desc";
//   search?: string;
// };

// export async function getAllPost({
//   page = "1",
//   limit = "8",
//   sort = "desc",
//   search = "",
// }: GetPostParams = {}) {
//   const rpcClient = await client();

//   const response = await rpcClient.api.post.$get({
//     query: {
//       page,
//       limit,
//       sort,
//       search,
//     },
//   });

//   if (!response.ok) {
//     const { message } = await response.json();
//     throw new Error(message);
//   }

//   const data = await response.json();
//   return data;
// }

"use server";

import { client } from "@/lib/rpc";

type GetPostParams = {
  page?: string;
  limit?: string;
  sort?: "asc" | "desc";
  search?: string;
  subforumId?: string; // <--- ADD THIS LINE
};

export async function getAllPost({
  page = "1",
  limit = "8",
  sort = "desc",
  search = "",
  subforumId, // <--- DESTRUCTURE subforumId here
}: GetPostParams = {}) {
  const rpcClient = await client();

  const response = await rpcClient.api.post.$get({
    query: {
      page,
      limit,
      sort,
      search,
      ...(subforumId && { subforumId }), // <--- CONDITIONALLY ADD subforumId to the query
    },
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const data = await response.json();
  return data;
}
