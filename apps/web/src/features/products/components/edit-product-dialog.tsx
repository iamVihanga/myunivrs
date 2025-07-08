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
  DollarSignIcon,
  ImageIcon,
  PackageIcon,
  PencilIcon,
  PlusIcon,
  TagIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateProduct } from "../actions/update.action";
import type { Product } from "../schemas";

type Props = {
  product: Product;
};

export function EditProductDialog({ product }: Props) {
  const [open, setOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: product.title,
    description: product.description || "",
    images: product.images || [],
    price: product.price || "0",
    discountPercentage: product.discountPercentage || "0",
    location: product.location || "",
    condition: product.condition || "used",
    stockQuantity: product.stockQuantity || "1",
    isNegotiable: product.isNegotiable || false,
    categoryId: product.categoryId || "",
    status: product.status || "published",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isNegotiable: checked }));
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
      // Only allow valid status values for updateProduct
      const allowedStatus = ["published", "draft", "deleted"] as const;
      const safeFormData = {
        ...formData,
        status: allowedStatus.includes(formData.status as any)
          ? (formData.status as "published" | "draft" | "deleted")
          : "published",
      };
      await updateProduct(product.id, safeFormData);
      toast.success("Product updated successfully!");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update product"
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
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to your product listing below.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto px-8 py-6 space-y-8">
            {/* Basic Information */}
            <section className="border rounded-lg p-6 bg-muted/50 space-y-6">
              <div className="flex items-center gap-2">
                <PackageIcon className="h-5 w-5 text-cyan-600" />
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
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>
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
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                      <SelectItem value="refurbished">Refurbished</SelectItem>
                      <SelectItem value="for_parts">For Parts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section className="border rounded-lg p-6 bg-muted/50 space-y-6">
              <div className="flex items-center gap-2">
                <DollarSignIcon className="h-5 w-5 text-cyan-600" />
                <h3 className="text-lg font-semibold">Pricing</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="price">
                    Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="text"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discountPercentage">
                    Discount Percentage
                  </Label>
                  <Input
                    id="discountPercentage"
                    name="discountPercentage"
                    type="text"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="isNegotiable">Negotiable</Label>
                  <Checkbox
                    id="isNegotiable"
                    checked={formData.isNegotiable}
                    onCheckedChange={handleCheckboxChange}
                  />
                </div>
              </div>
            </section>

            {/* Media */}
            <section className="border rounded-lg p-6 bg-muted/50 space-y-6">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-cyan-600" />
                <h3 className="text-lg font-semibold">Media</h3>
              </div>
              <div className="grid gap-4">
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
              </div>
            </section>

            {/* Additional Details */}
            <section className="border rounded-lg p-6 bg-muted/50 space-y-6">
              <div className="flex items-center gap-2">
                <TagIcon className="h-5 w-5 text-cyan-600" />
                <h3 className="text-lg font-semibold">Additional Details</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input
                    id="stockQuantity"
                    name="stockQuantity"
                    type="text"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="categoryId">Category</Label>
                  <Input
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
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
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="deleted">Deleted</SelectItem>
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
