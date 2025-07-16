// // components/post-card.tsx
// "use client";

// import { formatDistanceToNow } from "date-fns";
// import {
//   ArrowBigDown, // Using DotIcon for the ellipsis menu
//   ArrowBigUp,
//   DotIcon,
//   ExternalLinkIcon,
//   LinkIcon,
//   MessageSquareIcon,
//   Share2Icon, // Keeping ThumbsUp for now for like button feel, but Reddit uses Up/Down arrows
//   TrashIcon,
// } from "lucide-react";
// import { useEffect, useId, useState } from "react";
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
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@repo/ui/components/avatar";
// import { Badge } from "@repo/ui/components/badge";
// import { Button } from "@repo/ui/components/button";
// import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
// import { Textarea } from "@repo/ui/components/textarea";
// import Link from "next/link";
// import { deletePost } from "../actions/delete.action";
// import type { Post } from "../schemas";
// import { EditPostDialog } from "./edit-post-dialog";

// type Props = {
//   post: Post & {
//     comments?: Array<{
//       id: string;
//       createdBy: string | null;
//       createdAt: string | number | Date;
//       content: string;
//     }>;
//   };
// };

// interface Comment {
//   id: string;
//   postId: string;
//   createdBy: string;
//   content: string;
//   voteScore: number;
//   createdAt: string;
// }

// export function PostCard({ post }: Props) {
//   const id = useId();
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [showComments, setShowComments] = useState(false);
//   const [newComment, setNewComment] = useState("");
//   const [isSubmittingComment, setIsSubmittingComment] = useState(false);
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [isLoadingComments, setIsLoadingComments] = useState(false);

//   const handleDelete = async () => {
//     try {
//       setIsDeleting(true);
//       await deletePost(post.id);
//       toast.success("Post deleted successfully");
//     } catch (error) {
//       console.error("Failed to delete post:", error);
//       toast.error("Failed to delete post");
//     } finally {
//       setIsDeleting(false);
//       setShowDeleteDialog(false);
//     }
//   };

//   const fetchComments = async () => {
//     if (!isLoadingComments) {
//       setIsLoadingComments(true);
//     }
//     try {
//       const response = await fetch(`/api/comment?postId=${post.id}`);
//       const data = await response.json();

//       if (!response.ok) {
//         console.error("Backend error response during comment fetch:", data);
//         const errorMessage =
//           typeof data === "object" && data !== null && "message" in data
//             ? (data as { message?: string }).message
//             : "Failed to fetch comments: Unknown backend error.";
//         throw new Error(errorMessage);
//       }
//       setComments(data.data || []);
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//       toast.error(
//         `Failed to load comments: ${error instanceof Error ? error.message : "Unknown error"}`
//       );
//     } finally {
//       setIsLoadingComments(false);
//     }
//   };

//   const handlePostComment = async () => {
//     if (!newComment.trim()) {
//       toast.info("Comment cannot be empty.");
//       return;
//     }

//     setIsSubmittingComment(true);
//     try {
//       const response = await fetch("/api/comment", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           // Add Authorization header here if your backend requires it
//           // 'Authorization': `Bearer YOUR_AUTH_TOKEN_HERE`,
//         },
//         body: JSON.stringify({
//           content: newComment.trim(),
//           postId: post.id,
//           createdBy: "AnonymousUser", // Placeholder, integrate with real user data
//           voteScore: 0,
//           parentCommentId: null, // Assuming top-level comments for now
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         console.error("Backend error response during comment post:", data);
//         const errorMessage =
//           typeof data === "object" && data !== null && "message" in data
//             ? (data as { message?: string }).message
//             : "Failed to post comment: Unknown backend error.";
//         throw new Error(errorMessage);
//       }

//       await fetchComments(); // Re-fetch comments to update the list immediately
//       setNewComment(""); // Clear the input field
//       toast.success("Comment posted successfully!");
//     } catch (error) {
//       console.error("Error posting comment:", error);
//       toast.error(
//         error instanceof Error ? error.message : "Failed to post comment"
//       );
//     } finally {
//       setIsSubmittingComment(false);
//     }
//   };

//   const getPostType = (url: string | null) => {
//     if (!url) return "text";
//     const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
//     const isVideo = /(youtube|vimeo|youtu\.be)/i.test(url);
//     return isImage ? "image" : isVideo ? "video" : "link";
//   };

//   const postType = getPostType(post.url || null);

//   useEffect(() => {
//     if (showComments) {
//       fetchComments();
//     }
//   }, [showComments, post.id]);

