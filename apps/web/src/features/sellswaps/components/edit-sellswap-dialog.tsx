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
  BoxIcon,
  ImageIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  PlusIcon,
  TagIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateSellSwap } from "../actions/update.action";
import type { SellSwap } from "../schemas";

const CONDITION_OPTIONS = ["new", "used", "refurbished", "for_parts"];
const TYPE_OPTIONS = ["sell", "swap"];
const STATUS_OPTIONS = ["draft", "published", "archived"];

type Props = {
  sellSwap: SellSwap;
};

export function EditSellSwapDialog({ sellSwap }: Props) {
  const [open, setOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: sellSwap.title,
    description: sellSwap.description || "",
    images: sellSwap.images || [],
    type: sellSwap.type || "sell",
    price: sellSwap.price,
    condition: sellSwap.condition || "used",
    city: sellSwap.city || "",
    state: sellSwap.state || "",
    zipCode: sellSwap.zipCode || "",
    status: sellSwap.status || "draft",
    swapPreferences: sellSwap.swapPreferences || "",
    contactNumber: sellSwap.contactNumber || "",
    quantity: sellSwap.quantity || 1,
    tags: sellSwap.tags || [],
  });

  // Handlers from NewSellSwap component
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? null : Number(value)) : value,
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      tags: e.target.value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
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

    if (!formData.title || !formData.type) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (
      formData.type === "sell" &&
      (formData.price === null || isNaN(Number(formData.price)))
    ) {
      toast.error("Please enter a valid price for sell listings");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateSellSwap(sellSwap.id, formData);
      toast.success("Sell/Swap listing updated successfully!");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update sell/swap listing"
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
            <DialogTitle>Edit Sell/Swap Listing</DialogTitle>
            <DialogDescription>
              Update your sell or swap item listing.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto px-8 py-6 space-y-8">
            {/* Basic Information */}
            <section className="border rounded-lg p-6 bg-muted/50 space-y-6">
              <div className="flex items-center gap-2">
                <BoxIcon className="h-5 w-5 text-cyan-600" />
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </div>
              <div className="grid gap-4">
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
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="type">
                      Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          type: value as "sell" | "swap",
                        }))
                      }
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </section>

            {/* Item Details */}
            <section className="border rounded-lg p-6 bg-muted/50 space-y-6">
              <div className="flex items-center gap-2">
                <TagIcon className="h-5 w-5 text-cyan-600" />
                <h3 className="text-lg font-semibold">Item Details</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {formData.type === "sell" && (
                  <div className="grid gap-2">
                    <Label htmlFor="price">
                      Price <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price || ""}
                      onChange={handleChange}
                      required={formData.type === "sell"}
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        condition: value as
                          | "new"
                          | "used"
                          | "refurbished"
                          | "for_parts",
                      }))
                    }
                  >
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITION_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                </div>
                {formData.type === "swap" && (
                  <div className="grid gap-2">
                    <Label htmlFor="swapPreferences">Swap Preferences</Label>
                    <Input
                      id="swapPreferences"
                      name="swapPreferences"
                      value={formData.swapPreferences}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Media */}
            <section className="border rounded-lg p-6 bg-muted/50 space-y-6">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-cyan-600" />
                <h3 className="text-lg font-semibold">Media</h3>
              </div>
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
            </section>

            {/* Location & Contact */}
            <section className="border rounded-lg p-6 bg-muted/50 space-y-6">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-cyan-600" />
                <h3 className="text-lg font-semibold">Location & Contact</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Additional Details */}
            <section className="border rounded-lg p-6 bg-muted/50 space-y-6">
              <div className="flex items-center gap-2">
                <TagIcon className="h-5 w-5 text-cyan-600" />
                <h3 className="text-lg font-semibold">Additional Details</h3>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags.join(", ")}
                    onChange={handleTagsChange}
                    placeholder="Enter tags separated by commas"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: value as
                          | "published"
                          | "draft"
                          | "pending_approval"
                          | "deleted"
                          | "active"
                          | "sold"
                          | "swapped"
                          | "expired",
                      }))
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>
          </div>

          <DialogFooter className="flex-shrink-0 mt-6 px-8">
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
