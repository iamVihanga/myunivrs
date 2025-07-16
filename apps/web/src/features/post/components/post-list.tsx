// import { Card, CardContent } from "@repo/ui/components/card";
// import { Input } from "@repo/ui/components/input";
// import { SearchIcon } from "lucide-react";
// import Link from "next/link";
// import { getAllPost } from "../actions/getAll.action";
// import { PostCard } from "./post-card";
// import { PostPagination } from "./post-pagination";

// interface PostsListProps {
//   page?: string;
//   limit?: string;
//   search?: string;
//   subforumId?: string;
// }

// export async function PostsList({
//   page = "1",
//   limit = "8",
//   search = "",
//   subforumId,
// }: PostsListProps) {
//   const response = await getAllPost({
//     page,
//     limit,
//     search,
//     ...(subforumId && { subforumId }),
//   });

//   return (
//     <div className="flex flex-col md:flex-row gap-6 px-4 md:px-0">
//       {/* Center: Posts Section */}
//       <div className="flex-1 max-w-4xl w-full">
//         {/* Header */}
//         <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pb-3 mb-4 pt-4 -mt-4">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <SearchBar defaultValue={search} />
//             <div className="text-sm text-gray-600 dark:text-gray-400">
//               {response.meta.totalCount.toLocaleString()}{" "}
//               {response.meta.totalCount === 1 ? "post" : "posts"}
//               {subforumId && " in this community"}
//             </div>
//           </div>
//         </div>