//   return (
//     <>
//       <Card
//         key={id}
//         className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
//       >
//         <CardHeader className="p-3 pb-0">
//           {/* Subreddit and Post Options (Reddit style) */}
//           <div className="flex items-center justify-between mb-1">
//             <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
//               {/* This is simulated, replace with actual subreddit data if available */}
//               <Link
//                 href={`/r/${post.subforumId || "all"}`} // Link to subforum
//                 className="font-semibold text-blue-700 dark:text-blue-400 hover:underline"
//               >
//                 r/{post.subforumId || "all"}
//               </Link>
//               <span className="mx-1">•</span>
//               <span>Posted by u/{post.createdBy}</span>
//               <span className="mx-1">•</span>
//               <span>
//                 {post.createdAt
//                   ? formatDistanceToNow(post.createdAt, { addSuffix: true })
//                   : "unknown time"}
//               </span>
//             </div>
//             {/* Ellipsis menu for post actions - replace with actual dropdown */}
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-7 w-7 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full"
//             >
//               <DotIcon className="h-5 w-5" />
//             </Button>
//           </div>

//           {/* Post Title */}
//           <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 leading-snug mb-2 px-1">
//             {post.title}
//             {post.status !== "published" && (
//               <Badge
//                 variant="outline"
//                 className="ml-2 bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700 text-[10px] py-0 px-1.5 rounded-full"
//               >
//                 {post.status}
//               </Badge>
//             )}
//           </h3>
//         </CardHeader>

//         <CardContent className="p-3 pt-0">
//           {/* Post Content/Description */}
//           {post.content && (
//             <p className="text-gray-800 dark:text-gray-200 text-base mb-3 px-1 leading-relaxed">
//               {post.content}
//             </p>
//           )}

//           {/* Media Section: Images or Link Preview (unchanged) */}
//           {post.images && post.images.length > 0 ? (
//             <div className="mt-2 -mx-3">
//               {" "}
//               {/* Adjusted negative margin */}
//               {post.images.map((image, index) => (
//                 <img
//                   key={index}
//                   src={image}
//                   alt={`Post image ${index + 1}`}
//                   className="w-full max-h-96 object-cover bg-gray-100 dark:bg-gray-900"
//                 />
//               ))}
//             </div>
//           ) : post.url && postType === "link" ? (
//             <a
//               href={post.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="block border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mt-3"
//             >
//               <div className="flex items-center p-3">
//                 <LinkIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3 shrink-0" />
//                 <div>
//                   <p className="font-semibold text-blue-600 dark:text-blue-400 truncate">
//                     {post.title || new URL(post.url).hostname}
//                   </p>
//                   <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
//                     {new URL(post.url).hostname}
//                   </p>
//                 </div>
//                 <ExternalLinkIcon className="h-4 w-4 ml-auto text-gray-500 dark:text-gray-400" />
//               </div>
//             </a>
//           ) : null}

//           {/* Reddit-style Interaction Bar (Vote, Comments, Share) */}
//           <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mt-4 px-1">
//             {/* Vote Controls */}
//             <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-7 w-7 p-0 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
//                 aria-label="Upvote"
//               >
//                 <ArrowBigUp className="h-5 w-5" />
//               </Button>
//               <span className="font-semibold text-gray-800 dark:text-gray-200 mx-1">
//                 {post.voteScore || 0}
//               </span>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-7 w-7 p-0 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
//                 aria-label="Downvote"
//               >
//                 <ArrowBigDown className="h-5 w-5" />
//               </Button>
//             </div>

//             {/* Comments Button */}
//             <Button
//               variant="ghost"
//               size="sm"
//               className="flex items-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-3 py-1.5"
//               onClick={() => setShowComments(!showComments)}
//             >
//               <MessageSquareIcon className="h-4 w-4 mr-1" />
//               <span className="font-semibold">{comments.length}</span>
//               <span className="ml-1">Comments</span>
//             </Button>

//             {/* Share Button */}
//             <Button
//               variant="ghost"
//               size="sm"
//               className="flex items-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-3 py-1.5"
//             >
//               <Share2Icon className="h-4 w-4 mr-1" />
//               <span className="font-semibold">Share</span>
//             </Button>

//             {/* You can add more Reddit-style actions here if needed */}
//             {/* Edit/Delete Post Buttons (moved from header to here, or into ellipsis menu) */}
//             <div className="flex gap-1">
//               <EditPostDialog post={post} />
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setShowDeleteDialog(true)}
//                 disabled={isDeleting}
//                 className="h-7 w-7 p-0 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full"
//               >
//                 <TrashIcon className="h-4 w-4" />
//                 <span className="sr-only">Delete Post</span>
//               </Button>
//               <Button
//                 size="icon"
//                 variant="ghost"
//                 asChild
//                 className="h-7 w-7 p-0 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full"
//               >
//                 <Link href={`/post/${post.id}`}>
//                   <ExternalLinkIcon className="h-4 w-4" />
//                   <span className="sr-only">View Post</span>
//                 </Link>
//               </Button>
//             </div>
//           </div>

