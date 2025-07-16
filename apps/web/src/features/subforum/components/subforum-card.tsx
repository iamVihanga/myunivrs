// "use client";

// import { formatDistanceToNow } from "date-fns";
// import {
//   ArrowDownIcon,
//   ArrowUpIcon,
//   MoreVerticalIcon,
//   PencilIcon,
//   TrashIcon,
// } from "lucide-react";
// import { useState } from "react";
// import { toast } from "sonner";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@repo/ui/components/alert-dialog";
// import { Button } from "@repo/ui/components/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@repo/ui/components/dropdown-menu";
// import Link from "next/link";
// import { deleteSubforum } from "../actions/delete.action";
// import type { Subforum } from "../schemas";
// import { EditSubforumDialog } from "./edit-subforum-dialog";

// type Props = {
//   subforum: Subforum;
// };

// export function SubforumCard({ subforum }: Props) {
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [showEditDialog, setShowEditDialog] = useState(false);

//   const handleDelete = async () => {
//     try {
//       setIsDeleting(true);
//       await deleteSubforum(subforum.id);
//       toast.success("Subforum deleted successfully");
//     } catch (error) {
//       console.error("Failed to delete subforum:", error);
//       toast.error("Failed to delete subforum");
//     } finally {
//       setIsDeleting(false);
//       setShowDeleteDialog(false);
//     }
//   };

//   return (
//     <>
//       <div className="bg-white rounded-lg shadow-sm hover:shadow transition-shadow">
//         <div className="flex p-4">
//           {/* Vote Section */}
//           <div className="flex flex-col items-center mr-4 w-10">
//             <Button
//               variant="ghost"
//               size="sm"
//               className="h-6 w-6 p-0 text-gray-500 hover:text-orange-500"
//             >
//               <ArrowUpIcon className="h-4 w-4" />
//             </Button>
//             <span className="text-sm font-medium text-gray-900">
//               {subforum.membersCount || 0}
//             </span>
//             <Button
//               variant="ghost"
//               size="sm"
//               className="h-6 w-6 p-0 text-gray-500 hover:text-blue-500"
//             >
//               <ArrowDownIcon className="h-4 w-4" />
//             </Button>
//           </div>

//           {/* Content Section */}
//           <div className="flex-grow min-w-0">
//             <div className="flex items-start">
//               <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mr-3">
//                 <span className="text-white font-bold text-lg">
//                   {subforum.name.charAt(0).toUpperCase()}
//                 </span>
//               </div>
//               <div className="min-w-0 flex-grow">
//                 <Link
//                   href={{
//                     pathname: "/post",
//                     query: { subforumId: subforum.id },
//                   }}
//                   className="text-lg font-medium text-gray-900 hover:text-cyan-600 truncate block"
//                 >
//                   {subforum.name}
//                 </Link>
//                 <div className="flex items-center gap-2 text-xs text-gray-500">
//                   <span>{subforum.postsCount || 0} posts</span>
//                   <span>•</span>
//                   <span>{formatDistanceToNow(subforum.createdAt)} ago</span>
//                 </div>
//                 {subforum.description && (
//                   <p className="mt-2 text-sm text-gray-600 line-clamp-2">
//                     {subforum.description}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Actions Section */}
//           <div className="flex items-start gap-2 ml-4">
//             <Button
//               variant="outline"
//               size="sm"
//               className="text-cyan-600 border-cyan-200 hover:bg-cyan-50"
//             >
//               Join
//             </Button>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                   <MoreVerticalIcon className="h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
//                   <span className="flex items-center">
//                     <PencilIcon className="h-4 w-4 mr-2" />
//                     Edit
//                   </span>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem
//                   onClick={() => setShowDeleteDialog(true)}
//                   className="text-red-600"
//                 >
//                   <TrashIcon className="h-4 w-4 mr-2" />
//                   Delete
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </div>

//       {/* Edit Dialog */}
//       <EditSubforumDialog
//         subforum={subforum}
//         open={showEditDialog}
//         onOpenChange={setShowEditDialog}
//       />

