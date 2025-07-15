import { Card, CardContent } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { getAllPost } from "../actions/getAll.action";
import { PostCard } from "./post-card";
import { PostPagination } from "./post-pagination";

interface PostsListProps {
  page?: string;
  limit?: string;
  search?: string;
  subforumId?: string;
}

export async function PostsList({
  page = "1",
  limit = "8",
  search = "",
  subforumId,
}: PostsListProps) {
  const response = await getAllPost({
    page,
    limit,
    search,
    ...(subforumId && { subforumId }),
  });

  return (
    <div className="flex flex-col md:flex-row gap-6 px-4 md:px-0">
      {/* Center: Posts Section */}
      <div className="flex-1 max-w-4xl w-full">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4 pt-4 -mt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <SearchBar defaultValue={search} />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {response.meta.totalCount.toLocaleString()}{" "}
              {response.meta.totalCount === 1 ? "post" : "posts"}
              {subforumId && " in this community"}
            </div>
          </div>
        </div>

        {/* Posts List */}
        {response.data.length === 0 ? (
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 mb-4 text-gray-400">
                {search ? (
                  <SearchIcon className="w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl text-gray-300 dark:text-gray-600">
                    📭
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {search ? "No results found" : "No posts yet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm">
                {search
                  ? `We couldn't find any posts matching "${search}"`
                  : subforumId
                    ? "Be the first to create a post in this community!"
                    : "There are no posts to show right now. Start by creating one!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {response.data.map((post: any) => (
              <PostCard
                key={post.id}
                post={{
                  id: post.id,
                  title: post.title,
                  content: post.content ?? null,
                  url: post.url ?? "",
                  images: Array.isArray(post.images) ? post.images : null,
                  createdBy: post.createdBy ?? null,
                  subforumId: post.subforumId ?? "",
                  voteScore:
                    typeof post.voteScore === "number" ? post.voteScore : null,
                  status: ["draft", "published", "deleted"].includes(
                    post.status ?? ""
                  )
                    ? (post.status as "draft" | "published" | "deleted")
                    : null,
                  createdAt: post.createdAt
                    ? typeof post.createdAt === "string"
                      ? new Date(post.createdAt)
                      : post.createdAt
                    : null,
                }}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {response.meta.totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 pb-4 -mb-4">
            <PostPagination
              currentPage={response.meta.currentPage}
              totalPages={response.meta.totalPages}
            />
          </div>
        )}
      </div>

      {/* Right Sidebar: Popular Communities */}
      <aside className="hidden md:block md:w-80 sticky top-20 self-start">
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Popular Communities
            </h2>
            <ul className="space-y-2">
              {[
                {
                  name: "r/NoStupidQuestions",
                  members: "6.4M members",
                  href: "/r/NoStupidQuestions",
                },
                {
                  name: "r/Minecraft",
                  members: "8.5M members",
                  href: "/r/Minecraft",
                },
                {
                  name: "r/Fitness",
                  members: "12.4M members",
                  href: "/r/Fitness",
                },
                {
                  name: "r/DnD",
                  members: "4.1M members",
                  href: "/r/DnD",
                },
                {
                  name: "r/videos",
                  members: "26.7M members",
                  href: "/r/videos",
                },
              ].map((community) => (
                <li key={community.name} className="text-sm">
                  <Link
                    href={community.href}
                    className="flex justify-between items-center px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                  >
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {community.name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      {community.members}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link
                href="/communities"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                See more
              </Link>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

interface SearchBarProps {
  defaultValue?: string;
}

function SearchBar({ defaultValue = "" }: SearchBarProps) {
  return (
    <div className="relative flex-1 max-w-xl">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
      <Input
        type="search"
        defaultValue={defaultValue}
        className="pl-9 h-10 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Search Reddit..."
      />
    </div>
  );
}