//           {/* Comment Section */}
//           {showComments && (
//             <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 px-1">
//               {/* Comment Form (at the top of the comment section) */}
//               <div className="flex items-start space-x-2 mb-4">
//                 <Avatar className="h-8 w-8 mt-1 shrink-0">
//                   <AvatarImage
//                     src={`https://avatar.vercel.sh/current_user?s=32`} // Replace 'current_user' with actual user
//                     alt="Current User"
//                   />
//                   <AvatarFallback>U</AvatarFallback>
//                 </Avatar>
//                 <div className="flex-1">
//                   <Textarea
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                     placeholder="What are your thoughts?" // Reddit style placeholder
//                     className="min-h-[60px] resize-none focus-visible:ring-0 focus-visible:ring-offset-0 border border-gray-300 dark:border-gray-600 rounded-md"
//                   />
//                   <div className="flex justify-end mt-2">
//                     <Button
//                       size="sm"
//                       onClick={handlePostComment}
//                       disabled={isSubmittingComment || !newComment.trim()}
//                     >
//                       {isSubmittingComment ? "Posting..." : "Comment"}
//                     </Button>
//                   </div>
//                 </div>
//               </div>

//               {/* Comments List */}
//               <div className="mt-4 space-y-4">
//                 {isLoadingComments ? (
//                   <p className="text-center text-gray-500 dark:text-gray-400">
//                     Loading comments...
//                   </p>
//                 ) : comments.length === 0 ? (
//                   <p className="text-center text-gray-500 dark:text-gray-400">
//                     No comments yet. Be the first to comment!
//                   </p>
//                 ) : (
//                   comments.map((comment, index) => (
//                     // Simulating indentation for top-level comments
//                     // For true nesting, you'd recursively render components
//                     <div
//                       key={comment.id}
//                       // Use padding-left and border-left for visual thread
//                       // This is a simplified version; for true nesting, you'd pass a 'depth' prop
//                       className={`flex space-x-2 relative group`}
//                       style={{ paddingLeft: `${0 * 20}px` }} // Depth 0 for top-level
//                     >
//                       {/* Vertical line for indentation - simplified for flat comments */}
//                       {index > 0 && ( // Only draw line if not the very first comment, or handle based on replies
//                         <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gray-200 dark:bg-gray-700 ml-[10px]" />
//                       )}

//                       <Avatar className="h-7 w-7 mt-1 shrink-0">
//                         <AvatarImage
//                           src={`https://avatar.vercel.sh/${comment.createdBy}?s=32`}
//                           alt={comment.createdBy}
//                         />
//                         <AvatarFallback>
//                           {comment.createdBy.charAt(0).toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
//                         <div className="flex items-center gap-2">
//                           <Link
//                             href={`/user/${comment.createdBy}`}
//                             className="text-sm font-semibold hover:underline"
//                           >
//                             u/{comment.createdBy}
//                           </Link>
//                           <span className="text-xs text-gray-500">
//                             {formatDistanceToNow(new Date(comment.createdAt), {
//                               addSuffix: true,
//                             })}
//                           </span>
//                         </div>
//                         <p className="text-sm mt-1 text-gray-800 dark:text-gray-200">
//                           {comment.content}
//                         </p>
//                         {/* Comment Action Bar (Reply, Upvote/Downvote for each comment) */}
//                         <div className="flex items-center mt-2 text-xs text-gray-600 dark:text-gray-400">
//                           <div className="flex items-center mr-3">
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="h-6 w-6 p-0 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
//                             >
//                               <ArrowBigUp className="h-4 w-4" />
//                             </Button>
//                             <span className="mx-0.5">{comment.voteScore}</span>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="h-6 w-6 p-0 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
//                             >
//                               <ArrowBigDown className="h-4 w-4" />
//                             </Button>
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="h-6 px-2 py-0 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
//                           >
//                             Reply
//                           </Button>
//                           {/* More comment actions like Share, Report etc. */}
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* AlertDialog remains unchanged as it's a functional dialog */}
//       <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This will permanently delete the post "{post.title}". This action
//               cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDelete}
//               disabled={isDeleting}
//               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//             >
//               {isDeleting ? "Deleting..." : "Delete Post"}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }

// components/post-card.tsx

///////////////////////////////////////////////////////////////////

// "use client";

