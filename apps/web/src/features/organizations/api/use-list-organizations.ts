import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { getClient } from "@/lib/rpc/client";

// Query params schema - matches API schema
export const queryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional()
});

export type QueryParamsSchema = z.infer<typeof queryParamsSchema>;

export const useListOrganizations = (queryParams: QueryParamsSchema) => {
  const query = useQuery({
    queryKey: ["organizations", { queryParams }],
    queryFn: async () => {
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
