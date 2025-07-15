import { NewSubforum } from "@/features/subforum/components/new-subforum";
import { SubforumList } from "@/features/subforum/components/subforum-list";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import {
  ClockIcon,
  FlameIcon,
  MessageSquareIcon,
  TrendingUpIcon,
} from "lucide-react";

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
    sort?: "hot" | "trending" | "new";
  };
}

export default function ForumPage({ searchParams }: PageProps) {
  const { page = "1", search = "", sort = "hot" } = searchParams;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-4 px-4">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Communities</h1>
              <p className="text-sm text-gray-600">
                Discover and join discussions
              </p>
            </div>
            <NewSubforum />
          </div>
        </div>

        {/* Sort Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-2 mb-4">
          <div className="flex space-x-1">
            <Button
              variant={sort === "hot" ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "flex items-center gap-2",
                sort === "hot" && "bg-gray-100"
              )}
              asChild
            >
              <a href="?sort=hot">
                <FlameIcon className="h-4 w-4 text-orange-500" />
                Hot
              </a>
            </Button>
            <Button
              variant={sort === "trending" ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "flex items-center gap-2",
                sort === "trending" && "bg-gray-100"
              )}
              asChild
            >
              <a href="?sort=trending">
                <TrendingUpIcon className="h-4 w-4 text-blue-500" />
                Trending
              </a>
            </Button>
            <Button
              variant={sort === "new" ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "flex items-center gap-2",
                sort === "new" && "bg-gray-100"
              )}
              asChild
            >
              <a href="?sort=new">
                <ClockIcon className="h-4 w-4 text-green-500" />
                New
              </a>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-grow">
            <SubforumList page={page} search={search} sort={sort} />
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-3">
                About Communities
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Communities are spaces for people to discuss their interests.
              </p>
              <Button className="w-full" variant="default">
                <MessageSquareIcon className="h-4 w-4 mr-2" />
                Create a Community
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-3">
                Community Rules
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>1. Be respectful to others</li>
                <li>2. No spam or self-promotion</li>
                <li>3. Follow community guidelines</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
