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
  PackageIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateB2bplan } from "../actions/update.action";
import type { B2bplan } from "../schemas";

type Props = {
  b2bplan: B2bplan;
};

export function EditB2bplanDialog({ b2bplan }: Props) {
  const [open, setOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: b2bplan.title,
    description: b2bplan.description || "",
    images: b2bplan.images || [],
    prize: b2bplan.prize,
    type: b2bplan.type || "",
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
    setIsSubmitting(true);

    try {
      await updateB2bplan(b2bplan.id, formData);
      toast.success("B2B plan updated successfully!");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update B2B plan"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 px-2">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Edit B2B Plan</DialogTitle>
            <DialogDescription>
              Make changes to your B2B plan below.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto px-4">
            {/* Basic Information */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <PackageIcon className="h-5 w-5 text-cyan-600" />
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
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prize">
                    Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="prize"
                    name="prize"
                    value={formData.prize}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Plan Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select plan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Media Section */}
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
