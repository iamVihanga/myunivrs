
// "use client";
// import GalleryView from "@/modules/media/components/gallery-view";
// import { Button } from "@repo/ui/components/button";
// import { Checkbox } from "@repo/ui/components/checkbox";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@repo/ui/components/dialog";
// import { Input } from "@repo/ui/components/input";
// import { Label } from "@repo/ui/components/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@repo/ui/components/select";
// import { Textarea } from "@repo/ui/components/textarea";
// import {
//   DollarSignIcon,
//   ImageIcon,
//   PackageIcon,
//   PlusIcon,
//   Trash2Icon,
//   XIcon,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "sonner";
// import { createProducts } from "../actions/create.action";
// import { InsertProduct } from "../schemas";

// export function NewProducts() {
//   const router = useRouter();
//   const [open, setOpen] = useState(false);
//   const [galleryOpen, setGalleryOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState<InsertProduct>({
//     title: "",
//     description: "",
//     images: [],
//     price: "0",
//     discountPercentage: "0",
//     location: "",
//     condition: "used",
//     stockQuantity: "1",
//     isNegotiable: false,
//     categoryId: "",
//     status: "published",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleCheckboxChange = (checked: boolean) => {
//     setFormData((prev) => ({ ...prev, isNegotiable: checked }));
//   };

//   const handleImageRemove = (idx: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== idx),
//     }));
//   };

//   const handleGallerySelect = (selectedFiles: { url: string }[]) => {
//     setFormData((prev) => ({
//       ...prev,
//       images: Array.isArray(prev.images)
//         ? [...prev.images, ...selectedFiles.map((f) => f.url)]
//         : [...selectedFiles.map((f) => f.url)],
//     }));
//     setGalleryOpen(false);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (
//       !formData.title ||
//       !formData.description ||
//       !formData.location ||
//       formData.price === "0"
//     ) {
//       toast.error(
//         "Please fill in all required fields (Title, Description, Location, Price)"
//       );
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       await createProducts(formData);
//       toast.success("Product listing created successfully!");
//       setFormData({
//         title: "",
//         description: "",
//         images: [],
//         price: "0",
//         discountPercentage: "0",
//         location: "",
//         condition: "used",
//         stockQuantity: "1",
//         isNegotiable: false,
//         categoryId: "",
//         status: "published",
//       });
//       setOpen(false);
//       router.refresh();
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to create product listing. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
//           <PlusIcon className="mr-2 h-4 w-4" />
//           Add New Listing
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[1000px] h-[90vh] flex flex-col">
//         <form
//           onSubmit={handleSubmit}
//           className="flex flex-col h-full overflow-y-auto"
//         >
//           <DialogHeader className="flex-shrink-0 px-8 pt-6">
//             <DialogTitle className="text-2xl font-bold">
//               Create New Product Listing
//             </DialogTitle>
//             <DialogDescription className="text-lg text-gray-600">
//               Fill out the form below to add a new product listing. Required
//               fields are marked with *.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="flex-grow px-8 py-6 space-y-8">
//             <div className="border rounded-lg p-6 bg-gray-50 space-y-6">
//               <h3 className="text-xl font-semibold flex items-center gap-3">
//                 <PackageIcon className="h-6 w-6 text-cyan-600" />
//                 Basic Information
//               </h3>
//               <div className="grid gap-4">
//                 <div className="grid gap-2">
//                   <Label htmlFor="title">Title *</Label>
//                   <Input
//                     id="title"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="description">Description *</Label>
//                   <Textarea
//                     id="description"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     required
//                     rows={4}
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="categoryId">Category ID</Label>
//                   <Input
//                     id="categoryId"
//                     name="categoryId"
//                     value={formData.categoryId || ""}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="border rounded-lg p-6 bg-gray-50 space-y-6">
//               <h3 className="text-xl font-semibold flex items-center gap-3">
//                 <DollarSignIcon className="h-6 w-6 text-cyan-600" />
//                 Pricing
//               </h3>
//               <div className="grid gap-4 sm:grid-cols-2">
//                 <div className="grid gap-2">
//                   <Label htmlFor="price">Price *</Label>
//                   <Input
//                     id="price"
//                     name="price"
//                     type="text"
//                     value={formData.price}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="discountPercentage">
//                     Discount Percentage
//                   </Label>
//                   <Input
//                     id="discountPercentage"
//                     name="discountPercentage"
//                     type="text"
//                     value={formData.discountPercentage || ""}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="isNegotiable">Negotiable</Label>
//                   <Checkbox
//                     id="isNegotiable"
//                     checked={formData.isNegotiable}
//                     onCheckedChange={handleCheckboxChange}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="border rounded-lg p-6 bg-gray-50 space-y-6">
//               <h3 className="text-xl font-semibold flex items-center gap-3">
//                 <ImageIcon className="h-6 w-6 text-cyan-600" />
//                 Media
//               </h3>
//               <div className="flex flex-wrap gap-3">
//                 {formData.images.map((img, idx) => (
//                   <div key={idx} className="relative group">
//                     <img
//                       src={img}
//                       alt={`uploaded-${idx}`}
//                       className="w-20 h-20 object-cover rounded border"
//                     />
//                     <button
//                       type="button"
//                       className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
//                       onClick={() => handleImageRemove(idx)}
//                       aria-label="Remove image"
//                     >
//                       <Trash2Icon className="w-5 h-5 text-red-500" />
//                     </button>
//                   </div>
//                 ))}
//                 <button
//                   type="button"
//                   onClick={() => setGalleryOpen(true)}
//                   className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-cyan-400 rounded hover:bg-cyan-50 transition"
//                   aria-label="Add image"
//                 >
//                   <PlusIcon className="w-8 h-8 text-cyan-600" />
//                 </button>
//               </div>
//               <GalleryView
//                 modal={true}
//                 activeTab="library"
//                 onUseSelected={handleGallerySelect}
//                 modalOpen={galleryOpen}
//                 setModalOpen={setGalleryOpen}
//               />
//             </div>

