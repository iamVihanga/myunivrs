// "use client";
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
// import { PlusIcon, XIcon } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "sonner";
// import { createSubforum } from "../actions/create.action";
// import { InsertSubforum } from "../schemas";

// export function NewSubforum() {
//   const router = useRouter();
//   const [open, setOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState<InsertSubforum>({
//     name: "",
//     description: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.name) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       await createSubforum(formData);
//       toast.success("Subforum created successfully!");
//       setFormData({
//         name: "",
//         description: "",
//       });
//       setOpen(false);
//       router.refresh();
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to create subforum. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
//           <PlusIcon className="mr-2 h-4 w-4" />
//           New Subforum
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[550px]">
//         <form onSubmit={handleSubmit}>
//           <DialogHeader>
//             <DialogTitle>Create New Subforum</DialogTitle>
//             <DialogDescription>
//               Fill out the form below to create a new subforum. Required fields
//               are marked with *.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-6 py-4">
//             <div className="space-y-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="name">
//                   Name <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="name"
//                   name="name"
//                   placeholder="Enter subforum name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea
//                   id="description"
//                   name="description"
//                   placeholder="Enter subforum description"
//                   value={formData.description || ""}
//                   onChange={handleChange}
//                   rows={4}
//                 />
//               </div>
//             </div>
//           </div>

//           <DialogFooter>
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
//               {isSubmitting ? "Creating..." : "Create Subforum"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";
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
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createSubforum } from "../actions/create.action";
import { InsertSubforum } from "../schemas";

export function NewSubforum() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InsertSubforum>({
    name: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !(formData.description ?? "").trim()) {
      toast.error("Community name and description are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createSubforum(formData);
      toast.success("Subforum created successfully!");
      setFormData({
        name: "",
        description: "",
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create subforum. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
          <PlusIcon className="mr-2 h-4 w-4" />
          New Community
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tell us about your community</DialogTitle>
            <DialogDescription>
              A name and description help people understand what your community
              is all about.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col md:flex-row gap-6 py-4">
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">
                    Community name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter community name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={21}
                  />
                  <span className="text-xs text-gray-500 text-right">
                    {formData.name.length}/21
                  </span>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Your community description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows={6}
                    maxLength={500}
                  />
                  <span className="text-xs text-gray-500 text-right">
                    {(formData.description ?? "").length}/500
                  </span>
                </div>
              </div>
            </div>

            {/* Right column for preview */}
            <div className="flex-1 min-w-[250px] p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-lg font-bold mr-2">
                  r/
                </div>
                <h4 className="font-semibold text-lg">
                  r/{formData.name || "communityname"}
                </h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                1 member • 1 online
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-200 mt-2">
                {formData.description || "Your community description"}
              </p>
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {isSubmitting ? "Creating..." : "Create Community"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
