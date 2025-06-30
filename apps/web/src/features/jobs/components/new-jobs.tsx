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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
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
    isFeatured: false,
    status: "published",
    requiredSkills: [],
    salaryRange: {},
    actionUrl: "",
    jobType: "full_time",
    cvRequired: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" && "checked" in e.target
        ? (e.target as HTMLInputElement).checked
        : undefined;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // For requiredSkills as comma-separated input
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: e.target.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }));
  };

  // For salaryRange
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      salaryRange: {
        ...prev.salaryRange,
        [name]:
          value === ""
            ? undefined
            : isNaN(Number(value))
              ? value
              : Number(value),
      },
    }));
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
        isFeatured: false,
        status: "published",
        requiredSkills: [],
        salaryRange: {},
        actionUrl: "",
        jobType: "full_time",
        cvRequired: false,
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
          size="sm"
          className="bg-cyan-600 hover:bg-cyan-700 flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add New Listing
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Job Listing</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new job listing.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
            {/* Title */}
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
            {/* Description */}
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
            {/* Company */}
            <div className="grid gap-2">
              <Label htmlFor="company">
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
            {/* Job Type */}
            <div className="grid gap-2">
              <Label htmlFor="jobType">Job Type</Label>
              <Select
                value={formData.jobType}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    jobType: value as InsertJobs["jobType"],
                  }))
                }
                name="jobType"
              >
                <SelectTrigger id="jobType">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Required Skills */}
            <div className="grid gap-2">
              <Label htmlFor="requiredSkills">Required Skills</Label>
              <Input
                id="requiredSkills"
                name="requiredSkills"
                placeholder="e.g. React, Node.js, SQL"
                value={formData.requiredSkills.join(", ")}
                onChange={handleSkillsChange}
              />
              <span className="text-xs text-muted-foreground">
                Separate skills with commas
              </span>
            </div>
            {/* Salary Range */}
            <div className="grid gap-2">
              <Label>Salary Range</Label>
              <div className="flex gap-2">
                <Input
                  name="min"
                  type="number"
                  placeholder="Min"
                  value={formData.salaryRange.min ?? ""}
                  onChange={handleSalaryChange}
                  min={0}
                />
                <Input
                  name="max"
                  type="number"
                  placeholder="Max"
                  value={formData.salaryRange.max ?? ""}
                  onChange={handleSalaryChange}
                  min={0}
                />
                <Input
                  name="currency"
                  placeholder="Currency"
                  value={formData.salaryRange.currency ?? ""}
                  onChange={handleSalaryChange}
                />
              </div>
            </div>
            {/* Action URL */}
            <div className="grid gap-2">
              <Label htmlFor="actionUrl">Application Link</Label>
              <Input
                id="actionUrl"
                name="actionUrl"
                placeholder="https://company.com/apply"
                value={formData.actionUrl || ""}
                onChange={handleChange}
                type="url"
              />
            </div>
            {/* CV Required */}
            <div className="grid gap-2">
              <Label htmlFor="cvRequired">CV Required?</Label>
              <Select
                value={formData.cvRequired ? "yes" : "no"}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    cvRequired: value === "yes",
                  }))
                }
                name="cvRequired"
              >
                <SelectTrigger id="cvRequired">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Is Featured */}
            <div className="grid gap-2">
              <Label htmlFor="isFeatured">Featured?</Label>
              <Select
                value={formData.isFeatured ? "yes" : "no"}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    isFeatured: value === "yes",
                  }))
                }
                name="isFeatured"
              >
                <SelectTrigger id="isFeatured">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Status */}
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as InsertJobs["status"],
                  }))
                }
                name="status"
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
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
