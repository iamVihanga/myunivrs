"use client";

import GalleryView from "@/modules/media/components/gallery-view";

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
import {
  BriefcaseIcon,
  CodeIcon,
  DollarSignIcon,
  LinkIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createJob } from "../actions/create.action";
import { InsertJobs } from "../schemas";

export function NewJob() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [galleryOpen, setGalleryOpen] = useState(false);

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
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: e.target.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }));
  };

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

  const handleImageRemove = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const handleGallerySelect = (selectedFiles: { url: string }[]) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...selectedFiles.map((f) => f.url)],
    }));
    setGalleryOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.company) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await createJob(formData);

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

      toast.error("Failed to create job listing. Please try again.");
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
      <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Create New Job Listing</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new job listing. Required fields
              are marked with *.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto px-8">
            {/* Section 1: Basic Information */}
            <div className="mt-6 p-4 rounded-lg border bg-muted/10">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <BriefcaseIcon className="h-5 w-5 text-cyan-600" />
                Basic Information
              </h3>
              <div className="grid gap-4">
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
                    placeholder="Enter detailed job description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
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
              </div>
            </div>

            {/* Section 2: Job Requirements & Type */}
            <div className="mt-6 p-4 rounded-lg border bg-muted/10">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <CodeIcon className="h-5 w-5 text-cyan-600" />
                Job Requirements
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
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
              </div>
            </div>

            {/* Section 3: Compensation */}
            <div className="mt-6 p-4 rounded-lg border bg-muted/10">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <DollarSignIcon className="h-5 w-5 text-cyan-600" />
                Compensation
              </h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Salary Range</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      name="min"
                      type="number"
                      placeholder="Min salary"
                      value={formData.salaryRange.min ?? ""}
                      onChange={handleSalaryChange}
                      min={0}
                    />
                    <Input
                      name="max"
                      type="number"
                      placeholder="Max salary"
                      value={formData.salaryRange.max ?? ""}
                      onChange={handleSalaryChange}
                      min={0}
                    />
                    <Input
                      name="currency"
                      placeholder="Currency (e.g. USD)"
                      value={formData.salaryRange.currency ?? ""}
                      onChange={handleSalaryChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Listing Details & Media */}
            <div className="mt-6 mb-6 p-4 rounded-lg border bg-muted/10">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <LinkIcon className="h-5 w-5 text-cyan-600" />
                Listing Details
              </h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Listing Images</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`uploaded-${idx}`}
                          className="w-16 h-16 object-cover rounded border"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          onClick={() => handleImageRemove(idx)}
                          aria-label="Remove image"
                        >
                          <Trash2Icon className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setGalleryOpen(true)}
                      className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-cyan-400 rounded hover:bg-cyan-50 transition"
                      aria-label="Add image"
                    >
                      <PlusIcon className="w-6 h-6 text-cyan-600" />
                    </button>
                  </div>
                  <GalleryView
                    modal={true}
                    activeTab="library"
                    onUseSelected={handleGallerySelect}
                    modalOpen={galleryOpen}
                    setModalOpen={setGalleryOpen}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="actionUrl">Application URL</Label>
                    <Input
                      id="actionUrl"
                      name="actionUrl"
                      placeholder="https://company.com/apply"
                      value={formData.actionUrl || ""}
                      onChange={handleChange}
                      type="url"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="isFeatured">Featured Listing?</Label>
                    <Select
                      value={formData.isFeatured ? "yes" : "no"}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          isFeatured: value === "yes",
                        }))
                      }
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
                  <div className="grid gap-2">
                    <Label htmlFor="status">Listing Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: value as InsertJobs["status"],
                        }))
                      }
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
              </div>
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 px-8 py-4">
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
