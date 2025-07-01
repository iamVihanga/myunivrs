import { Card, CardContent } from "@repo/ui/components/card";
import { getAllEvents } from "../actions/getAll.action";
import { EventCard } from "./event-card";
import { EventsPagination } from "./events-pagination";
import { SearchBar } from "./search-bar";

interface EventsListProps {
  page?: string;
  limit?: string;
  search?: string;
}

export async function EventsList({
  page = "1",
  limit = "8",
  search = ""
}: EventsListProps) {
  // Get events data with pagination
  const response = await getAllEvents({ page, limit, search });

  // Convert string dates to Date objects
  const events = response.data;

  // Get pagination metadata
  const { currentPage, totalPages, totalCount } = response.meta;

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SearchBar />
        <div className="text-sm text-muted-foreground">
          {totalCount} {totalCount === 1 ? "event" : "events"} found
        </div>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <Card className="bg-indigo-50 border-none">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-indigo-100 p-3 mb-4">
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
                className="text-indigo-600"
              >
                <path d="M5.8 11.3A4 4 0 0 0 2 16a4 4 0 0 0 5 4 4 4 0 0 0 8 0 4 4 0 0 0 5-4 4 4 0 0 0-3.8-4.7" />
                <path d="M11 9a6 6 0 0 0 6-6" />
                <path d="m14 3-2 2 2 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No events found
            </h3>
            <p className="text-muted-foreground max-w-sm">
              {search
                ? `No results found for "${search}". Try a different search term.`
                : "Create a new event to get started."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {events.map((event: any) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <EventsPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}