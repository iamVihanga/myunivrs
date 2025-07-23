// "use client";

// import { formatDistanceToNow } from "date-fns";
// import {
//   ArrowBigDown,
//   ArrowBigUp,
//   CheckCircleIcon,
//   DotIcon,
//   ExternalLinkIcon,
//   LinkIcon,
//   MessageSquareIcon,
//   Share2Icon,
//   TrashIcon,
// } from "lucide-react";
// import { useCallback, useEffect, useId, useState } from "react";
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
// import type { Post } from "../schemas"; // Assuming your Post schema is defined here
// import { EditPostDialog } from "./edit-post-dialog";

// // Define the Comment interface with nesting
// interface Comment {
//   id: string;
//   postId: string | null;
//   parentCommentId: string | null;
//   createdBy: string | null;
//   content: string;
//   voteScore: number | null;
//   createdAt: string | number | Date | null;
//   replies?: Comment[];
// }

// // Updated interfaces for Poll functionality to match backend schema
// interface PollOption {
//   id: string;
//   optionText: string; // Matches backend
//   voteCount: number; // Matches backend
// }

// interface Poll {
//   id: string;
//   question: string;
//   options: PollOption[];
//   postId: string;
//   createdBy: string;
//   createdAt: string | number | Date | null;
//   expiresAt: string | number | Date | null;
//   totalVotes: number; // This will be calculated on the frontend, or derived from backend
// }

// // Extend your Post type to potentially include a pollId
// // IMPORTANT: You need to ensure your actual `Post` type (from schemas.ts or wherever)
// // includes a `pollId: string | null;` field if a post can be a poll.
// type PostWithOptionalPollId = Post & {
//   pollId?: string | null; // Added this line
//   comments?: Comment[];
//   // If your backend *does* embed poll data directly into the post on list/get
//   // then you would keep poll?: Omit<Poll, 'totalVotes'>; here.
//   // Based on your backend URLs, fetching poll by pollId is more standard.
// };

// type Props = {
//   post: PostWithOptionalPollId;
// };

// // CommentItem remains unchanged
// function CommentItem({
//   comment,
//   postId,
//   fetchComments,
// }: {
//   comment: Comment;
//   postId: string;
//   fetchComments: () => Promise<void>;
// }) {
//   const [showReplyForm, setShowReplyForm] = useState(false);
//   const [replyContent, setReplyContent] = useState("");
//   const [isSubmittingReply, setIsSubmittingReply] = useState(false);

//   const handlePostReply = async () => {
//     if (!replyContent.trim()) {
//       toast.info("Reply cannot be empty.");
//       return;
//     }

//     setIsSubmittingReply(true);
//     try {
//       const response = await fetch("/api/comment", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           content: replyContent.trim(),
//           postId: postId,
//           parentCommentId: comment.id,
//           voteScore: 0,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         console.error("Backend error response during reply post:", data);
//         const errorMessage =
//           typeof data === "object" && data !== null && "message" in data
//             ? (data as { message?: string }).message
//             : "Failed to post reply: Unknown backend error or malformed response.";
//         throw new Error(errorMessage);
//       }

//       toast.success("Reply posted successfully!");
//       setReplyContent("");
//       setShowReplyForm(false);
//       await fetchComments();
//     } catch (error) {
//       console.error("Error posting reply:", error);
//       toast.error(
//         error instanceof Error ? error.message : "Failed to post reply"
//       );
//     } finally {
//       setIsSubmittingReply(false);
//     }
//   };

//   return (
//     <div className={`flex space-x-2 relative group pl-4`}>
//       <Avatar className="h-7 w-7 mt-1 shrink-0">
//         <AvatarImage
//           src={`https://avatar.vercel.sh/${comment.createdBy || "anon"}?s=32`}
//           alt={comment.createdBy || "Anonymous"}
//         />
//         <AvatarFallback>
//           {comment.createdBy ? comment.createdBy.charAt(0).toUpperCase() : "A"}
//         </AvatarFallback>
//       </Avatar>
//       <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
//         <div className="flex items-center gap-2">
//           <Link
//             href={`/user/${comment.createdBy}`}
//             className="text-sm font-semibold hover:underline"
//           >
//             u/{comment.createdBy || "Anonymous"}
//           </Link>
//           <span className="text-xs text-gray-500">
//             {comment.createdAt
//               ? formatDistanceToNow(new Date(comment.createdAt), {
//                   addSuffix: true,
//                 })
//               : "unknown time"}
//           </span>
//         </div>
//         <p className="text-sm mt-1 text-gray-800 dark:text-gray-200">
//           {comment.content}
//         </p>
//         <div className="flex items-center mt-2 text-xs text-gray-600 dark:text-gray-400">
//           <div className="flex items-center mr-3">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-6 w-6 p-0 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
//             >
//               <ArrowBigUp className="h-4 w-4" />
//             </Button>
//             <span className="mx-0.5">{comment.voteScore || 0}</span>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-6 w-6 p-0 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
//             >
//               <ArrowBigDown className="h-4 w-4" />
//             </Button>
//           </div>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="h-6 px-2 py-0 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
//             onClick={() => setShowReplyForm(!showReplyForm)}
//           >
//             Reply
//           </Button>
//         </div>