//         {/* Posts List */}
//         {response.data.length === 0 ? (
//           <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
//             <CardContent className="flex flex-col items-center justify-center py-16">
//               <div className="w-16 h-16 mb-4 text-gray-400">
//                 {search ? (
//                   <SearchIcon className="w-full h-full" />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center text-5xl text-gray-300 dark:text-gray-600">
//                     📭
//                   </div>
//                 )}
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
//                 {search ? "No results found" : "No posts yet"}
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm">
//                 {search
//                   ? `We couldn't find any posts matching "${search}"`
//                   : subforumId
//                     ? "Be the first to create a post in this community!"
//                     : "There are no posts to show right now. Start by creating one!"}
//               </p>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="space-y-3">
//             {response.data.map((post: any) => (
//               <PostCard
//                 key={post.id}
//                 post={{
//                   id: post.id,
//                   title: post.title,
//                   content: post.content ?? null,
//                   url: post.url ?? "",
//                   images: Array.isArray(post.images) ? post.images : null,
//                   createdBy: post.createdBy ?? null,
//                   subforumId: post.subforumId ?? "",
//                   voteScore:
//                     typeof post.voteScore === "number" ? post.voteScore : null,
//                   status: ["draft", "published", "deleted"].includes(
//                     post.status ?? ""
//                   )
//                     ? (post.status as "draft" | "published" | "deleted")
//                     : null,
//                   createdAt: post.createdAt
//                     ? typeof post.createdAt === "string"
//                       ? new Date(post.createdAt)
//                       : post.createdAt
//                     : null,
//                 }}
//               />
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         {response.meta.totalPages > 1 && (
//           <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 pb-4 -mb-4">
//             <PostPagination
//               currentPage={response.meta.currentPage}
//               totalPages={response.meta.totalPages}
//             />
//           </div>
//         )}
//       </div>

//       {/* Right Sidebar: Popular Communities */}
//       <aside className="hidden md:block md:w-80 sticky top-20 self-start">
//         <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
//           <CardContent className="p-4">
//             <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
//               Popular Communities
//             </h2>
//             <ul className="space-y-2">
//               {[
//                 {
//                   name: "r/NoStupidQuestions",
//                   members: "6.4M members",
//                   href: "/r/NoStupidQuestions",
//                 },
//                 {
//                   name: "r/Minecraft",
//                   members: "8.5M members",
//                   href: "/r/Minecraft",
//                 },
//                 {
//                   name: "r/Fitness",
//                   members: "12.4M members",
//                   href: "/r/Fitness",
//                 },
//                 {
//                   name: "r/DnD",
//                   members: "4.1M members",
//                   href: "/r/DnD",
//                 },
//                 {
//                   name: "r/videos",
//                   members: "26.7M members",
//                   href: "/r/videos",
//                 },
//               ].map((community) => (
//                 <li key={community.name} className="text-sm">
//                   <Link
//                     href={community.href}
//                     className="flex justify-between items-center px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
//                   >
//                     <span className="text-blue-600 dark:text-blue-400 font-medium">
//                       {community.name}
//                     </span>
//                     <span className="text-gray-500 dark:text-gray-400 text-xs">
//                       {community.members}
//                     </span>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//             <div className="mt-4">
//               <Link
//                 href="/communities"
//                 className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
//               >
//                 See more
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </aside>
//     </div>
//   );
// }

// interface SearchBarProps {
//   defaultValue?: string;
// }

// function SearchBar({ defaultValue = "" }: SearchBarProps) {
//   return (
//     <div className="relative flex-1 max-w-xl">
//       <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
//       <Input
//         type="search"
//         defaultValue={defaultValue}
//         className="pl-9 h-10 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//         placeholder="Search Reddit..."
//       />
//     </div>
//   );
// }

import { Card, CardContent } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { ChevronRightIcon, HomeIcon, InfoIcon, SearchIcon } from "lucide-react"; // Import new icons
import Link from "next/link";
import { getAllPost } from "../actions/getAll.action";
import { PostCard } from "./post-card";
import { PostPagination } from "./post-pagination";

interface PostsListProps {
  page?: string;
  limit?: string;
  search?: string;
  subforumId?: string;
  sort?: "hot" | "new" | "top"; // Added sort to props for potential sidebar context
}

export async function PostsList({
  page = "1",
  limit = "8",
  search = "",
  subforumId,
  sort = "hot", // Default sort
}: PostsListProps) {
  const response = await getAllPost({
    page,
    limit,
    search,
    ...(subforumId && { subforumId }),
  });

  return (
    <div className="flex gap-6 lg:gap-8 justify-center">
      {" "}
      {/* Centering the entire content block */}
      {/* Center: Posts Section (Main Content Column) */}
      <div className="flex-1 max-w-[690px] w-full flex flex-col gap-3">
        {" "}
        {/* Adjusted max-width for main column and added flex-col gap */}
        {/* Header (Search Bar and Post Count) */}
        {/* Keeping this as a fixed header within the main content area */}
        <div className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 pb-3 mb-1 pt-2 -mt-2">
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
      {/* Right Sidebar Column (Dummy Data) */}
      <aside className="hidden lg:block w-[310px] flex-shrink-0 space-y-4 sticky top-[70px] self-start h-fit">
        {" "}
        {/* Adjusted top for sticky positioning, added h-fit */}
        {/* Example: Subreddit Info Card - Dynamic based on subforumId */}
        {subforumId ? (
          <div className="bg-white dark:bg-gray-800 rounded-md shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-blue-600 dark:bg-blue-800 p-3 text-white font-semibold text-sm">
              About r/{subforumId}
            </div>
            <div className="p-3 text-sm text-gray-700 dark:text-gray-300">
              <p className="mb-2">
                This is a community for users interested in the topic of{" "}
                <span className="font-bold">{subforumId}</span>. Share news,
                discussions, and media related to this subject.
              </p>
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  {Math.floor(Math.random() * 500) + 100}K
                </span>{" "}
                {/* Random K members */}
                <span className="text-gray-500 text-xs">Members</span>
              </div>
              <div className="flex items-center justify-between py-2 mb-2">
                <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  {Math.floor(Math.random() * 200) + 50}
                </span>{" "}
                {/* Random online count */}
                <span className="text-gray-500 text-xs">Online</span>
              </div>
              <Link
                href={`/r/${subforumId}/about`}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-between mt-2 font-medium"
              >
                About Community
                <ChevronRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          // General Home/Popular feed description card if no subforumId
          <div className="bg-white dark:bg-gray-800 rounded-md shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-blue-600 dark:bg-blue-800 p-3 text-white font-semibold text-sm flex items-center gap-2">
              <HomeIcon className="h-5 w-5" />
              Home
            </div>
            <div className="p-3 text-sm text-gray-700 dark:text-gray-300">
              <p className="mb-3">
                Your personal Reddit frontpage. Come here to check in with your
                favorite communities.
              </p>
              <Link
                href="/create-post"
                className="w-full text-center py-2 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors block mb-2"
              >
                Create Post
              </Link>
              <Link
                href="/communities"
                className="w-full text-center py-2 px-4 rounded-full border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors block"
              >
                Create Community
              </Link>
            </div>
          </div>
        )}
        {/* Example: Community Chat Channels Card */}
        <div className="bg-white dark:bg-gray-800 rounded-md shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-3 font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider">
            COMMUNITY CHAT CHANNELS
          </div>
          <div className="p-3 space-y-2 text-sm">
            {[
              {
                name: "Off Topic",
                description: "Here you can talk about everything...",
                link: "/chat/off-topic",
              },
              {
                name: "Helldivers 2",
                description: "Discussions about the game Helldivers 2.",
                link: "/chat/helldivers2",
              },
              {
                name: "General Discussions",
                description: "General discussions about the community.",
                link: "/chat/general",
              },
            ].map((channel) => (
              <Link key={channel.name} href={channel.link} className="block">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 -mx-2 rounded-md cursor-pointer">
                  <InfoIcon className="h-4 w-4" />
                  <span>{channel.name}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 pl-6">
                  {channel.description}
                </div>
              </Link>
            ))}
          </div>
        </div>
        {/* Example: Subjects/Topics Card */}
        <div className="bg-white dark:bg-gray-800 rounded-md shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-3 font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider">
            SUBJECTS
          </div>
          <div className="p-3 flex flex-wrap gap-2">
            {[
              "General",
              "Megathread",
              "Announcement",
              "Question",
              "Help",
              "Meme",
              "Art",
              "News",
              "Discussion",
            ].map((subject) => (
              <span
                key={subject}
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2.5 py-1 text-xs font-semibold rounded-full cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
        {/* Example: Reddit Footer Links (Placeholder) */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 px-3 space-y-1">
          <div className="flex flex-wrap gap-x-3">
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/help" className="hover:underline">
              Help
            </Link>
            <Link href="/press" className="hover:underline">
              Press
            </Link>
            <Link href="/careers" className="hover:underline">
              Careers
            </Link>
            <Link href="/advertise" className="hover:underline">
              Advertise
            </Link>
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>
          </div>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} Reddit Clone, Inc. All rights
            reserved.
          </p>
        </div>
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
