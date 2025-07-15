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

type Props = {
  subforum: Subforum;
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
      <div className="bg-white rounded-lg shadow-sm hover:shadow transition-shadow">
        <div className="flex p-4">
          {/* Vote Section */}
          <div className="flex flex-col items-center mr-4 w-10">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-500 hover:text-orange-500"
            >
              <ArrowUpIcon className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-gray-900">
              {subforum.membersCount || 0}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-500 hover:text-blue-500"
            >
              <ArrowDownIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Content Section */}
          <div className="flex-grow min-w-0">
            <div className="flex items-start">
              <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">
                  {subforum.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-grow">
                <Link
                  href={{
                    pathname: "/post",
                    query: { subforumId: subforum.id },
                  }}
                  className="text-lg font-medium text-gray-900 hover:text-cyan-600 truncate block"
                >
                  {subforum.name}
                </Link>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{subforum.postsCount || 0} posts</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(subforum.createdAt)} ago</span>
                </div>
                {subforum.description && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {subforum.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-start gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              className="text-cyan-600 border-cyan-200 hover:bg-cyan-50"
            >
              Join
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <span className="flex items-center">
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <EditSubforumDialog
        subforum={subforum}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

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
