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
import { createProducts } from "../actions/create.action";
import { InsertProduct } from "../schemas";

export function NewProducts() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<
    Omit<
      InsertProduct,
      "id" | "createdAt" | "createdBy" | "agentProfile" | "updatedAt"
    >
  >({
    title: "",
    description: "",
    images: [],
    price: 0,
    discount_percentage: 0, // Changed to match database schema
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "price" || name === "discount_percentage") {
      // Allow empty string for better UX while typing
      if (value === "") {
        setFormData((prev) => ({ ...prev, [name]: undefined }));
      } else {
        const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10);
        if (!isNaN(numericValue)) {
          setFormData((prev) => ({ ...prev, [name]: numericValue }));
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!formData.title || !formData.description || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await createProducts({
        ...formData,
        images: formData.images || [],
        discount_percentage: formData.discount_percentage || 0, // Ensure number
      });

      toast.success("Product listing created successfully!");
      setFormData({
        title: "",
        description: "",
        images: [],
        price: 0,
        discount_percentage: 0,
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create product listing. Please try again.");
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
            <DialogTitle>Create New Product Listing</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new product listing.
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
              <Label htmlFor="price">
                Price <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="1"
                placeholder="Enter property price"
                value={formData.price || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="discount_percentage">Discount Percentage</Label>
              <Input
                id="discount_percentage"
                name="discount_percentage"
                type="number"
                min="0"
                max="100"
                step="1"
                placeholder="Enter Discount Percentage"
                value={formData.discount_percentage || ""}
                onChange={handleChange}
                onKeyDown={(e) => {
                  // Prevent entering decimal points
                  if (["e", "E", "+", "-", "."].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
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
