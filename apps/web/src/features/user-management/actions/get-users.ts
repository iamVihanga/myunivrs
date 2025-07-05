import { authClient } from "@/lib/auth-client";

export type GetUsersParams = {
  role?: "user" | "admin" | undefined;
  page?: string;
  limit?: string;
  sort?: "desc" | "asc" | undefined;
  search?: string;
};

export async function fetchUsers({
  page = "1",
  limit = "10",
  sort = "desc",
  search = "",
  role = undefined
}: GetUsersParams = {}) {
  const response = await authClient.admin.listUsers({
    query: {
      ...(role && {
        filterField: "role",
        filterOperator: "eq",
        filterValue: role
      }),
      limit,
      offset: (parseInt(page) - 1) * parseInt(limit),
      sortBy: "createdAt",
      sortDirection: sort,
      searchField: "email",
      searchOperator: "contains",
      searchValue: search
    }
  });

  const { data, error } = response;
  console.log({ data, error });

  if (error) {
    console.log(error);
    throw new Error(`${error.message}`);
  }

  return data;
}
