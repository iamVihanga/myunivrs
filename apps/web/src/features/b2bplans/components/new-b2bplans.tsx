// "use client";
// import GalleryView from "@/modules/media/components/gallery-view";
// import { Button } from "@repo/ui/components/button";
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
// import { Textarea } from "@repo/ui/components/textarea";
// import { PackageIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "sonner";
// import { z } from "zod";
// import { createB2bplans } from "../actions/create.action";
// import { InsertB2bplan, insertB2bplanSchema } from "../schemas";

// export function NewB2bplans() {
//   const router = useRouter();
//   const [open, setOpen] = useState(false);
//   const [galleryOpen, setGalleryOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState<InsertB2bplan>({
//     title: "",
//     description: "",
//     images: [],
//     prize: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value || undefined,
//     }));
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
//       images: [...prev.images, ...selectedFiles.map((f) => f.url)],
//     }));
//     setGalleryOpen(false);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       // Validate form data against schema
//       const validatedData = insertB2bplanSchema.parse({
//         ...formData,
//         description: formData.description || undefined,
//         images: formData.images.length > 0 ? formData.images : undefined,
//       });

//       setIsSubmitting(true);
//       await createB2bplans(validatedData);
//       toast.success("B2B plan listing created successfully!");
//       setFormData({
//         title: "",
//         description: "",
//         images: [],
//         prize: "",
//       });
//       setOpen(false);
//       // Redirect to plans list with page=1 to ensure new plan is visible
//       router.push("/dashboard/b2bplans?page=1");
//       router.refresh();
//     } catch (error) {
//       console.error("Form Submission Error:", error);
//       toast.error(
//         error instanceof z.ZodError
//           ? `Validation failed: ${onmessage}`
//           : error instanceof Error
//             ? error.message
//             : "Failed to create B2B plan listing. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button
//           size="sm"
//           className="bg-cyan-600 hover:bg-cyan-700 flex items-center gap-2"
//         >
//           <PlusIcon className="w-4 h-4" />
//           Add New B2B Plan
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col">
//         <form onSubmit={handleSubmit} className="flex flex-col h-full">
//           <DialogHeader className="flex-shrink-0">
//             <DialogTitle>Create New B2B Plan Listing</DialogTitle>
//             <DialogDescription>
//               Fill out the form below to add a new B2B plan listing. Required
//               fields are marked with *.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="flex-grow overflow-y-auto px-4">
//             {/* Section: Basic Information */}
//             <div className="mt-6">
//               <h3 className="text-lg font-semibold flex items-center gap-2">
//                 <PackageIcon className="h-5 w-5 text-cyan-600" />
//                 Basic Information
//               </h3>
//               <div className="grid gap-4 mt-4">
//                 <div className="grid gap-2">
//                   <Label htmlFor="title">
//                     Title <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     id="title"
//                     name="title"
//                     placeholder="Enter plan title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="description">Description</Label>
//                   <Textarea
//                     id="description"
//                     name="description"
//                     placeholder="Enter plan description"
//                     value={formData.description || ""}
//                     onChange={handleChange}
//                     rows={4}
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="prize">
//                     Price <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     id="prize"
//                     name="prize"
//                     placeholder="Enter plan price"
//                     value={formData.prize}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Section: Media */}
//             <div className="mt-6">
//               <h3 className="text-lg font-semibold flex items-center gap-2">
//                 <PackageIcon className="h-5 w-5 text-cyan-600" />
//                 Media
//               </h3>
//               <div className="grid gap-2 mt-4">
//                 <Label>Images</Label>
//                 <div className="flex flex-wrap gap-2">
//                   {formData.images.map((img, idx) => (
//                     <div key={idx} className="relative group">
//                       <img
//                         src={img}
//                         alt={`uploaded-${idx}`}
//                         className="w-16 h-16 object-cover rounded border"
//                       />
//                       <button
//                         type="button"
//                         className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
//                         onClick={() => handleImageRemove(idx)}
//                         aria-label="Remove image"
//                       >
//                         <Trash2Icon className="w-4 h-4 text-red-500" />
//                       </button>
//                     </div>
//                   ))}
//                   <button
//                     type="button"
//                     onClick={() => setGalleryOpen(true)}
//                     className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-cyan-400 rounded hover:bg-cyan-50 transition"
//                     aria-label="Add image"
//                   >
//                     <PlusIcon className="w-6 h-6 text-cyan-600" />
//                   </button>
//                 </div>
//               </div>
//               <GalleryView
//                 modal={true}
//                 activeTab="library"
//                 onUseSelected={handleGallerySelect}
//                 modalOpen={galleryOpen}
//                 setModalOpen={setGalleryOpen}
//               />
//             </div>
//           </div>

//           <DialogFooter className="flex-shrink-0 mt-6 px-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setOpen(false)}
//               disabled={isSubmitting}
//             >
//               <XIcon className="h-4 w-4 mr-2" />
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               className="bg-cyan-600 hover:bg-cyan-700"
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
  ImageIcon,
  PackageIcon,
  PlusIcon,
  Settings2Icon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { createB2bplans } from "../actions/create.action";
import { InsertB2bplan, insertB2bplanSchema } from "../schemas";

export function NewB2bplans() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InsertB2bplan>({
    title: "",
    description: "",
    images: [],
    prize: "",
    type: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || undefined,
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

    try {
      const validatedData = insertB2bplanSchema.parse({
        ...formData,
        description: formData.description || undefined,
        images: formData.images.length > 0 ? formData.images : undefined,
        type: formData.type || undefined,
      });

      setIsSubmitting(true);
      await createB2bplans(validatedData);
      toast.success("B2B plan listing created successfully!");
      setFormData({
        title: "",
        description: "",
        images: [],
        prize: "",
        type: "",
      });
      setOpen(false);
      router.push("/dashboard/b2bplans?page=1");
      router.refresh();
    } catch (error) {
      console.error("Form Submission Error:", error);
      toast.error(
        error instanceof z.ZodError
          ? "Validation failed"
          : error instanceof Error
            ? error.message
            : "Failed to create B2B plan listing. Please try again."
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
          Add New B2B Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="flex-shrink-0 px-8 pt-6">
            <DialogTitle className="text-2xl">Create New B2B Plan</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new B2B plan. Required fields
              are marked with *.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto px-8 py-6 space-y-8">
            {/* Section 1: Plan Overview */}
            <section className="space-y-6 p-6 border rounded-lg bg-muted/10">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <PackageIcon className="h-5 w-5 text-cyan-600" />
                Plan Overview
              </h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter a descriptive plan title"
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
                    placeholder="Describe the benefits and features of this plan"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Plan Details */}
            <section className="space-y-6 p-6 border rounded-lg bg-muted/10">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings2Icon className="h-5 w-5 text-cyan-600" />
                Plan Details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="type">
                    Plan Type <span className="text-red-500">*</span>
                  </Label>
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
                <div className="grid gap-2">
                  <Label htmlFor="prize">
                    Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="prize"
                    name="prize"
                    placeholder="Enter plan price"
                    value={formData.prize}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Section 3: Media Content */}
            <section className="space-y-6 p-6 border rounded-lg bg-muted/10">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-cyan-600" />
                Media Content
              </h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Plan Images</Label>
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
          </div>

          <DialogFooter className="flex-shrink-0 px-8 py-4 border-t">
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
              {isSubmitting ? "Creating..." : "Create Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