//             <div className="border rounded-lg p-6 bg-gray-50 space-y-6">
//               <h3 className="text-xl font-semibold flex items-center gap-3">
//                 <PackageIcon className="h-6 w-6 text-cyan-600" />
//                 Additional Details
//               </h3>
//               <div className="grid gap-4 sm:grid-cols-2">
//                 <div className="grid gap-2">
//                   <Label htmlFor="location">Location *</Label>
//                   <Input
//                     id="location"
//                     name="location"
//                     value={formData.location}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="condition">Condition</Label>
//                   <Select
//                     name="condition"
//                     value={formData.condition}
//                     onValueChange={(value) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         condition: value as
//                           | "new"
//                           | "used"
//                           | "refurbished"
//                           | "for_parts",
//                       }))
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select condition" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="new">New</SelectItem>
//                       <SelectItem value="used">Used</SelectItem>
//                       <SelectItem value="refurbished">Refurbished</SelectItem>
//                       <SelectItem value="for_parts">For Parts</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="stockQuantity">Stock Quantity</Label>
//                   <Input
//                     id="stockQuantity"
//                     name="stockQuantity"
//                     type="text"
//                     value={formData.stockQuantity}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="status">Status</Label>
//                   <Select
//                     name="status"
//                     value={formData.status}
//                     onValueChange={(value) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         status: value as "published" | "draft" | "deleted",
//                       }))
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="published">Published</SelectItem>
//                       <SelectItem value="draft">Draft</SelectItem>
//                       <SelectItem value="deleted">Deleted</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <DialogFooter className="flex-shrink-0 mt-4 px-8 py-6">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setOpen(false)}
//               disabled={isSubmitting}
//               className="h-12 text-lg px-6"
//             >
//               <XIcon className="h-5 w-5 mr-2" />
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               className="h-12 text-lg px-6 bg-cyan-600 hover:bg-cyan-700"
//             >
//               {isSubmitting ? "Creating..." : "Create Listing"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

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
  DollarSign,
  ImageIcon,
  PackageIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createProducts } from "../actions/create.action";
