"use client";
import { PlusIcon, XIcon } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { createJob } from "../actions/create.action";
import { InsertJobs } from "../schemas";

export function NewJob() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InsertJobs>({
    title: "",
    description: "",
    images: [],
    company: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!formData.title || !formData.company) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await createJob({
        ...formData,
        images: [],
      });

      toast.success("Job listing created successfully!");
      setFormData({
        title: "",
        description: "",
        images: [],
        company: "",
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create Job listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          icon={<PlusIcon />}
          size="sm"
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          Add New Listing
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Job Listing</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new job listing.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter listing title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter listing description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">
                Company <span className="text-red-500">*</span>
              </Label>
              <Input
                id="company"
                name="company"
                placeholder="Enter company name"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>

            {/* <div className="grid gap-2">
              <Label htmlFor="link">Features</Label>
              <Input
                id="features"
                name="features"
                placeholder="Enter Yes or No"
                value={formData.isFeatured || ""}
                onChange={handleChange}
              />
            </div> */}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              icon={<XIcon className="h-4 w-4" />}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {isSubmitting ? "Creating..." : "Create Listing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
