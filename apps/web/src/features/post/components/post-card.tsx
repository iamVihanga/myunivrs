"use client";

import { formatDistanceToNow } from "date-fns";
import {
  ExternalLinkIcon,
  LinkIcon,
  MessageSquareIcon,
  Share2Icon, // Using Share2Icon for a more generic share
  ThumbsUpIcon, // For a 'Like' button feel
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader } from "@repo/ui/components/card"; // Import CardHeader and CardContent
import Link from "next/link";
import { useId } from "react";
import { deletePost } from "../actions/delete.action";
import type { Post } from "../schemas";
import { EditPostDialog } from "./edit-post-dialog";

type Props = {
  post: Post;
};

export function PostCard({ post }: Props) {
  const id = useId();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deletePost(post.id);
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const getPostType = (url: string | null) => {
    if (!url) return "text";
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    const isVideo = /(youtube|vimeo|youtu\.be)/i.test(url);
    return isImage ? "image" : isVideo ? "video" : "link";
  };

  const postType = getPostType(post.url || null);

  return (
    <>
      <Card
        key={id}
        className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <CardHeader className="flex flex-row items-center space-x-3 p-4 pb-2">
          {/* User Avatar */}
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={`https://avatar.vercel.sh/${post.createdBy}?s=40`}
              alt={post.createdBy ?? undefined}
              className="rounded-full"
            />
            <AvatarFallback className="bg-blue-100 text-blue-800 text-sm">
              {post.createdBy?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* User Info & Timestamp */}
          <div className="flex-grow">
            <div className="flex items-center">
              <Link
                href={`/user/${post.createdBy}`}
                className="font-semibold text-gray-900 dark:text-gray-100 hover:underline text-base"
              >
                {post.createdBy}
              </Link>
              {post.subforumId && (
                <>
                  <span className="mx-1 text-gray-400 dark:text-gray-600">
                    •
                  </span>
                  <Link
                    href={`/subforum/${post.subforumId}`}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
                  >
                    in r/{post.subforumId}
                  </Link>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {post.createdAt
                ? formatDistanceToNow(post.createdAt, { addSuffix: true })
                : "unknown time"}
              {post.status !== "published" && (
                <Badge
                  variant="outline"
                  className="ml-2 bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700 text-[10px] py-0 px-1.5 rounded-full"
                >
                  {post.status}
                </Badge>
              )}
            </p>
          </div>

          {/* Action buttons for owner (Edit/Delete) - usually in a dropdown on FB */}
          {/* For simplicity, keeping them as direct buttons, but you might want a KebabMenu here */}
          <div className="flex gap-2">
            <EditPostDialog post={post} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full"
            >
              <TrashIcon className="h-4 w-4" />
              <span className="sr-only">Delete Post</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              asChild
              className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full"
            >
              <Link href={`/post/${post.id}`}>
                <ExternalLinkIcon className="h-4 w-4" />
                <span className="sr-only">View Post</span>
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          {/* Post Title (often implied or part of content on FB, but explicit here) */}
          <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 leading-snug mb-2">
            {post.title}
          </h3>
          {/* Post Content/Description */}
          {post.content && (
            <p className="text-gray-800 dark:text-gray-200 text-base mb-3 leading-relaxed">
              {post.content}
            </p>
          )}
          {/* Media Section: Images or Link Preview */}
          {post.images && post.images.length > 0 ? (
            // Display Images
            <div className="mt-2 -mx-4">
              {" "}
              {/* Negative margin to extend full width */}
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Post image ${index + 1}`}
                  // object-cover is usually good for feeds, change to contain if full image is critical
                  className="w-full max-h-96 object-cover bg-gray-100 dark:bg-gray-900"
                />
              ))}
            </div>
          ) : post.url && postType === "link" ? (
            // Display Link Preview (a simplified version)
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mt-3"
            >
              <div className="flex items-center p-3">
                <LinkIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3 shrink-0" />
                <div>
                  <p className="font-semibold text-blue-600 dark:text-blue-400 truncate">
                    {post.title || new URL(post.url).hostname}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {new URL(post.url).hostname}
                  </p>
                </div>
                <ExternalLinkIcon className="h-4 w-4 ml-auto text-gray-500 dark:text-gray-400" />
              </div>
            </a>
          ) : null}{" "}
          {/* No media to display */}
          {/* Social Interactions (Likes/Comments Count) */}
          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1">
              <ThumbsUpIcon className="h-4 w-4 text-blue-500 fill-blue-500" />{" "}
              {/* Blue filled icon for likes */}
              <span>{post.voteScore || 0} Likes</span>
            </div>
            <div className="flex items-center gap-1">
              <span>0 Comments</span>
            </div>
          </div>
          {/* Action Buttons (Like, Comment, Share) */}
          <div className="flex justify-around border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
            <Button
              variant="ghost"
              className="flex-1 text-center py-2 px-0 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <ThumbsUpIcon className="h-5 w-5 mr-2" /> Like
            </Button>
            <Button
              variant="ghost"
              className="flex-1 text-center py-2 px-0 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <MessageSquareIcon className="h-5 w-5 mr-2" /> Comment
            </Button>
            <Button
              variant="ghost"
              className="flex-1 text-center py-2 px-0 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <Share2Icon className="h-5 w-5 mr-2" /> Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AlertDialog remains unchanged as it's a functional dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the post "{post.title}". This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Post"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
