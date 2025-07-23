import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@repo/ui/components/card";
import { headers } from "next/headers";
import { getAllHousing } from "../actions/getAll.action";
import { HousingCard } from "./housing-card";
import { HousingPagination } from "./housing-pagination";
import { SearchBar } from "./search-bar";

interface HousingsListProps {
  page?: string;
  limit?: string;
  search?: string;
}

export async function HousingsList({
  page = "1",
  limit = "8",
  search = "",
}: HousingsListProps) {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");

  const session = await authClient.getSession({
    fetchOptions: {
      headers: {
        ...(cookieHeader && { cookie: cookieHeader }),
      },
    },
  });
  if (session.error) {
    return (
      <Card className="bg-red-50 border-none">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-lg font-medium text-red-600 mb-1">
            Authentication Error
          </h3>
          <p className="text-muted-foreground max-w-sm">
            Please log in to view housing listings.
          </p>
        </CardContent>
      </Card>
    );
  }
  // Get housing data with pagination
  const response = await getAllHousing({ page, limit, search });

  // Convert string dates to Date objects
  const housings = response.data
    .filter(
      (housing: any) =>
        housing.agentProfile === session.data.session.activeOrganizationId
    )
    .map((housing: any) => ({
      ...housing,
      createdAt: new Date(housing.createdAt),
      updatedAt: housing.updatedAt ? new Date(housing.updatedAt) : null,
    }));

  // Get pagination metadata
  const { currentPage, totalPages, totalCount } = response.meta;

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SearchBar />
        <div className="text-sm text-muted-foreground">
          {totalCount} {totalCount === 1 ? "listing" : "listings"} found
        </div>
      </div>

      {/* Housing List */}
      {housings.length === 0 ? (
        <Card className="bg-cyan-50 border-none">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-cyan-100 p-3 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-cyan-600"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No listings found
            </h3>
            <p className="text-muted-foreground max-w-sm">
              {search
                ? `No results found for "${search}". Try a different search term.`
                : "Create a new listing to get started."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {housings.map((housing: any) => (
            <HousingCard key={housing.id} housing={housing} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <HousingPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