// import { formatDistanceToNow } from "date-fns";
// import {
//   ArrowBigDown, // Using DotIcon for the ellipsis menu
//   ArrowBigUp,
//   DotIcon,
//   ExternalLinkIcon,
//   LinkIcon,
//   MessageSquareIcon,
//   Share2Icon, // Keeping ThumbsUp for now for like button feel, but Reddit uses Up/Down arrows
//   TrashIcon,
// } from "lucide-react";
// import { useEffect, useId, useState } from "react";
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
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@repo/ui/components/avatar";
// import { Badge } from "@repo/ui/components/badge";
// import { Button } from "@repo/ui/components/button";
// import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
// import { Textarea } from "@repo/ui/components/textarea";
// import Link from "next/link";
// import { deletePost } from "../actions/delete.action";
// import type { Post } from "../schemas";
// import { EditPostDialog } from "./edit-post-dialog";

// type Props = {
//   post: Post & {
//     comments?: Array<{
//       id: string;
//       createdBy: string | null;
//       createdAt: string | number | Date;
//       content: string;
//     }>;
//   };
// };

// interface Comment {
//   id: string;
//   postId: string;
//   createdBy: string;
//   content: string;
//   voteScore: number;
//   createdAt: string;
// }

// export function PostCard({ post }: Props) {
//   const id = useId();
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [showComments, setShowComments] = useState(false);
//   const [newComment, setNewComment] = useState("");
//   const [isSubmittingComment, setIsSubmittingComment] = useState(false);
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [isLoadingComments, setIsLoadingComments] = useState(true); // Set to true initially

//   const handleDelete = async () => {
//     try {
//       setIsDeleting(true);
//       await deletePost(post.id);
//       toast.success("Post deleted successfully");
//     } catch (error) {
//       console.error("Failed to delete post:", error);
//       toast.error("Failed to delete post");
//     } finally {
//       setIsDeleting(false);
//       setShowDeleteDialog(false);
//     }
//   };

//   const fetchComments = async () => {
//     // Only set loading if it's not already true (e.g., initial load)
//     if (!isLoadingComments) {
//       setIsLoadingComments(true);
//     }
//     try {
//       const response = await fetch(`/api/comment?postId=${post.id}`);
//       const data = await response.json();

//       if (!response.ok) {
//         console.error("Backend error response during comment fetch:", data);
//         const errorMessage =
//           typeof data === "object" && data !== null && "message" in data
//             ? (data as { message?: string }).message
//             : "Failed to fetch comments: Unknown backend error.";
//         throw new Error(errorMessage);
//       }
//       setComments(data.data || []);
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//       toast.error(
//         `Failed to load comments: ${error instanceof Error ? error.message : "Unknown error"}`
//       );
//     } finally {
//       setIsLoadingComments(false);
//     }
//   };

//   const handlePostComment = async () => {
//     if (!newComment.trim()) {
//       toast.info("Comment cannot be empty.");
//       return;
//     }

//     setIsSubmittingComment(true);
//     try {
//       const response = await fetch("/api/comment", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           // Add Authorization header here if your backend requires it
//           // 'Authorization': `Bearer YOUR_AUTH_TOKEN_HERE`,
//         },
//         body: JSON.stringify({
//           content: newComment.trim(),
//           postId: post.id,
//           createdBy: "AnonymousUser", // Placeholder, integrate with real user data
//           voteScore: 0,
//           parentCommentId: null, // Assuming top-level comments for now
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         console.error("Backend error response during comment post:", data);
//         const errorMessage =
//           typeof data === "object" && data !== null && "message" in data
//             ? (data as { message?: string }).message
//             : "Failed to post comment: Unknown backend error.";
//         throw new Error(errorMessage);
//       }

//       await fetchComments(); // Re-fetch comments to update the list immediately
//       setNewComment(""); // Clear the input field
//       toast.success("Comment posted successfully!");
//     } catch (error) {
//       console.error("Error posting comment:", error);
//       toast.error(
//         error instanceof Error ? error.message : "Failed to post comment"
//       );
//     } finally {
//       setIsSubmittingComment(false);
//     }
//   };

//   const getPostType = (url: string | null) => {
//     if (!url) return "text";
//     const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
//     const isVideo = /(youtube|vimeo|youtu\.be)/i.test(url);
//     return isImage ? "image" : isVideo ? "video" : "link";
//   };

//   const postType = getPostType(post.url || null);

//   // --- FIX APPLIED HERE ---
//   useEffect(() => {
//     fetchComments(); // Fetch comments on initial component mount
//   }, [post.id]); // Dependency array: re-fetch if post.id changes