//         {showReplyForm && (
//           <div className="mt-3 flex items-start space-x-2">
//             <Avatar className="h-7 w-7 mt-1 shrink-0">
//               <AvatarImage
//                 src={`https://avatar.vercel.sh/current_user?s=32`}
//                 alt="Current User"
//               />
//               <AvatarFallback>U</AvatarFallback>
//             </Avatar>
//             <div className="flex-1">
//               <Textarea
//                 value={replyContent}
//                 onChange={(e) => setReplyContent(e.target.value)}
//                 placeholder={`Reply to u/${comment.createdBy || "Anonymous"}...`}
//                 className="min-h-[50px] resize-none focus-visible:ring-0 focus-visible:ring-offset-0 border border-gray-300 dark:border-gray-600 rounded-md"
//               />
//               <div className="flex justify-end mt-2 space-x-2">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setShowReplyForm(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   size="sm"
//                   onClick={handlePostReply}
//                   disabled={isSubmittingReply || !replyContent.trim()}
//                 >
//                   {isSubmittingReply ? "Replying..." : "Reply"}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {comment.replies && comment.replies.length > 0 && (
//           <div className="mt-3 space-y-3 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
//             {comment.replies.map((reply) => (
//               <CommentItem
//                 key={reply.id}
//                 comment={reply}
//                 postId={postId}
//                 fetchComments={fetchComments}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export function PostCard({ post }: Props) {
//   const id = useId();
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [showComments, setShowComments] = useState(false);
//   const [newComment, setNewComment] = useState("");
//   const [isSubmittingComment, setIsSubmittingComment] = useState(false);
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [isLoadingComments, setIsLoadingComments] = useState(true);

//   // State to hold poll data fetched from the API
//   const [pollData, setPollData] = useState<Poll | null>(null);
//   const [isLoadingPoll, setIsLoadingPoll] = useState(false);
//   const [pollError, setPollError] = useState<string | null>(null);

//   const [userVotedOptionId, setUserVotedOptionId] = useState<string | null>(
//     null
//   );
//   const [isVoting, setIsVoting] = useState(false);

//   // Function to fetch poll details if pollId is present
//   const fetchPollDetails = useCallback(async (pollId: string) => {
//     setIsLoadingPoll(true);
//     setPollError(null);
//     try {
//       const response = await fetch(`http://localhost:8000/api/poll/${pollId}`);
//       const result = await response.json();

//       if (!response.ok) {
//         console.error("Backend error response during poll fetch:", result);
//         const errorMessage =
//           typeof result === "object" && result !== null && "message" in result
//             ? (result as { message?: string }).message
//             : "Failed to fetch poll: Unknown backend error or malformed response.";
//         throw new Error(errorMessage);
//       }

//       // Calculate totalVotes as it's not directly in your backend's poll response
//       const totalVotes = result.options.reduce(
//         (sum: number, option: PollOption) => sum + option.voteCount,
//         0
//       );
//       setPollData({ ...result, totalVotes });
//     } catch (error) {
//       console.error("Error fetching poll details:", error);
//       setPollError(
//         error instanceof Error ? error.message : "Failed to load poll."
//       );
//     } finally {
//       setIsLoadingPoll(false);
//     }
//   }, []);

//   // Function to check if the current user has voted
//   // This would ideally interact with your backend to check a user's vote
//   const checkUserVote = useCallback(async (pollId: string) => {
//     // For demonstration, we'll use a local storage check first
//     // In a real app, this would be an authenticated API call
//     const storedVote = localStorage.getItem(`userVote-${pollId}`);
//     if (storedVote) {
//       setUserVotedOptionId(storedVote);
//       return;
//     }

//     // Example of how you'd fetch user vote from backend (requires a new endpoint)
//     /*
//     try {
//       const response = await fetch(`http://localhost:8000/api/poll-vote/user-vote?pollId=${pollId}`, {
//         // headers: { 'Authorization': `Bearer YOUR_AUTH_TOKEN_HERE` }
//       });
//       if (response.ok) {
//         const voteData = await response.json();
//         if (voteData && voteData.optionId) {
//           setUserVotedOptionId(voteData.optionId);
//           localStorage.setItem(`userVote-${pollId}`, voteData.optionId);
//         }
//       } else {
//         console.warn("Could not fetch user vote status:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error checking user vote:", error);
//     }
//     */
//   }, []);

//   // Effect to fetch poll data when component mounts or post.pollId changes
//   useEffect(() => {
//     if (post.pollId) {
//       fetchPollDetails(post.pollId);
//       checkUserVote(post.pollId); // Check user vote for this poll
//     } else {
//       setPollData(null); // Clear poll data if post is not a poll
//       setUserVotedOptionId(null);
//     }
//   }, [post.pollId, fetchPollDetails, checkUserVote]);

//   const handleVote = async (optionId: string) => {
//     if (userVotedOptionId) {
//       toast.info("You have already voted on this poll.");
//       return;
//     }
//     if (isVoting) return;

