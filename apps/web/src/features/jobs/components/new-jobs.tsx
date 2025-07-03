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
  BuildingIcon,
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

          <div className="flex-grow overflow-y-auto px-4">
            {/* Section: Basic Information */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BriefcaseIcon className="h-5 w-5 text-cyan-600" />
                Basic Information
              </h3>
              <div className="grid gap-4 mt-4">
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
              </div>
            </div>

            {/* Section: Company Details */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BuildingIcon className="h-5 w-5 text-cyan-600" />
                Company Details
              </h3>
              <div className="grid gap-4 mt-4">
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

            {/* Section: Job Requirements */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CodeIcon className="h-5 w-5 text-cyan-600" />
                Job Requirements
              </h3>
              <div className="grid gap-4 mt-4 sm:grid-cols-2">
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
              </div>
            </div>

            {/* Section: Compensation */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSignIcon className="h-5 w-5 text-cyan-600" />
                Compensation
              </h3>
              <div className="grid gap-4 mt-4 sm:grid-cols-2">
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
              </div>
            </div>

            {/* Section: Application Details */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-cyan-600" />
                Application Details
              </h3>
              <div className="grid gap-4 mt-4">
                <div className="grid gap-2">
                  <Label>Images</Label>
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
                </div>
                <GalleryView
                  modal={true}
                  activeTab="library"
                  onUseSelected={handleGallerySelect}
                  modalOpen={galleryOpen}
                  setModalOpen={setGalleryOpen}
                />
                Fal
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
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 mt-6 px-4">
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