import { InsertProduct } from "../schemas";

export function NewProducts() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InsertProduct>({
    title: "",
    description: "",
    images: [],
    price: "0",
    discountPercentage: "0",
    location: "",
    condition: "used",
    stockQuantity: "1",
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
      [name]: value,
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
      images: Array.isArray(prev.images)
        ? [...prev.images, ...selectedFiles.map((f) => f.url)]
        : [...selectedFiles.map((f) => f.url)],
    }));
    setGalleryOpen(false);

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.location.trim() ||
      formData.price === "0" ||
      formData.price.trim() === ""
    ) {
      toast.error(
        "Please fill in all required fields (Title, Description, Location, Price)"
      );

      return;
    }

    setIsSubmitting(true);

    try {

      await createProducts(formData);

      toast.success("Product listing created successfully!");
      setFormData({
        title: "",
        description: "",
        images: [],

        price: "0",
        discountPercentage: "0",
        location: "",
        condition: "used",
        stockQuantity: "1",
        isNegotiable: false,
        categoryId: "",
        status: "published",

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

        <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New Listing
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full overflow-y-auto"
        >
          <DialogHeader className="flex-shrink-0 px-8 pt-6">
            <DialogTitle className="text-2xl font-bold">
              Create New Product Listing
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-lg">
              Fill out the form below to add a new product listing. Required
              fields are marked with *.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-grow px-8 py-6 space-y-8">
            {/* Basic Information */}
            <section className="border rounded-lg p-6 bg-muted/50 space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <PackageIcon className="h-6 w-6 text-cyan-600" />
                Basic Information
              </h3>
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
                    placeholder="Enter product title"
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
                    required
                    rows={4}
                    placeholder="Enter product description"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="categoryId">Category ID</Label>
                  <Input
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId || ""}
                    onChange={handleChange}
                    placeholder="Enter category ID"
                  />
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section className="border rounded-lg p-6 bg-muted/50 space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-cyan-600" />
                Pricing
              </h3>
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
                    placeholder="Enter price"
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
                    value={formData.discountPercentage || ""}
                    onChange={handleChange}
                    placeholder="Enter discount %"
                  />
                </div>
                <div className="grid gap-2 flex items-center">
                  <Label htmlFor="isNegotiable" className="mb-0">
                    Negotiable
                  </Label>
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
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <ImageIcon className="h-6 w-6 text-cyan-600" />
                Media
              </h3>
              <div className="flex flex-wrap gap-3">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img}
                      alt={`uploaded-${idx}`}
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
                      onClick={() => handleImageRemove(idx)}
                      aria-label="Remove image"
                    >
                      <Trash2Icon className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setGalleryOpen(true)}
                  className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-cyan-400 rounded hover:bg-cyan-50 transition"
                  aria-label="Add image"
                >
                  <PlusIcon className="w-8 h-8 text-cyan-600" />
                </button>
              </div>
              <GalleryView
                modal={true}
                activeTab="library"
                onUseSelected={handleGallerySelect}
                modalOpen={galleryOpen}
                setModalOpen={setGalleryOpen}
              />
            </section>

            {/* Additional Details */}
            <section className="border rounded-lg p-6 bg-muted/50 space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <PackageIcon className="h-6 w-6 text-cyan-600" />
                Additional Details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
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
                    placeholder="Enter location"
                  />
                </div>
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
                    <SelectTrigger>
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
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input
                    id="stockQuantity"
                    name="stockQuantity"
                    type="text"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    placeholder="Enter stock quantity"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    name="status"
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: value as "published" | "draft" | "deleted",
                      }))
                    }
                  >
                    <SelectTrigger>
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

          <DialogFooter className="flex-shrink-0 mt-4 px-8 py-6">

            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}

              disabled={isSubmitting}
              className="h-12 text-lg px-6"
            >
              <XIcon className="h-5 w-5 mr-2" />

              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}

              className="h-12 text-lg px-6 bg-cyan-600 hover:bg-cyan-700"

            >
              {isSubmitting ? "Creating..." : "Create Listing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