//     setIsVoting(true);
//     try {
//       if (!pollData) {
//         throw new Error("Poll data not available to cast vote.");
//       }

//       // API call to record the vote
//       const response = await fetch("http://localhost:8000/api/poll-vote", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           // Add Authorization header here if your backend requires it
//           // 'Authorization': `Bearer YOUR_AUTH_TOKEN_HERE`,
//         },
//         body: JSON.stringify({
//           pollId: pollData.id,
//           optionId: optionId,
//           // userId: "current_user_id" // Your backend might infer this from auth token
//         }),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         console.error("Backend error response during vote post:", result);
//         const errorMessage =
//           typeof result === "object" && result !== null && "message" in result
//             ? (result as { message?: string }).message
//             : "Failed to cast vote: Unknown backend error or malformed response.";
//         throw new Error(errorMessage);
//       }

//       // Update poll data in state with the new vote
//       setPollData((prevPoll) => {
//         if (!prevPoll) return prevPoll;
//         const updatedOptions = prevPoll.options.map((option) =>
//           option.id === optionId
//             ? { ...option, voteCount: option.voteCount + 1 }
//             : option
//         );
//         return {
//           ...prevPoll,
//           options: updatedOptions,
//           totalVotes: prevPoll.totalVotes + 1,
//         };
//       });
//       setUserVotedOptionId(optionId);
//       localStorage.setItem(`userVote-${pollData.id}`, optionId); // Simulate persistence
//       toast.success("Vote cast successfully!");
//     } catch (error) {
//       console.error("Error casting vote:", error);
//       toast.error(
//         error instanceof Error ? error.message : "Failed to cast vote."
//       );
//     } finally {
//       setIsVoting(false);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       setIsDeleting(true);
//       await deletePost(post.id);
//       toast.success("Post deleted successfully");
//       window.location.reload();
//     } catch (error) {
//       console.error("Failed to delete post:", error);
//       toast.error("Failed to delete post");
//     } finally {
//       setIsDeleting(false);
//       setShowDeleteDialog(false);
//     }
//   };

//   const fetchComments = async () => {
//     setIsLoadingComments(true);
//     try {
//       const response = await fetch(`/api/comment?postId=${post.id}`);
//       const result = await response.json();

//       if (!response.ok) {
//         console.error("Backend error response during comment fetch:", result);
//         const errorMessage =
//           typeof result === "object" && result !== null && "message" in result
//             ? (result as { message?: string }).message
//             : "Failed to fetch comments: Unknown backend error or malformed response.";
//         throw new Error(errorMessage);
//       }
//       setComments(result.data || []);
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
//         },
//         body: JSON.stringify({
//           content: newComment.trim(),
//           postId: post.id,
//           parentCommentId: "",
//           voteScore: 0,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         console.error("Backend error response during comment post:", data);
//         const errorMessage =
//           typeof data === "object" && data !== null && "message" in data
//             ? (data as { message?: string }).message
//             : "Failed to post comment: Unknown backend error or malformed response.";
//         throw new Error(errorMessage);
//       }

//       await fetchComments();
//       setNewComment("");
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
//     fetchComments();
//   }, [post.id]);

//   return (
//     <>
//       <Card
//         key={id}
//         className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
//       >
//         <CardHeader className="p-3 pb-0">
//           <div className="flex items-center justify-between mb-1">
//             <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
//               <Link
//                 href={`/r/${post.subforumId || "all"}`}
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
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-7 w-7 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full"
//             >
//               <DotIcon className="h-5 w-5" />
//             </Button>
//           </div>

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
//           {post.content && (
//             <p className="text-gray-800 dark:text-gray-200 text-base mb-3 px-1 leading-relaxed">
//               {post.content}
//             </p>
//           )}

//           {/* Render media if it's not a poll-type post, or if you explicitly allow both */}
//           {!post.pollId && post.images && post.images.length > 0 ? (
//             <div className="mt-2 -mx-3">
//               {" "}
//               {post.images.map((image, index) => (
//                 <img
//                   key={index}
//                   src={image}
//                   alt={`Post image ${index + 1}`}
//                   className="w-full max-h-96 object-cover bg-gray-100 dark:bg-gray-900"
//                 />
//               ))}
//             </div>
//           ) : !post.pollId && post.url && postType === "link" ? (
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

//           {/* Poll Display Section */}
//           {isLoadingPoll && (
//             <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 text-center text-gray-500 dark:text-gray-400">
//               Loading poll...
//             </div>
//           )}
//           {pollError && (
//             <div className="mt-4 p-4 border rounded-lg bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 text-center">
//               Error loading poll: {pollError}
//             </div>
//           )}
//           {pollData && (
//             <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
//               <h4 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
//                 {pollData.question}
//               </h4>
//               <div className="space-y-2">
//                 {pollData.options.map((option) => (
//                   <button
//                     key={option.id}
//                     onClick={() => handleVote(option.id)}
//                     disabled={!!userVotedOptionId || isVoting}
//                     className={`w-full text-left p-3 rounded-md transition-colors duration-200 relative
//                       ${
//                         userVotedOptionId
//                           ? "cursor-not-allowed bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
//                           : "hover:bg-blue-50 dark:hover:bg-blue-900 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
//                       }
//                       ${
//                         userVotedOptionId === option.id
//                           ? "border-2 border-blue-500 dark:border-blue-400"
//                           : ""
//                       }
//                     `}
//                   >
//                     {/* Progress bar background */}
//                     {userVotedOptionId && pollData.totalVotes > 0 && (
//                       <div
//                         className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 rounded-md"
//                         style={{
//                           width: `${
//                             (option.voteCount / pollData.totalVotes) * 100
//                           }%`,
//                         }}
//                       ></div>
//                     )}

