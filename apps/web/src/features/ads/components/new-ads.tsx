"use client";
import GalleryView from "@/modules/media/components/gallery-view";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
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
  InfoIcon,
  PackageIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { createAds } from "../actions/create.action";
import { InsertAds, insertAdsSchema } from "../schemas";

export function NewAds() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InsertAds>({
    title: "",
    description: "",
    images: [],
    postType: "",
    contactInformation: "",
    isFeatured: false,
    companyName: "",
    occurrence: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isFeatured: checked }));
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

    try {
      // Validate form data against schema
      const validatedData = insertAdsSchema.parse({
        ...formData,
        description: formData.description || undefined,
        contactInformation: formData.contactInformation || undefined,
        companyName: formData.companyName || undefined,
        occurrence: formData.occurrence || undefined,
        images: formData.images.length > 0 ? formData.images : undefined,
      });

      setIsSubmitting(true);
      await createAds(validatedData);
      toast.success("Ads listing created successfully!");
      setFormData({
        title: "",
        description: "",
        images: [],
        postType: "",
        contactInformation: "",
        isFeatured: false,
        companyName: "",
        occurrence: "",
      });
      setOpen(false);
      // Redirect to ads list with page=1 to ensure new ad is visible
      router.push("/dashboard/ads?page=1");
      router.refresh();
    } catch (error) {
      console.error("Form Submission Error:", error);
      toast.error(
        error instanceof z.ZodError
          ? `Validation failed: ${onmessage}`
          : error instanceof Error
            ? error.message
            : "Failed to create ads listing. Please try again."
      );
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
          Add New Ad
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Create New Ads Listing</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new ads listing. Required fields
              are marked with *.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto px-4">
            {/* Section: Basic Information */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <InfoIcon className="h-5 w-5 text-cyan-600" />
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
                    placeholder="Enter ad title"
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
                    placeholder="Enter ad description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="postType">
                    Post Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    name="postType"
                    value={formData.postType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, postType: value }))
                    }
                  >
                    <SelectTrigger id="postType">
                      <SelectValue placeholder="Select post type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="lease">Lease</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section: Media */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <PackageIcon className="h-5 w-5 text-cyan-600" />
                Media
              </h3>
              <div className="grid gap-2 mt-4">
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
            </div>

            {/* Section: Additional Details */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <PackageIcon className="h-5 w-5 text-cyan-600" />
                Additional Details
              </h3>
              <div className="grid gap-4 mt-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="contactInformation">
                    Contact Information
                  </Label>
                  <Input
                    id="contactInformation"
                    name="contactInformation"
                    placeholder="Enter contact information (e.g., phone, email)"
                    value={formData.contactInformation || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Enter company name"
                    value={formData.companyName || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="occurrence">Occurrence</Label>
                  <Select
                    name="occurrence"
                    value={formData.occurrence || ""}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, occurrence: value }))
                    }
                  >
                    <SelectTrigger id="occurrence">
                      <SelectValue placeholder="Select occurrence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="one-time">One-Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="isFeatured">Featured Listing</Label>
                  <Checkbox
                    id="isFeatured"
                    checked={formData.isFeatured || false}
                    onCheckedChange={handleCheckboxChange}
                  />
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
