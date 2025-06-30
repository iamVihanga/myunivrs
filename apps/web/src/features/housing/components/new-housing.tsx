"use client";
import { MediaUploader } from "@/modules/media/components/MediaUploader";
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
import { createHousing } from "../actions/create.action";
import { InsertHousing } from "../schemas";

export function NewHousing() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InsertHousing>({
    title: "",
    description: "",
    images: [],
    address: "",
    city: "",
    state: "",
    zipCode: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    parking: "",
    contactNumber: "",
    housingType: "",
    squareFootage: "",
    yearBuilt: "",
    isFurnished: false,
    link: "",
    status: "published",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? target.checked : value,
    }));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      images: e.target.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }));
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
        city: "",
        state: "",
        zipCode: "",
        price: "",
        bedrooms: "",
        bathrooms: "",
        parking: "",
        contactNumber: "",
        housingType: "",
        squareFootage: "",
        yearBuilt: "",
        isFurnished: false,
        link: "",
        status: "published",
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
        <Button
          size="sm"
          className="bg-cyan-600 hover:bg-cyan-700 flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add New Listing
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Housing Listing</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new housing listing.
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
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            {/* Address */}
            <div className="grid gap-2">
              <Label htmlFor="address">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            {/* City */}
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            {/* State */}
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            {/* Zip Code */}
            <div className="grid gap-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
              />
            </div>
            {/* Price */}
            <div className="grid gap-2">
              <Label htmlFor="price">
                Price <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            {/* Bedrooms */}
            <div className="grid gap-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
              />
            </div>
            {/* Bathrooms */}
            <div className="grid gap-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
              />
            </div>
            {/* Parking */}
            <div className="grid gap-2">
              <Label htmlFor="parking">Parking</Label>
              <Input
                id="parking"
                name="parking"
                value={formData.parking}
                onChange={handleChange}
              />
            </div>
            {/* Contact Number */}
            <div className="grid gap-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
              />
            </div>
            {/* Housing Type */}
            <div className="grid gap-2">
              <Label htmlFor="housingType">Housing Type</Label>
              <Input
                id="housingType"
                name="housingType"
                value={formData.housingType}
                onChange={handleChange}
              />
            </div>
            {/* Square Footage */}
            <div className="grid gap-2">
              <Label htmlFor="squareFootage">Square Footage</Label>
              <Input
                id="squareFootage"
                name="squareFootage"
                value={formData.squareFootage ?? ""}
                onChange={handleChange}
              />
            </div>
            {/* Year Built */}
            <div className="grid gap-2">
              <Label htmlFor="yearBuilt">Year Built</Label>
              <Input
                id="yearBuilt"
                name="yearBuilt"
                value={formData.yearBuilt ?? ""}
                onChange={handleChange}
              />
            </div>
            {/* Is Furnished */}
            <div className="flex items-center gap-2">
              <input
                id="isFurnished"
                name="isFurnished"
                type="checkbox"
                checked={formData.isFurnished}
                onChange={handleChange}
              />
              <Label htmlFor="isFurnished">Furnished</Label>
            </div>
            {/* Images */}
            <div className="grid gap-2">
              <Label htmlFor="images">Images</Label>
              <Input
                id="images"
                name="images"
                placeholder="Comma separated URLs"
                value={formData.images.join(", ")}
                onChange={handleImagesChange}
              />
              <span className="text-xs text-muted-foreground">
                Add image URLs separated by commas or upload below.
              </span>
              <MediaUploader
                acceptedTypes={["image"]}
                onUpload={(file) => {
                  setFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, file.url],
                  }));
                }}
                onError={(error) => {
                  toast.error("Image upload failed: " + error.message);
                }}
                path="housing"
                maxSize={4 * 1024 * 1024}
              />
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={img}
                        alt={`uploaded-${idx}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== idx),
                          }))
                        }
                        aria-label="Remove image"
                      >
                        <XIcon className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Link */}
            <div className="grid gap-2">
              <Label htmlFor="link">Website Link</Label>
              <Input
                id="link"
                name="link"
                value={formData.link ?? ""}
                onChange={handleChange}
              />
            </div>
            {/* Status */}
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                name="status"
                value={formData.status ?? ""}
                onChange={handleChange}
              />
            </div>
            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
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