//                     <div className="flex justify-between items-center relative z-10">
//                       <span className="font-medium">
//                         {option.optionText}
//                         {userVotedOptionId === option.id && (
//                           <CheckCircleIcon className="ml-2 inline-block h-4 w-4 text-blue-500 dark:text-blue-400" />
//                         )}
//                       </span>
//                       {userVotedOptionId && (
//                         <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
//                           {pollData.totalVotes > 0
//                             ? `${(
//                                 (option.voteCount / pollData.totalVotes) *
//                                 100
//                               ).toFixed(1)}% (${option.voteCount})`
//                             : `0.0% (${option.voteCount})`}{" "}
//                         </span>
//                       )}
//                     </div>
//                   </button>
//                 ))}
//               </div>
//               <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-right">
//                 {pollData.totalVotes} vote{pollData.totalVotes !== 1 ? "s" : ""}
//                 {pollData.expiresAt &&
//                   new Date(pollData.expiresAt) > new Date() && (
//                     <>
//                       <span className="mx-1">•</span>
//                       <span>
//                         Poll ends{" "}
//                         {formatDistanceToNow(new Date(pollData.expiresAt), {
//                           addSuffix: true,
//                         })}
//                       </span>
//                     </>
//                   )}
//                 {pollData.expiresAt &&
//                   new Date(pollData.expiresAt) <= new Date() && (
//                     <>
//                       <span className="mx-1">•</span>
//                       <span>Poll ended</span>
//                     </>
//                   )}
//               </p>
//             </div>
//           )}
//           {/* End Poll Display Section */}

//           <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mt-4 px-1">
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

//             <Button
//               variant="ghost"
//               size="sm"
//               className="flex items-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-3 py-1.5"
//               onClick={() => setShowComments(!showComments)}
//             >
//               <MessageSquareIcon className="h-4 w-4 mr-1" />
//               <span className="font-semibold">
//                 {isLoadingComments ? "..." : comments.length}
//               </span>
//               <span className="ml-1">Comments</span>
//             </Button>

//             <Button
//               variant="ghost"
//               size="sm"
//               className="flex items-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-3 py-1.5"
//             >
//               <Share2Icon className="h-4 w-4 mr-1" />
//               <span className="font-semibold">Share</span>
//             </Button>

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

//           {showComments && (
//             <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 px-1">
//               <div className="flex items-start space-x-2 mb-4">
//                 <Avatar className="h-8 w-8 mt-1 shrink-0">
//                   <AvatarImage
//                     src={`https://avatar.vercel.sh/current_user?s=32`}
//                     alt="Current User"
//                   />
//                   <AvatarFallback>U</AvatarFallback>
//                 </Avatar>
//                 <div className="flex-1">
//                   <Textarea
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                     placeholder="What are your thoughts?"
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
//                   comments.map((comment) => (
//                     <CommentItem
//                       key={comment.id}
//                       comment={comment}
//                       postId={post.id}
//                       fetchComments={fetchComments}
//                     />
//                   ))
//                 )}
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

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

import { useSession } from "@/lib/auth-client";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowBigDown,
  ArrowBigUp,
  CheckCircleIcon,
  DotIcon,
  ExternalLinkIcon,
  LinkIcon,
  MessageSquareIcon,
  Share2Icon,
  TrashIcon,
} from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
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
  postId: string | null;
  parentCommentId: string | null;
  createdBy: string | null;
  content: string;
  voteScore: number | null;
  createdAt: string | number | Date | null;
  replies?: Comment[];
}

// Vote interfaces
interface VoteData {
  id: string;
  postId: string | null;
  commentId: string | null;
  userId: string | null;
  value: number; // 1 for upvote, -1 for downvote
  createdAt: string | null;
}

interface VoteCount {
  postId?: string;
  commentId?: string;
  upvotes: number;
  downvotes: number;
  score: number;
  userVote?: number | null; // 1, -1, or null
}

// Subforum interface
interface Subforum {
  id: string;
  name: string;
  description?: string;
  createdBy?: string;
  createdAt?: string | number | Date | null;
}

// Updated interfaces for Poll functionality
interface PollOption {
  id: string;
  optionText: string;
  voteCount: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  postId: string;
  createdBy: string;
  createdAt: string | number | Date | null;
  expiresAt: string | number | Date | null;
  totalVotes: number;
}