//   return (
//     <>
//       <Card
//         key={id}
//         className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
//       >
//         <CardHeader className="p-3 pb-0">
//           {/* Subreddit and Post Options (Reddit style) */}
//           <div className="flex items-center justify-between mb-1">
//             <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
//               {/* This is simulated, replace with actual subreddit data if available */}
//               <Link
//                 href={`/r/${post.subforumId || "all"}`} // Link to subforum
//                 className="font-semibold text-blue-700 dark:text-blue-400 hover:underline"
//               >
//                 r/{post.subforumId || "all"}
//               </Link>
//               <span className="mx-1">•</span>
//               <span>Posted by u/{post.createdBy}</span>
//               <span className="mx-1">•</span>
//               <span>
//                 {post.createdAt
//                   ? formatDistanceToNow(post.createdAt, { addSuffix: true })
//                   : "unknown time"}
//               </span>
//             </div>
//             {/* Ellipsis menu for post actions - replace with actual dropdown */}
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-7 w-7 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full"
//             >
//               <DotIcon className="h-5 w-5" />
//             </Button>
//           </div>

//           {/* Post Title */}
//           <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 leading-snug mb-2 px-1">
//             {post.title}
//             {post.status !== "published" && (
//               <Badge
//                 variant="outline"
//                 className="ml-2 bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700 text-[10px] py-0 px-1.5 rounded-full"
//               >
//                 {post.status}
//               </Badge>
//             )}
//           </h3>
//         </CardHeader>

//         <CardContent className="p-3 pt-0">
//           {/* Post Content/Description */}
//           {post.content && (
//             <p className="text-gray-800 dark:text-gray-200 text-base mb-3 px-1 leading-relaxed">
//               {post.content}
//             </p>
//           )}

//           {/* Media Section: Images or Link Preview (unchanged) */}
//           {post.images && post.images.length > 0 ? (
//             <div className="mt-2 -mx-3">
//               {" "}
//               {/* Adjusted negative margin */}
//               {post.images.map((image, index) => (
//                 <img
//                   key={index}
//                   src={image}
//                   alt={`Post image ${index + 1}`}
//                   className="w-full max-h-96 object-cover bg-gray-100 dark:bg-gray-900"
//                 />
//               ))}
//             </div>
//           ) : post.url && postType === "link" ? (
//             <a
//               href={post.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="block border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mt-3"
//             >
//               <div className="flex items-center p-3">
//                 <LinkIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3 shrink-0" />
//                 <div>
//                   <p className="font-semibold text-blue-600 dark:text-blue-400 truncate">
//                     {post.title || new URL(post.url).hostname}
//                   </p>
//                   <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
//                     {new URL(post.url).hostname}
//                   </p>
//                 </div>
//                 <ExternalLinkIcon className="h-4 w-4 ml-auto text-gray-500 dark:text-gray-400" />
//               </div>
//             </a>
//           ) : null}

//           {/* Reddit-style Interaction Bar (Vote, Comments, Share) */}
//           <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mt-4 px-1">
//             {/* Vote Controls */}
//             <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-7 w-7 p-0 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
//                 aria-label="Upvote"
//               >
//                 <ArrowBigUp className="h-5 w-5" />
//               </Button>
//               <span className="font-semibold text-gray-800 dark:text-gray-200 mx-1">
//                 {post.voteScore || 0}
//               </span>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-7 w-7 p-0 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
//                 aria-label="Downvote"
//               >
//                 <ArrowBigDown className="h-5 w-5" />
//               </Button>
//             </div>

//             {/* Comments Button */}
//             <Button
//               variant="ghost"
//               size="sm"
//               className="flex items-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-3 py-1.5"
//               onClick={() => setShowComments(!showComments)}
//             >
//               <MessageSquareIcon className="h-4 w-4 mr-1" />
//               {/* Display comments.length directly */}
//               <span className="font-semibold">
//                 {isLoadingComments ? "..." : comments.length}
//               </span>
//               <span className="ml-1">Comments</span>
//             </Button>

//             {/* Share Button */}
//             <Button
//               variant="ghost"
//               size="sm"
//               className="flex items-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-3 py-1.5"
//             >
//               <Share2Icon className="h-4 w-4 mr-1" />
//               <span className="font-semibold">Share</span>
//             </Button>

//             {/* You can add more Reddit-style actions here if needed */}
//             {/* Edit/Delete Post Buttons (moved from header to here, or into ellipsis menu) */}
//             <div className="flex gap-1">
//               <EditPostDialog post={post} />
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setShowDeleteDialog(true)}
//                 disabled={isDeleting}
//                 className="h-7 w-7 p-0 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full"
//               >
//                 <TrashIcon className="h-4 w-4" />
//                 <span className="sr-only">Delete Post</span>
//               </Button>
//               <Button
//                 size="icon"
//                 variant="ghost"
//                 asChild
//                 className="h-7 w-7 p-0 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full"
//               >
//                 <Link href={`/post/${post.id}`}>
//                   <ExternalLinkIcon className="h-4 w-4" />
//                   <span className="sr-only">View Post</span>
//                 </Link>
//               </Button>
//             </div>
//           </div>

