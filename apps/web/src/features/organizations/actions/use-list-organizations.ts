import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";
import { Organization, PaginatedResponse, QueryParamsSchema } from "../types";

export const useListOrganizations = (queryParams: QueryParamsSchema) => {
  const query = useQuery({
    queryKey: ["organizations", { queryParams }],
    queryFn: async (): Promise<PaginatedResponse<Organization>> => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.organizations.$get({
        query: queryParams
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      const data = await response.json();
      return data;
    }
  });

  return query;
};
