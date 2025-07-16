import { getAllComment } from "../actions/getAll.action";
import { CommentCard } from "./comment-card";

export interface GetCommentParams {
  page?: string;
  limit?: string;
  postId?: string;
}

interface CommentsListProps {
  page?: string;
  limit?: string;
  postId: string;
}

export async function CommentsList({
  page = "1",
  limit = "50",
  postId,
}: CommentsListProps) {
  const response = await getAllComment({ page, limit, postId });

  const comments = response.data.map((comment: any) => ({
    ...comment,
    createdAt: new Date(comment.createdAt),
  }));

  return (
    <div className="space-y-4 divide-y">
      {comments.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        comments.map((comment: any) => (
          <CommentCard key={comment.id} comment={comment} />
        ))
      )}
    </div>
  );
}