//           {/* Comment Section */}
//           {showComments && (
//             <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 px-1">
//               {/* Comment Form (at the top of the comment section) */}
//               <div className="flex items-start space-x-2 mb-4">
//                 <Avatar className="h-8 w-8 mt-1 shrink-0">
//                   <AvatarImage
//                     src={`https://avatar.vercel.sh/current_user?s=32`} // Replace 'current_user' with actual user
//                     alt="Current User"
//                   />
//                   <AvatarFallback>U</AvatarFallback>
//                 </Avatar>
//                 <div className="flex-1">
//                   <Textarea
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                     placeholder="What are your thoughts?" // Reddit style placeholder
//                     className="min-h-[60px] resize-none focus-visible:ring-0 focus-visible:ring-offset-0 border border-gray-300 dark:border-gray-600 rounded-md"
//                   />
//                   <div className="flex justify-end mt-2">
//                     <Button
//                       size="sm"
//                       onClick={handlePostComment}
//                       disabled={isSubmittingComment || !newComment.trim()}
//                     >
//                       {isSubmittingComment ? "Posting..." : "Comment"}
//                     </Button>
//                   </div>
//                 </div>
//               </div>

//               {/* Comments List */}
//               <div className="mt-4 space-y-4">
//                 {isLoadingComments ? (
//                   <p className="text-center text-gray-500 dark:text-gray-400">
//                     Loading comments...
//                   </p>
//                 ) : comments.length === 0 ? (
//                   <p className="text-center text-gray-500 dark:text-gray-400">
//                     No comments yet. Be the first to comment!
//                   </p>
//                 ) : (
//                   comments.map((comment, index) => (
//                     // Simulating indentation for top-level comments
//                     // For true nesting, you'd recursively render components
//                     <div
//                       key={comment.id}
//                       // Use padding-left and border-left for visual thread
//                       // This is a simplified version; for true nesting, you'd pass a 'depth' prop
//                       className={`flex space-x-2 relative group`}
//                       style={{ paddingLeft: `${0 * 20}px` }} // Depth 0 for top-level
//                     >
//                       {/* Vertical line for indentation - simplified for flat comments */}
//                       {index > 0 && ( // Only draw line if not the very first comment, or handle based on replies
//                         <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gray-200 dark:bg-gray-700 ml-[10px]" />
//                       )}

//                       <Avatar className="h-7 w-7 mt-1 shrink-0">
//                         <AvatarImage
//                           src={`https://avatar.vercel.sh/${comment.createdBy}?s=32`}
//                           alt={comment.createdBy}
//                         />
//                         <AvatarFallback>
//                           {comment.createdBy.charAt(0).toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
//                         <div className="flex items-center gap-2">
//                           <Link
//                             href={`/user/${comment.createdBy}`}
//                             className="text-sm font-semibold hover:underline"
//                           >
//                             u/{comment.createdBy}
//                           </Link>
//                           <span className="text-xs text-gray-500">
//                             {formatDistanceToNow(new Date(comment.createdAt), {
//                               addSuffix: true,
//                             })}
//                           </span>
//                         </div>
//                         <p className="text-sm mt-1 text-gray-800 dark:text-gray-200">
//                           {comment.content}
//                         </p>
//                         {/* Comment Action Bar (Reply, Upvote/Downvote for each comment) */}
//                         <div className="flex items-center mt-2 text-xs text-gray-600 dark:text-gray-400">
//                           <div className="flex items-center mr-3">
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="h-6 w-6 p-0 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
//                             >
//                               <ArrowBigUp className="h-4 w-4" />
//                             </Button>
//                             <span className="mx-0.5">{comment.voteScore}</span>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="h-6 w-6 p-0 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
//                             >
//                               <ArrowBigDown className="h-4 w-4" />
//                             </Button>
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="h-6 px-2 py-0 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
//                           >
//                             Reply
//                           </Button>
//                           {/* More comment actions like Share, Report etc. */}
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* AlertDialog remains unchanged as it's a functional dialog */}
//       <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This will permanently delete the post "{post.title}". This action
//               cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDelete}
//               disabled={isDeleting}
//               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//             >
//               {isDeleting ? "Deleting..." : "Delete Post"}
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
  ArrowBigDown,
  ArrowBigUp,
  DotIcon,
  ExternalLinkIcon,
  LinkIcon,
  MessageSquareIcon,
  Share2Icon,
  TrashIcon,
} from "lucide-react";
import { useEffect, useId, useState } from "react";
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
import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import { Textarea } from "@repo/ui/components/textarea";
import Link from "next/link";
import { deletePost } from "../actions/delete.action";
import type { Post } from "../schemas";
import { EditPostDialog } from "./edit-post-dialog";

