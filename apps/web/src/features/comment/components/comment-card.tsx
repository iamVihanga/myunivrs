"use client";

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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { formatDistanceToNow } from "date-fns";
import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { deleteComment } from "../actions/delete.action";
import type { Comment } from "../schemas";
import { EditCommentDialog } from "./edit-comment-dialog";

type Props = {
  comment: Comment;
};

export function CommentCard({ comment }: Props) {
  const id = useId();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userVote, setUserVote] = useState<1 | -1 | 0>(0);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteComment(comment.id);
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Failed to delete comment");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="flex space-x-3 p-4 hover:bg-gray-50">
        {/* Vote Column */}
        <div className="flex flex-col items-center space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setUserVote(userVote === 1 ? 0 : 1)}
          >
            <ArrowUpIcon className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{comment.voteScore}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setUserVote(userVote === -1 ? 0 : -1)}
          >
            <ArrowDownIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Comment Content */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={`https://avatar.vercel.sh/${comment.createdBy}`}
                alt={comment.createdBy || undefined}
              />
              <AvatarFallback>{comment.createdBy ? comment.createdBy[0] : "?"}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{comment.createdBy}</span>
            <span className="text-sm text-gray-500">•</span>
            <time className="text-sm text-gray-500">
              {comment.createdAt ? formatDistanceToNow(comment.createdAt) : "unknown time"} ago
            </time>
          </div>
          <p className="text-gray-900">{comment.content}</p>

          {/* Actions */}
          <div className="flex items-center space-x-2 mt-2">
            <EditCommentDialog comment={comment} />
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="h-8 px-2"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
