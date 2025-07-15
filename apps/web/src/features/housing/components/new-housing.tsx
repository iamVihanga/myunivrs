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
  BuildingIcon,
  HomeIcon,
  ImageIcon,
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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
    status: "active",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev: any) => ({ ...prev, isFurnished: checked }));
  };

  const handleImageRemove = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== idx),
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
        status: "active",
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
      <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Create New Housing Listing</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new housing listing. Required
              fields are marked with *.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto px-8">
            {/* Section 1: Essential Information */}
            <div className="mt-6 p-4 rounded-lg border bg-muted/10">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <HomeIcon className="h-5 w-5 text-cyan-600" />
                Essential Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="title" className="font-medium">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter a descriptive title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="description" className="font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the property in detail"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price" className="font-medium">
                    Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    placeholder="Enter monthly rent"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="housingType" className="font-medium">
                    Housing Type
                  </Label>
                  <Select
                    name="housingType"
                    value={formData.housingType || ""}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        housingType: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section 2: Location Details */}
            <div className="mt-6 p-4 rounded-lg border bg-muted/10">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <MapPinIcon className="h-5 w-5 text-cyan-600" />
                Location Details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="address" className="font-medium">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Enter full address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city" className="font-medium">
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state" className="font-medium">
                    State
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="Enter state"
                    value={formData.state || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="zipCode" className="font-medium">
                    Zip Code
                  </Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    placeholder="Enter zip code"
                    value={formData.zipCode || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Property Features */}
            <div className="mt-6 p-4 rounded-lg border bg-muted/10">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <BuildingIcon className="h-5 w-5 text-cyan-600" />
                Property Features
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="bedrooms" className="font-medium">
                    Bedrooms
                  </Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    placeholder="Number of bedrooms"
                    value={formData.bedrooms || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bathrooms" className="font-medium">
                    Bathrooms
                  </Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    placeholder="Number of bathrooms"
                    value={formData.bathrooms || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="squareFootage" className="font-medium">
                    Square Footage
                  </Label>
                  <Input
                    id="squareFootage"
                    name="squareFootage"
                    type="number"
                    placeholder="Total area"
                    value={formData.squareFootage || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="yearBuilt" className="font-medium">
                    Year Built
                  </Label>
                  <Input
                    id="yearBuilt"
                    name="yearBuilt"
                    type="number"
                    placeholder="Construction year"
                    value={formData.yearBuilt || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="parking" className="font-medium">
                    Parking
                  </Label>
                  <Input
                    id="parking"
                    name="parking"
                    placeholder="Parking details"
                    value={formData.parking || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2 items-center">
                  <Label htmlFor="isFurnished" className="font-medium">
                    Furnished
                  </Label>
                  <Checkbox
                    id="isFurnished"
                    checked={formData.isFurnished || false}
                    onCheckedChange={handleCheckboxChange}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Media & Links */}
            <div className="mt-6 p-4 rounded-lg border bg-muted/10">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-cyan-600" />
                Media & Links
              </h3>
              <div className="grid gap-2 mt-4">
                <Label>Images</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.images.map(
                    (img: string | undefined, idx: number) => (
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
                    )
                  )}
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
              <div className="grid gap-2 mt-4">
                <Label htmlFor="link" className="font-medium">
                  Website Link
                </Label>
                <Input
                  id="link"
                  name="link"
                  placeholder="https://example.com"
                  value={formData.link || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Section 5: Contact Information */}
            <div className="mt-6 mb-6 p-4 rounded-lg border bg-muted/10">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <PhoneIcon className="h-5 w-5 text-cyan-600" />
                Contact Information
              </h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="contactNumber" className="font-medium">
                    Contact Number
                  </Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    placeholder="Enter contact number"
                    value={formData.contactNumber || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
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
              {isSubmitting ? "Creating..." : "Create Listing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
