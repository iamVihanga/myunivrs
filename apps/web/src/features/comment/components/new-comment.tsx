"use client";

import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Textarea } from "@repo/ui/components/textarea";
import { MessageCircleIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createComment } from "../actions/create.action";
import type { InsertComment } from "../schemas";

interface NewCommentProps {
  postId: string;
}

const initialCommentData: InsertComment = {
  content: "",
  postId: "",
  voteScore: 0,
};

export function NewComment({ postId }: NewCommentProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InsertComment>({
    ...initialCommentData,
    postId,
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.content.trim()) {
        throw new Error("Comment cannot be empty");
      }

      await createComment(formData);
      toast.success("Comment posted successfully!");
      setFormData({ ...initialCommentData, postId });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to post comment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <MessageCircleIcon className="h-4 w-4 mr-2" />
          Add Comment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add a Comment</DialogTitle>
            <DialogDescription>
              Share your thoughts about this post
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            <Textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your comment here..."
              rows={4}
              required
              className="resize-none"
            />
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              <XIcon className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