//       <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Subforum?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This will permanently delete the subforum "{subforum.name}" and
//               all its associated content. This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDelete}
//               disabled={isDeleting}
//               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//             >
//               {isDeleting ? "Deleting..." : "Delete Subforum"}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }

"use client";

import { formatDistanceToNow } from "date-fns";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card"; // Import Card components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import Link from "next/link";
import { deleteSubforum } from "../actions/delete.action";
import type { Subforum } from "../schemas";
import { EditSubforumDialog } from "./edit-subforum-dialog";

// Extend Subforum type to include iconUrl for better UI
type ExtendedSubforum = Subforum & {
  iconUrl?: string | null; // Assuming your schema might be updated to include this
  onlineMembersCount?: number | null; // Assuming you might have this data
};

type Props = {
  subforum: ExtendedSubforum;
};

export function SubforumCard({ subforum }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteSubforum(subforum.id);
      toast.success("Subforum deleted successfully");
    } catch (error) {
      console.error("Failed to delete subforum:", error);
      toast.error("Failed to delete subforum");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardContent className="flex p-0">
          {" "}
          {/* Use p-0 to control padding more granularly */}
          {/* Vote Section - Left Sidebar */}
          <div className="flex flex-col items-center justify-start py-4 px-2 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-700 rounded-l-lg">
            <Button
              variant="ghost"
              size="icon" // Changed to icon size for smaller buttons
              className="h-8 w-8 p-0 text-gray-500 hover:text-orange-500 dark:hover:text-orange-400 rounded-full"
            >
              <ArrowUpIcon className="h-5 w-5" /> {/* Larger icon */}
            </Button>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 my-1">
              {subforum.membersCount || 0}{" "}
              {/* Using membersCount for vote-like display */}
            </span>
            <Button
              variant="ghost"
              size="icon" // Changed to icon size
              className="h-8 w-8 p-0 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 rounded-full"
            >
              <ArrowDownIcon className="h-5 w-5" /> {/* Larger icon */}
            </Button>
          </div>
          {/* Main Content Section */}
          <div className="flex-grow p-4 min-w-0">
            <div className="flex items-start mb-2">
              {/* Community Icon */}
              <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden flex items-center justify-center mr-3 bg-gray-200 dark:bg-gray-600">
                {subforum.iconUrl ? (
                  <img
                    src={subforum.iconUrl}
                    alt={`${subforum.name} icon`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-700 dark:text-gray-300 font-bold text-xl">
                    {subforum.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-grow">
                {/* Community Name */}
                <Link
                  href={{
                    pathname: "/post",
                    query: { subforumId: subforum.id },
                  }}
                  className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate block leading-tight"
                >
                  r/{subforum.name}
                </Link>
                {/* Community Stats */}
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  <span>{subforum.membersCount || 0} members</span>
                  {subforum.onlineMembersCount !== undefined && ( // Only show if onlineMembersCount is provided
                    <>
                      <span className="mx-0.5">•</span>
                      <span>{subforum.onlineMembersCount || 0} online</span>
                    </>
                  )}
                  <span className="mx-0.5">•</span>
                  <span>{subforum.postsCount || 0} posts</span>
                  <span className="mx-0.5">•</span>
                  <span>
                    {formatDistanceToNow(new Date(subforum.createdAt))} ago
                  </span>
                </div>
              </div>
            </div>

            {/* Community Description */}
            {subforum.description && (
              <p className="mt-3 text-base text-gray-800 dark:text-gray-200 line-clamp-3 leading-relaxed">
                {subforum.description}
              </p>
            )}

            {/* Action Buttons at the bottom of the content area */}
            <div className="flex items-center justify-end gap-2 mt-4">
              <Button
                variant="default" // Changed to default for a more prominent "Join"
                size="sm"
                className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-2 rounded-full"
              >
                Join Community
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 p-0 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <MoreVerticalIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => setShowEditDialog(true)}
                    className="cursor-pointer"
                  >
                    <span className="flex items-center">
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 cursor-pointer"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditSubforumDialog
        subforum={subforum}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subforum?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the subforum "{subforum.name}" and
              all its associated content. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Subforum"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
