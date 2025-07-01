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
  InfoIcon,
  MapPinIcon,
  PackageIcon,
  PlusIcon,
  Settings2Icon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createProducts } from "../actions/create.action";
import { InsertProduct } from "../schemas";

export function NewProduct() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InsertProduct>({
    title: "",
    description: "",
    images: [],
    price: 0,
    discountPercentage: 0,
    location: "",
    condition: "used",
    stockQuantity: 1,
    isNegotiable: false,
    categoryId: "",
    status: "published",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" ||
        name === "discountPercentage" ||
        name === "stockQuantity"
          ? Number(value)
          : value || undefined,
    }));
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

    if (
      !formData.title ||
      !formData.location ||
      formData.price < 0 ||
      formData.stockQuantity < 1
    ) {
      toast.error("Please fill in all required fields and ensure valid values");
      return;
    }

    setIsSubmitting(true);

    try {
      await createProducts({
        ...formData,
        description: formData.description || undefined,
        categoryId: formData.categoryId || undefined,
      });
      toast.success("Product listing created successfully!");
      setFormData({
        title: "",
        description: "",
        images: [],
        price: 0,
        discountPercentage: 0,
        location: "",
        condition: "used",
        stockQuantity: 1,
        isNegotiable: false,
        categoryId: "",
        status: "published",
      });
      setOpen(false);
      // Redirect to the product list page with page=1 to ensure new product is visible
      router.push("/dashboard/products?page=1");
      router.refresh();
    } catch (error) {
      console.error("Form Submission Error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create product listing. Please try again."
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
          Add New Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Create New Product Listing</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new product listing. Required
              fields are marked with *.
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
                    placeholder="Enter product title"
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
                    placeholder="Enter product description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Section: Pricing */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSignIcon className="h-5 w-5 text-cyan-600" />
                Pricing
              </h3>
              <div className="grid gap-4 mt-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="price">
                    Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="Enter product price"
                    value={formData.price}
                    onChange={handleChange}
                    min={0}
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
                    type="number"
                    placeholder="Enter discount percentage"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                    min={0}
                    max={100}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="isNegotiable">Price Negotiable</Label>
                  <Checkbox
                    id="isNegotiable"
                    checked={formData.isNegotiable || false}
                    onCheckedChange={handleCheckboxChange}
                  />
                </div>
              </div>
            </div>

            {/* Section: Location */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-cyan-600" />
                Location
              </h3>
              <div className="grid gap-4 mt-4">
                <div className="grid gap-2">
                  <Label htmlFor="location">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Enter product location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section: Product Details */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <PackageIcon className="h-5 w-5 text-cyan-600" />
                Product Details
              </h3>
              <div className="grid gap-4 mt-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select
                    name="condition"
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
                <div className="grid gap-2">
                  <Label htmlFor="stockQuantity">
                    Stock Quantity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="stockQuantity"
                    name="stockQuantity"
                    type="number"
                    placeholder="Enter stock quantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    min={1}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="categoryId">Category</Label>
                  <Input
                    id="categoryId"
                    name="categoryId"
                    placeholder="Enter category ID"
                    value={formData.categoryId || ""}
                    onChange={handleChange}
                  />
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

            {/* Section: Status */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings2Icon className="h-5 w-5 text-cyan-600" />
                Status
              </h3>
              <div className="grid gap-4 mt-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    name="status"
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: value as "published" | "draft" | "archived",
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
