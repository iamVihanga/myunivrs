import { Card, CardContent } from "@repo/ui/components/card";
import { getAllSubforum } from "../actions/getAll.action";
import { SearchBar } from "./search-bar";
import { SubforumCard } from "./subforum-card";

interface SubforumListProps {
  page?: string;
  limit?: string;
  search?: string;
  sort: "hot" | "trending" | "new";
}

export async function SubforumList({
  page = "1",
  limit = "10",
  search = "",
}: SubforumListProps) {
  const response = await getAllSubforum({ page, limit, search });

  const subforums = response.data.map((subforum: any) => ({
    ...subforum,
    createdAt: new Date(subforum.createdAt),
  }));

  const { currentPage, totalPages, totalCount } = response.meta;

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SearchBar />
        <div className="text-sm text-muted-foreground">
          {totalCount} {totalCount === 1 ? "subforum" : "subforums"} found
        </div>
      </div>

      {/* Subforum List */}
      {subforums.length === 0 ? (
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
              No subforums found
            </h3>
            <p className="text-muted-foreground max-w-sm">
              {search
                ? `No results found for "${search}". Try a different search term.`
                : "Create a new subforum to get started."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {subforums.map((subforum: any) => (
            <SubforumCard key={subforum.id} subforum={subforum} />
          ))}
        </div>
      )}

      {/* Add Pagination component here if needed */}
    </div>
  );
}