type PostWithOptionalPollId = Post & {
  pollId?: string | null;
  comments?: Comment[];
};

type Props = {
  post: PostWithOptionalPollId;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  return {
    "Content-Type": "application/json",
    // Add your authentication headers here if needed
    // "Authorization": `Bearer ${token}`,
  };
};

// Vote API functions using your backend endpoints
const voteAPI = {
  // Get all votes for a post or comment
  getVotes: async (
    postId?: string,
    commentId?: string
  ): Promise<VoteData[]> => {
    const params = new URLSearchParams();
    if (postId) params.append("postId", postId);
    if (commentId) params.append("commentId", commentId);

    const response = await fetch(`http://localhost:8000/api/vote?${params}`, {
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to get votes");
    }

    const result = await response.json();
    return result.data || [];
  },

  // Create a new vote
  createVote: async (data: {
    postId?: string;
    commentId?: string;
    value: number; // 1 for upvote, -1 for downvote
  }) => {
    const response = await fetch("http://localhost:8000/api/vote", {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create vote");
    }

    return response.json();
  },

  // Update an existing vote
  updateVote: async (voteId: string, value: number) => {
    const response = await fetch(`http://localhost:8000/api/vote/${voteId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({ value }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update vote");
    }

    return response.json();
  },

  // Delete a vote
  deleteVote: async (voteId: string) => {
    const response = await fetch(`http://localhost:8000/api/vote/${voteId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete vote");
    }

    return response.ok;
  },

  // Calculate vote counts and user's vote from votes array
  calculateVoteData: (votes: VoteData[], currentUserId?: string) => {
    let upvotes = 0;
    let downvotes = 0;
    let userVote = null;
    let userVoteId = null;

    votes.forEach((vote) => {
      if (vote.value === 1) {
        upvotes++;
      } else if (vote.value === -1) {
        downvotes++;
      }

      // Check if current user has voted
      if (currentUserId && vote.userId === currentUserId) {
        userVote = vote.value;
        userVoteId = vote.id;
      }
    });

    return {
      upvotes,
      downvotes,
      score: upvotes - downvotes,
      userVote,
      userVoteId,
    };
  },
};

// Subforum API functions
const subforumAPI = {
  // Get subforum by ID
  getSubforum: async (subforumId: string): Promise<Subforum | null> => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/subforum/${subforumId}`,
        {
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Subforum not found
        }
        throw new Error("Failed to get subforum");
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching subforum:", error);
      return null;
    }
  },
};

// Comment Item Component with voting functionality
function CommentItem({
  comment,
  postId,
  fetchComments,
  currentUserId,
}: {
  comment: Comment;
  postId: string;
  fetchComments: () => Promise<void>;
  currentUserId: string | null;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Vote state for comments
  const [commentVoteData, setCommentVoteData] = useState<VoteCount>({
    upvotes: 0,
    downvotes: 0,
    score: comment.voteScore || 0,
    userVote: null,
  });
  const [isVotingComment, setIsVotingComment] = useState(false);

  // Fetch comment vote data
  const fetchCommentVoteData = useCallback(async () => {
    if (!comment.id) return;

    try {
      const votes = await voteAPI.getVotes(undefined, comment.id);
      const voteData = voteAPI.calculateVoteData(
        votes,
        currentUserId || undefined
      );
      setCommentVoteData(voteData);
    } catch (error) {
      console.error("Error fetching comment vote data:", error);
    }
  }, [comment.id, currentUserId]);

  // Handle comment vote
  const handleCommentVote = async (voteValue: number) => {
    if (!currentUserId) {
      toast.error("Please log in to vote on comments");
      return;
    }

    if (isVotingComment) return;

    setIsVotingComment(true);
    try {
      // Get current votes to find user's existing vote
      const votes = await voteAPI.getVotes(undefined, comment.id);
      const voteData = voteAPI.calculateVoteData(votes, currentUserId);
      const currentUserVote = voteData.userVote;
      const userVoteId = voteData.userVoteId;

      if (currentUserVote === voteValue) {
        // Remove vote if clicking the same vote type
        if (userVoteId) {
          await voteAPI.deleteVote(userVoteId);

          setCommentVoteData((prev) => ({
            ...prev,
            [voteValue === 1 ? "upvotes" : "downvotes"]: Math.max(
              0,
              prev[voteValue === 1 ? "upvotes" : "downvotes"] - 1
            ),
            score: prev.score - voteValue,
            userVote: null,
          }));

          toast.success(`${voteValue === 1 ? "Upvote" : "Downvote"} removed!`);
        }
      } else if (userVoteId && currentUserVote !== null) {
        // Update existing vote (switch from upvote to downvote or vice versa)
        await voteAPI.updateVote(userVoteId, voteValue);

        setCommentVoteData((prev) => {
          const newData = { ...prev };

          // Remove previous vote effect
          if (currentUserVote === 1) {
            newData.upvotes = Math.max(0, newData.upvotes - 1);
          } else {
            newData.downvotes = Math.max(0, newData.downvotes - 1);
          }

          // Add new vote effect
          if (voteValue === 1) {
            newData.upvotes += 1;
          } else {
            newData.downvotes += 1;
          }

          newData.score = newData.upvotes - newData.downvotes;
          newData.userVote = voteValue;
          return newData;
        });

        toast.success(
          `Vote switched to ${voteValue === 1 ? "upvote" : "downvote"}!`
        );
      } else {
        // Create new vote
        await voteAPI.createVote({
          commentId: comment.id,
          value: voteValue,
        });

        setCommentVoteData((prev) => ({
          ...prev,
          [voteValue === 1 ? "upvotes" : "downvotes"]:
            prev[voteValue === 1 ? "upvotes" : "downvotes"] + 1,
          score: prev.score + voteValue,
          userVote: voteValue,
        }));

        toast.success(`Comment ${voteValue === 1 ? "upvoted" : "downvoted"}!`);
      }
    } catch (error) {
      console.error("Error voting on comment:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to vote on comment"
      );
    } finally {
      setIsVotingComment(false);
    }
  };

  const handlePostReply = async () => {
    if (!replyContent.trim()) {
      toast.info("Reply cannot be empty.");
      return;
    }

    setIsSubmittingReply(true);
    try {
      const response = await fetch("/api/comment", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          content: replyContent.trim(),
          postId: postId,
          parentCommentId: comment.id,
          voteScore: 0,
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
      await fetchComments();
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to post reply"
      );
    } finally {
      setIsSubmittingReply(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchCommentVoteData();
    } else {
      // Reset to comment's vote score when not logged in
      setCommentVoteData({
        upvotes: Math.max(0, comment.voteScore || 0),
        downvotes: Math.max(0, -(comment.voteScore || 0)),
        score: comment.voteScore || 0,
        userVote: null,
      });
    }
  }, [fetchCommentVoteData, currentUserId, comment.voteScore]);

  return (
    <div className="flex space-x-2 relative group pl-4">
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
              onClick={() => handleCommentVote(1)}
              disabled={isVotingComment || !currentUserId}
              className={`h-6 w-6 p-0 rounded-full transition-colors ${
                commentVoteData.userVote === 1
                  ? "text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900"
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <ArrowBigUp className="h-4 w-4" />
            </Button>
            <span
              className={`mx-0.5 font-medium ${
                commentVoteData.score > 0
                  ? "text-orange-500"
                  : commentVoteData.score < 0
                    ? "text-blue-500"
                    : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {commentVoteData.score}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCommentVote(-1)}
              disabled={isVotingComment || !currentUserId}
              className={`h-6 w-6 p-0 rounded-full transition-colors ${
                commentVoteData.userVote === -1
                  ? "text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
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
                currentUserId={currentUserId}
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
  const { data: session } = useSession();
  const currentUserId = session?.user?.id || null;

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  // Post vote state
  const [postVoteData, setPostVoteData] = useState<VoteCount>({
    upvotes: 0,
    downvotes: 0,
    score: post.voteScore || 0,
    userVote: null,
  });
  const [isVotingPost, setIsVotingPost] = useState(false);

  // Subforum state
  const [subforumName, setSubforumName] = useState<string>("");
  const [isLoadingSubforum, setIsLoadingSubforum] = useState(false);

  // Poll state
  const [pollData, setPollData] = useState<Poll | null>(null);
  const [isLoadingPoll, setIsLoadingPoll] = useState(false);
  const [pollError, setPollError] = useState<string | null>(null);
  const [userVotedOptionId, setUserVotedOptionId] = useState<string | null>(
    null
  );
  const [isVoting, setIsVoting] = useState(false);

  // Fetch subforum data
  const fetchSubforumData = useCallback(async () => {
    if (!post.subforumId) {
      setSubforumName("all");
      return;
    }

    setIsLoadingSubforum(true);
    try {
      const subforum = await subforumAPI.getSubforum(post.subforumId);
      if (subforum) {
        setSubforumName(subforum.name);
      } else {
        // Fallback to ID if subforum not found or API error
        setSubforumName(post.subforumId);
      }
    } catch (error) {
      console.error("Error fetching subforum:", error);
      // Fallback to ID if error
      setSubforumName(post.subforumId);
    } finally {
      setIsLoadingSubforum(false);
    }
  }, [post.subforumId]);

  // Fetch post vote data
  const fetchPostVoteData = useCallback(async () => {
    if (!post.id) return;

    try {
      const votes = await voteAPI.getVotes(post.id);
      const voteData = voteAPI.calculateVoteData(
        votes,
        currentUserId || undefined
      );
      setPostVoteData(voteData);
    } catch (error) {
      console.error("Error fetching post vote data:", error);
    }
  }, [post.id, currentUserId]);

  // Handle post vote
  const handlePostVote = async (voteValue: number) => {
    if (!currentUserId) {
      toast.error("Please log in to vote on posts");
      return;
    }

    if (isVotingPost) return;

    setIsVotingPost(true);
    try {
      // Get current votes to find user's existing vote
      const votes = await voteAPI.getVotes(post.id);
      const voteData = voteAPI.calculateVoteData(votes, currentUserId);
      const currentUserVote = voteData.userVote;
      const userVoteId = voteData.userVoteId;

      if (currentUserVote === voteValue) {
        // Remove vote if clicking the same vote type
        if (userVoteId) {
          await voteAPI.deleteVote(userVoteId);

          setPostVoteData((prev) => ({
            ...prev,
            [voteValue === 1 ? "upvotes" : "downvotes"]: Math.max(
              0,
              prev[voteValue === 1 ? "upvotes" : "downvotes"] - 1
            ),
            score: prev.score - voteValue,
            userVote: null,
          }));

          toast.success(`${voteValue === 1 ? "Upvote" : "Downvote"} removed!`);
        }
      } else if (userVoteId && currentUserVote !== null) {
        // Update existing vote (switch from upvote to downvote or vice versa)
        await voteAPI.updateVote(userVoteId, voteValue);

        setPostVoteData((prev) => {
          const newData = { ...prev };

          // Remove previous vote effect
          if (currentUserVote === 1) {
            newData.upvotes = Math.max(0, newData.upvotes - 1);
          } else {
            newData.downvotes = Math.max(0, newData.downvotes - 1);
          }

          // Add new vote effect
          if (voteValue === 1) {
            newData.upvotes += 1;
          } else {
            newData.downvotes += 1;
          }

          newData.score = newData.upvotes - newData.downvotes;
          newData.userVote = voteValue;
          return newData;
        });

        toast.success(
          `Vote switched to ${voteValue === 1 ? "upvote" : "downvote"}!`
        );
      } else {
        // Create new vote
        await voteAPI.createVote({
          postId: post.id,
          value: voteValue,
        });

        setPostVoteData((prev) => ({
          ...prev,
          [voteValue === 1 ? "upvotes" : "downvotes"]:
            prev[voteValue === 1 ? "upvotes" : "downvotes"] + 1,
          score: prev.score + voteValue,
          userVote: voteValue,
        }));

        toast.success(`Post ${voteValue === 1 ? "upvoted" : "downvoted"}!`);
      }
    } catch (error) {
      console.error("Error voting on post:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to vote on post"
      );
    } finally {
      setIsVotingPost(false);
    }
  };

  // Poll functions (unchanged from your original code)
  const fetchPollDetails = useCallback(async (pollId: string) => {
    setIsLoadingPoll(true);
    setPollError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/poll/${pollId}`);
      const result = await response.json();

      if (!response.ok) {
        console.error("Backend error response during poll fetch:", result);
        const errorMessage =
          typeof result === "object" && result !== null && "message" in result
            ? (result as { message?: string }).message
            : "Failed to fetch poll: Unknown backend error or malformed response.";
        throw new Error(errorMessage);
      }

      const totalVotes = result.options.reduce(
        (sum: number, option: PollOption) => sum + option.voteCount,
        0
      );
      setPollData({ ...result, totalVotes });
    } catch (error) {
      console.error("Error fetching poll details:", error);
      setPollError(
        error instanceof Error ? error.message : "Failed to load poll."
      );
    } finally {
      setIsLoadingPoll(false);
    }
  }, []);

  const checkUserVote = useCallback(async (pollId: string) => {
    const storedVote = localStorage.getItem(`userVote-${pollId}`);
    if (storedVote) {
      setUserVotedOptionId(storedVote);
      return;
    }
  }, []);

  const handleVote = async (optionId: string) => {
    if (userVotedOptionId) {
      toast.info("You have already voted on this poll.");
      return;
    }
    if (isVoting) return;

    setIsVoting(true);
    try {
      if (!pollData) {
        throw new Error("Poll data not available to cast vote.");
      }

      const response = await fetch("http://localhost:8000/api/poll-vote", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          pollId: pollData.id,
          optionId: optionId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Backend error response during vote post:", result);
        const errorMessage =
          typeof result === "object" && result !== null && "message" in result
            ? (result as { message?: string }).message
            : "Failed to cast vote: Unknown backend error or malformed response.";
        throw new Error(errorMessage);
      }

      setPollData((prevPoll) => {
        if (!prevPoll) return prevPoll;
        const updatedOptions = prevPoll.options.map((option) =>
          option.id === optionId
            ? { ...option, voteCount: option.voteCount + 1 }
            : option
        );
        return {
          ...prevPoll,
          options: updatedOptions,
          totalVotes: prevPoll.totalVotes + 1,
        };
      });
      setUserVotedOptionId(optionId);
      localStorage.setItem(`userVote-${pollData.id}`, optionId);
      toast.success("Vote cast successfully!");
    } catch (error) {
      console.error("Error casting vote:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to cast vote."
      );
    } finally {
      setIsVoting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deletePost(post.id);
      toast.success("Post deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const response = await fetch(`/api/comment?postId=${post.id}`);
      const result = await response.json();

      if (!response.ok) {
        console.error("Backend error response during comment fetch:", result);
        const errorMessage =
          typeof result === "object" && result !== null && "message" in result
            ? (result as { message?: string }).message
            : "Failed to fetch comments: Unknown backend error or malformed response.";
        throw new Error(errorMessage);
      }
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
        headers: getAuthHeaders(),
        body: JSON.stringify({
          content: newComment.trim(),
          postId: post.id,
          parentCommentId: "",
          voteScore: 0,
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

      await fetchComments();
      setNewComment("");
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

  // Effects
  useEffect(() => {
    fetchComments();
    fetchSubforumData();
    if (currentUserId) {
      fetchPostVoteData();
    } else {
      // Reset to post's vote score when not logged in
      setPostVoteData({
        upvotes: Math.max(0, post.voteScore || 0),
        downvotes: Math.max(0, -(post.voteScore || 0)),
        score: post.voteScore || 0,
        userVote: null,
      });
    }
  }, [
    post.id,
    fetchPostVoteData,
    fetchSubforumData,
    currentUserId,
    post.voteScore,
  ]);

  useEffect(() => {
    if (post.pollId) {
      fetchPollDetails(post.pollId);
      checkUserVote(post.pollId);
    } else {
      setPollData(null);
      setUserVotedOptionId(null);
    }
  }, [post.pollId, fetchPollDetails, checkUserVote]);

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
                r/
                {isLoadingSubforum
                  ? "..."
                  : subforumName || post.subforumId || "all"}
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

          {/* Media content */}
          {!post.pollId && post.images && post.images.length > 0 ? (
            <div className="mt-2 -mx-3">
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full max-h-96 object-cover bg-gray-100 dark:bg-gray-900"
                />
              ))}
            </div>
          ) : !post.pollId && post.url && postType === "link" ? (
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

          {/* Poll Display Section */}
          {isLoadingPoll && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 text-center text-gray-500 dark:text-gray-400">
              Loading poll...
            </div>
          )}
          {pollError && (
            <div className="mt-4 p-4 border rounded-lg bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 text-center">
              Error loading poll: {pollError}
            </div>
          )}
          {pollData && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
              <h4 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
                {pollData.question}
              </h4>
              <div className="space-y-2">
                {pollData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleVote(option.id)}
                    disabled={!!userVotedOptionId || isVoting}
                    className={`w-full text-left p-3 rounded-md transition-colors duration-200 relative
                      ${
                        userVotedOptionId
                          ? "cursor-not-allowed bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                          : "hover:bg-blue-50 dark:hover:bg-blue-900 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      }
                      ${
                        userVotedOptionId === option.id
                          ? "border-2 border-blue-500 dark:border-blue-400"
                          : ""
                      }
                    `}
                  >
                    {userVotedOptionId && pollData.totalVotes > 0 && (
                      <div
                        className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 rounded-md"
                        style={{
                          width: `${
                            (option.voteCount / pollData.totalVotes) * 100
                          }%`,
                        }}
                      ></div>
                    )}

                    <div className="flex justify-between items-center relative z-10">
                      <span className="font-medium">
                        {option.optionText}
                        {userVotedOptionId === option.id && (
                          <CheckCircleIcon className="ml-2 inline-block h-4 w-4 text-blue-500 dark:text-blue-400" />
                        )}
                      </span>
                      {userVotedOptionId && (
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                          {pollData.totalVotes > 0
                            ? `${(
                                (option.voteCount / pollData.totalVotes) *
                                100
                              ).toFixed(1)}% (${option.voteCount})`
                            : `0.0% (${option.voteCount})`}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-right">
                {pollData.totalVotes} vote{pollData.totalVotes !== 1 ? "s" : ""}
                {pollData.expiresAt &&
                  new Date(pollData.expiresAt) > new Date() && (
                    <>
                      <span className="mx-1">•</span>
                      <span>
                        Poll ends{" "}
                        {formatDistanceToNow(new Date(pollData.expiresAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </>
                  )}
                {pollData.expiresAt &&
                  new Date(pollData.expiresAt) <= new Date() && (
                    <>
                      <span className="mx-1">•</span>
                      <span>Poll ended</span>
                    </>
                  )}
              </p>
            </div>
          )}

          {/* Post Actions with Reddit-style voting */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mt-4 px-1">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePostVote(1)}
                disabled={isVotingPost || !currentUserId}
                className={`h-7 w-7 p-0 rounded-full transition-colors ${
                  postVoteData.userVote === 1
                    ? "text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900"
                    : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                aria-label="Upvote post"
              >
                <ArrowBigUp className="h-5 w-5" />
              </Button>
              <span
                className={`font-semibold mx-1 ${
                  postVoteData.score > 0
                    ? "text-orange-500"
                    : postVoteData.score < 0
                      ? "text-blue-500"
                      : "text-gray-800 dark:text-gray-200"
                }`}
              >
                {postVoteData.score}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePostVote(-1)}
                disabled={isVotingPost || !currentUserId}
                className={`h-7 w-7 p-0 rounded-full transition-colors ${
                  postVoteData.userVote === -1
                    ? "text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
                    : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                aria-label="Downvote post"
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

          {/* Comments Section */}
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
                      disabled={
                        isSubmittingComment ||
                        !newComment.trim() ||
                        !currentUserId
                      }
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
                      currentUserId={currentUserId}
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
