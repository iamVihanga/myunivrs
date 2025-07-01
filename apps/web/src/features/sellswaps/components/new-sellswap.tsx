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
import { createSellSwap } from "../actions/create.sellswaps";
import { InsertSellSwap } from "../schemas";

const CONDITION_OPTIONS = ["new", "used", "refurbished", "damaged"];
const TYPE_OPTIONS = ["sell", "swap"];
const STATUS_OPTIONS = ["draft", "published", "archived"];

export function NewSellSwap() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InsertSellSwap>({
    title: "",
    description: "",
    images: [],
    categoryId: "",
    type: "sell",
    price: null, // <-- was ""
    condition: "used",
    city: "",
    state: "",
    zipCode: "",
    status: "draft",
    swapPreferences: "",
    contactNumber: "",
    quantity: 1,
    tags: [],
  });

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

  // For images input (comma separated URLs)
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      images: e.target.value
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean),
    }));
  };

  // For tags input (comma separated)
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      tags: e.target.value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.categoryId || !formData.type) {
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
      await createSellSwap({
        ...formData,
        price:
          formData.price === "" || formData.price === null
            ? null
            : String(formData.price),
      });

      toast.success("Sell/Swap listing created successfully!");
      setFormData({
        title: "",
        description: "",
        images: [],
        categoryId: "",
        type: "sell",
        price: "",
        condition: "used",
        city: "",
        state: "",
        zipCode: "",
        status: "draft",
        swapPreferences: "",
        contactNumber: "",
        quantity: 1,
        tags: [],
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create Sell/Swap listing. Please try again.");
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
          className="bg-green-600 hover:bg-green-700"
        >
          Add Sell/Swap Listing
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Sell/Swap Listing</DialogTitle>
            <DialogDescription>
              Fill out the form to add a new sell or swap item.
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
                placeholder="Enter item title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="categoryId">
                Category ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="categoryId"
                name="categoryId"
                placeholder="Enter category ID"
                value={formData.categoryId ?? ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">
                Type <span className="text-red-500">*</span>
              </Label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="border rounded-md px-3 py-2"
                required
              >
                {TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="Enter price"
                value={formData.price ?? ""}
                onChange={handleChange}
                min={0}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="condition">Condition</Label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="border rounded-md px-3 py-2"
              >
                {CONDITION_OPTIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond.charAt(0).toUpperCase() + cond.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="images">Images (comma separated URLs)</Label>
              <Input
                id="images"
                name="images"
                placeholder="https://img1.jpg, https://img2.jpg"
                value={(formData.images ?? []).join(", ")}
                onChange={handleImagesChange}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="City"
                  value={formData.city ?? ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  placeholder="State"
                  value={formData.state ?? ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  placeholder="Zip code"
                  value={formData.zipCode ?? ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border rounded-md px-3 py-2"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="swapPreferences">Swap Preferences</Label>
              <Textarea
                id="swapPreferences"
                name="swapPreferences"
                placeholder="Describe swap preferences"
                value={formData.swapPreferences ?? ""}
                onChange={handleChange}
                rows={2}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                placeholder="Enter contact number"
                value={formData.contactNumber ?? ""}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min={1}
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="tag1, tag2"
                value={(formData.tags ?? []).join(", ")}
                onChange={handleTagsChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter item description"
                value={formData.description ?? ""}
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
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Creating..." : "Create Listing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
