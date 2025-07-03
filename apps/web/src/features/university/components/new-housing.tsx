"use client";
import { PlusIcon, Trash2Icon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
import { Textarea } from "@repo/ui/components/textarea";
import { useRouter } from "next/navigation";
import { createHousing } from "../actions/create.action";
import { InsertHousing } from "../schemas";

export function NewHousing() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InsertHousing>({
    title: "",
    description: "",
    images: [],
    address: "",
    price: "",
    link: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    if (!formData.title || !formData.address || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await createHousing(formData);

      toast.success("Housing listing created successfully!");
      setFormData({
        title: "",
        description: "",
        images: [],
        address: "",
        price: "",
        link: "",
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create housing listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New Listing
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Housing Listing</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new housing listing.
            </DialogDescription>
          </DialogHeader>

          {/* Images uploader and preview */}
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
              {/* Add Image Button */}
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

          {/* Gallery Modal */}
          <GalleryView
            modal={true}
            activeTab="library"
            onUseSelected={handleGallerySelect}
            modalOpen={galleryOpen}
            setModalOpen={setGalleryOpen}
          />

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
              <Label htmlFor="address">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                name="address"
                placeholder="Enter property address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">
                Price <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                placeholder="Enter property price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="link">Website Link</Label>
              <Input
                id="link"
                name="link"
                placeholder="https://example.com"
                value={formData.link || ""}
                onChange={handleChange}
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
