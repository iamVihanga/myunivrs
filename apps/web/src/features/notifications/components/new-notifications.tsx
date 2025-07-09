"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";
import { PlusIcon, XIcon } from "lucide-react";

import { createNotifications } from "../actions/create.action";
import { InsertNotification } from "../schemas";

export function NewNotifications() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InsertNotification>({
    userId: "",
    title: "",
    message: "",
    read: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId || !formData.title || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createNotifications(formData);
      toast.success("Notification created successfully!");
      setFormData({ userId: "", title: "", message: "", read: false });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create notification");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Notification
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Create New Notification</DialogTitle>
            <DialogDescription>
              Fill out the form to create a new user notification.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* User ID */}
            <div>
              <Label htmlFor="userId">
                User ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="Enter user ID"
                required
              />
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter notification title"
                required
              />
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Enter notification message"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              <XIcon className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-cyan-600"
            >
              {isSubmitting ? "Creating..." : "Create Notification"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