// Define the Comment interface with nesting
interface Comment {
  id: string;
  postId: string | null; // Can be null for replies
  parentCommentId: string | null;
  createdBy: string | null;
  content: string;
  voteScore: number | null;
  createdAt: string | number | Date | null;
  replies?: Comment[]; // Nested comments
}

type Props = {
  post: Post & {
    comments?: Comment[]; // Use the new Comment interface
  };
};

// New CommentItem component for recursive rendering
function CommentItem({
  comment,
  postId,
  fetchComments,
}: {
  comment: Comment;
  postId: string;
  fetchComments: () => Promise<void>;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const handlePostReply = async () => {
    if (!replyContent.trim()) {
      toast.info("Reply cannot be empty.");
      return;
    }

    setIsSubmittingReply(true);
    try {
      const response = await fetch("/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: replyContent.trim(),
          postId: postId, // Parent post ID
          parentCommentId: comment.id, // This comment's ID is the parent
          voteScore: 0,
          // createdBy is likely handled by backend or auth for replies too
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Backend error response during reply post:", data);
        const errorMessage =
          typeof data === "object" && data !== null && "message" in data
            ? (data as { message?: string }).message
            : "Failed to post reply: Unknown backend error or malformed response.";
        throw new Error(errorMessage);
      }

      toast.success("Reply posted successfully!");
      setReplyContent("");
      setShowReplyForm(false);
      await fetchComments(); // Re-fetch all comments to update the tree
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to post reply"
      );
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <div
      className={`flex space-x-2 relative group pl-4`} // Added pl-4 for visual indentation
    >
      {/* Optional: Vertical line for indentation - more complex for true nesting */}
      {/* <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gray-200 dark:bg-gray-700 ml-[10px]" /> */}

      <Avatar className="h-7 w-7 mt-1 shrink-0">
        <AvatarImage
          src={`https://avatar.vercel.sh/${comment.createdBy || "anon"}?s=32`}
          alt={comment.createdBy || "Anonymous"}
        />
        <AvatarFallback>
          {comment.createdBy ? comment.createdBy.charAt(0).toUpperCase() : "A"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
        <div className="flex items-center gap-2">
          <Link
            href={`/user/${comment.createdBy}`}
            className="text-sm font-semibold hover:underline"
          >
            u/{comment.createdBy || "Anonymous"}
          </Link>
          <span className="text-xs text-gray-500">
            {comment.createdAt
              ? formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })
              : "unknown time"}
          </span>
        </div>
        <p className="text-sm mt-1 text-gray-800 dark:text-gray-200">
          {comment.content}
        </p>
        <div className="flex items-center mt-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center mr-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <ArrowBigUp className="h-4 w-4" />
            </Button>
            <span className="mx-0.5">{comment.voteScore || 0}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <ArrowBigDown className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 py-0 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            Reply
          </Button>
        </div>

        {showReplyForm && (
          <div className="mt-3 flex items-start space-x-2">
            <Avatar className="h-7 w-7 mt-1 shrink-0">
              <AvatarImage
                src={`https://avatar.vercel.sh/current_user?s=32`}
                alt="Current User"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Reply to u/${comment.createdBy || "Anonymous"}...`}
                className="min-h-[50px] resize-none focus-visible:ring-0 focus-visible:ring-offset-0 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <div className="flex justify-end mt-2 space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handlePostReply}
                  disabled={isSubmittingReply || !replyContent.trim()}
                >
                  {isSubmittingReply ? "Replying..." : "Reply"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                fetchComments={fetchComments}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function PostCard({ post }: Props) {
  const id = useId();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

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

  const fetchComments = async () => {
    setIsLoadingComments(true); // Always set to true when fetching starts
    try {
      const response = await fetch(`/api/comment?postId=${post.id}`);
      const result = await response.json(); // 'result' contains { data: [], meta: {} }

      if (!response.ok) {
        console.error("Backend error response during comment fetch:", result);
        const errorMessage =
          typeof result === "object" && result !== null && "message" in result
            ? (result as { message?: string }).message
            : "Failed to fetch comments: Unknown backend error or malformed response.";
        throw new Error(errorMessage);
      }
      // Assuming 'data' from the API response is the array of comments
      setComments(result.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error(
        `Failed to load comments: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) {
      toast.info("Comment cannot be empty.");
      return;
    }

    setIsSubmittingComment(true);
    try {
      const response = await fetch("/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add Authorization header here if your backend requires it
          // 'Authorization': `Bearer YOUR_AUTH_TOKEN_HERE`,
        },
        body: JSON.stringify({
          content: newComment.trim(),
          postId: post.id,
          parentCommentId: "", // Send empty string for top-level comments as per API
          voteScore: 0,
          // createdBy is not in your curl example, so omit it
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Backend error response during comment post:", data);
        const errorMessage =
          typeof data === "object" && data !== null && "message" in data
            ? (data as { message?: string }).message
            : "Failed to post comment: Unknown backend error or malformed response.";
        throw new Error(errorMessage);
      }

      await fetchComments(); // Re-fetch comments to update the list immediately
      setNewComment(""); // Clear the input field
      toast.success("Comment posted successfully!");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to post comment"
      );
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const getPostType = (url: string | null) => {
    if (!url) return "text";
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    const isVideo = /(youtube|vimeo|youtu\.be)/i.test(url);
    return isImage ? "image" : isVideo ? "video" : "link";
  };

  const postType = getPostType(post.url || null);

  useEffect(() => {
    fetchComments(); // Fetch comments on initial component mount
  }, [post.id]); // Dependency array: re-fetch if post.id changes

  return (
    <>
      <Card
        key={id}
        className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <CardHeader className="p-3 pb-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Link
                href={`/r/${post.subforumId || "all"}`}
                className="font-semibold text-blue-700 dark:text-blue-400 hover:underline"
              >
                r/{post.subforumId || "all"}
              </Link>
              <span className="mx-1">•</span>
              <span>Posted by u/{post.createdBy}</span>
              <span className="mx-1">•</span>
              <span>
                {post.createdAt
                  ? formatDistanceToNow(post.createdAt, { addSuffix: true })
                  : "unknown time"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full"
            >
              <DotIcon className="h-5 w-5" />
            </Button>
          </div>

          <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 leading-snug mb-2 px-1">
            {post.title}
            {post.status !== "published" && (
              <Badge
                variant="outline"
                className="ml-2 bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700 text-[10px] py-0 px-1.5 rounded-full"
              >
                {post.status}
              </Badge>
            )}
          </h3>
        </CardHeader>

        <CardContent className="p-3 pt-0">
          {post.content && (
            <p className="text-gray-800 dark:text-gray-200 text-base mb-3 px-1 leading-relaxed">
              {post.content}
            </p>
          )}

          {post.images && post.images.length > 0 ? (
            <div className="mt-2 -mx-3">
              {" "}
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full max-h-96 object-cover bg-gray-100 dark:bg-gray-900"
                />
              ))}
            </div>
          ) : post.url && postType === "link" ? (
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
          ) : null}

          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mt-4 px-1">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 p-0 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                aria-label="Upvote"
              >
                <ArrowBigUp className="h-5 w-5" />
              </Button>
              <span className="font-semibold text-gray-800 dark:text-gray-200 mx-1">
                {post.voteScore || 0}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 p-0 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                aria-label="Downvote"
              >
                <ArrowBigDown className="h-5 w-5" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-3 py-1.5"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquareIcon className="h-4 w-4 mr-1" />
              <span className="font-semibold">
                {isLoadingComments ? "..." : comments.length}
              </span>
              <span className="ml-1">Comments</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-3 py-1.5"
            >
              <Share2Icon className="h-4 w-4 mr-1" />
              <span className="font-semibold">Share</span>
            </Button>

            <div className="flex gap-1">
              <EditPostDialog post={post} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
                className="h-7 w-7 p-0 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full"
              >
                <TrashIcon className="h-4 w-4" />
                <span className="sr-only">Delete Post</span>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                asChild
                className="h-7 w-7 p-0 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full"
              >
                <Link href={`/post/${post.id}`}>
                  <ExternalLinkIcon className="h-4 w-4" />
                  <span className="sr-only">View Post</span>
                </Link>
              </Button>
            </div>
          </div>

          {showComments && (
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 px-1">
              <div className="flex items-start space-x-2 mb-4">
                <Avatar className="h-8 w-8 mt-1 shrink-0">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/current_user?s=32`}
                    alt="Current User"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="What are your thoughts?"
                    className="min-h-[60px] resize-none focus-visible:ring-0 focus-visible:ring-offset-0 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      size="sm"
                      onClick={handlePostComment}
                      disabled={isSubmittingComment || !newComment.trim()}
                    >
                      {isSubmittingComment ? "Posting..." : "Comment"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                {isLoadingComments ? (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Loading comments...
                  </p>
                ) : comments.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      postId={post.id}
                      fetchComments={fetchComments}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
