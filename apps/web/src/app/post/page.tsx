import { NewPost } from "@/features/post/components/new-post";
import { PostsList } from "@/features/post/components/post-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { FlameIcon, SparklesIcon, TrendingUpIcon } from "lucide-react";

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
    sort?: "hot" | "new" | "top";
    subforumId?: string;
  };
}

export default function PostPage({ searchParams }: PageProps) {
  const { page = "1", search = "", sort = "hot", subforumId } = searchParams;

  return (
    <div className="container mx-auto py-8 px-3 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Posts</h1>
          <p className="text-muted-foreground mt-1">
            Share and discover interesting content
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue={sort}>
            <SelectTrigger className="w-[160px]">
              <SelectValue>
                {sort === "hot" && (
                  <span className="flex items-center gap-2">
                    <FlameIcon className="h-4 w-4 text-orange-500" />
                    Hot
                  </span>
                )}
                {sort === "new" && (
                  <span className="flex items-center gap-2">
                    <SparklesIcon className="h-4 w-4 text-blue-500" />
                    New
                  </span>
                )}
                {sort === "top" && (
                  <span className="flex items-center gap-2">
                    <TrendingUpIcon className="h-4 w-4 text-green-500" />
                    Top
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hot">
                <span className="flex items-center gap-2">
                  <FlameIcon className="h-4 w-4 text-orange-500" />
                  Hot
                </span>
              </SelectItem>
              <SelectItem value="new">
                <span className="flex items-center gap-2">
                  <SparklesIcon className="h-4 w-4 text-blue-500" />
                  New
                </span>
              </SelectItem>
              <SelectItem value="top">
                <span className="flex items-center gap-2">
                  <TrendingUpIcon className="h-4 w-4 text-green-500" />
                  Top
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          <NewPost />
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <PostsList
          page={page}
          search={search}
          sort={sort}
          subforumId={subforumId}
        />
      </div>
    </div>
  );
}
