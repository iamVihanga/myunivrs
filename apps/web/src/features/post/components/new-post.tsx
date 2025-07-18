// "use client";

// import GalleryView from "@/modules/media/components/gallery-view";
// import { Button } from "@repo/ui/components/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogTrigger,
// } from "@repo/ui/components/dialog";
// import { Input } from "@repo/ui/components/input";
// import { Label } from "@repo/ui/components/label";
// import { Textarea } from "@repo/ui/components/textarea";
// import { LinkIcon, PlusIcon, Trash2Icon } from "lucide-react"; // Removed ChevronDownIcon as it's no longer used for the select
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "sonner";
// import { createPost } from "../actions/create.action";
// import type { InsertPost } from "../schemas";

// const initialPostData: InsertPost = {
//   title: "",
//   content: "",
//   images: [],
//   url: "", // Initialize as empty string to match type 'string'
//   subforumId: "",
//   status: "published",
//   voteScore: 0,
// };

// // Removed Subforum interface as it's no longer needed for an input field
// // interface Subforum {
// //   id: string;
// //   name: string;
// // }

// export function NewPost() {
//   const router = useRouter();
//   const [open, setOpen] = useState(false);
//   const [galleryOpen, setGalleryOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState<InsertPost>(initialPostData);
//   // Removed subforums state and isLoadingSubforums state as they are no longer needed
//   // const [subforums, setSubforums] = useState<Subforum[]>([]);
//   // const [isLoadingSubforums, setIsLoadingSubforums] = useState(false);
//   const [selectedTab, setSelectedTab] = useState<
//     "text" | "images" | "link" | "poll"
//   >("text"); // State for tabs

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageRemove = (idx: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       images: (prev.images ?? []).filter((_, i) => i !== idx),
//     }));
//   };

//   const handleGallerySelect = (selectedFiles: { url: string }[]) => {
//     setFormData((prev) => ({
//       ...prev,
//       images: [...(prev.images ?? []), ...selectedFiles.map((f) => f.url)],
//     }));
//     setGalleryOpen(false);
//   };

//   // Function to handle tab change and clear irrelevant data
//   const handleTabChange = (tab: "text" | "images" | "link" | "poll") => {
//     setSelectedTab(tab);
//     setFormData((prev) => {
//       const newFormData = { ...prev };
//       if (tab !== "text") newFormData.content = "";
//       if (tab !== "images") newFormData.images = [];
//       if (tab !== "link") newFormData.url = "";
//       // If poll tab had specific fields, they would be cleared here too
//       return newFormData;
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // Basic validation
//       if (!formData.title.trim()) {
//         throw new Error("Title is required");
//       }

//       if (!formData.subforumId) {
//         throw new Error("Community ID is required"); // Updated error message
//       }

//       // Prepare submission data based on selected tab
//       const submissionData: InsertPost = {
//         ...formData,
//         url: "", // Reset URL to empty string by default
//         content: "", // Reset content to empty string by default
//         images: [], // Reset images to empty array by default
//       };

//       if (selectedTab === "text") {
//         if (!formData.content?.trim()) {
//           // Ensure content is not empty if text tab is selected
//           throw new Error("Content cannot be empty for text posts.");
//         }
//         submissionData.content = formData.content?.trim();
//       } else if (selectedTab === "images") {
//         if (!formData.images || formData.images.length === 0) {
//           // Ensure images exist if images tab is selected
//           throw new Error("At least one image is required for image posts.");
//         }
//         submissionData.images = formData.images;
//       } else if (selectedTab === "link") {
//         if (!formData.url?.trim()) {
//           // Ensure URL exists if link tab is selected
//           throw new Error("URL is required for link posts.");
//         }
//         submissionData.url = formData.url?.trim();
//       }
//       // Poll tab logic would go here if implemented, adding validation for poll fields

//       await createPost(submissionData);
//       toast.success("Post created successfully!");
//       setFormData(initialPostData);
//       setOpen(false);
//       router.refresh();
//     } catch (error) {
//       if (error instanceof Error) {
//         try {
//           const parsedError = JSON.parse(error.message);
//           if (parsedError.error?.issues) {
//             const issues = parsedError.error.issues.map((i: any) => i.message);
//             toast.error(issues.join("\n"));
//           } else {
//             toast.error(error.message);
//           }
//         } catch {
//           toast.error(error.message);
//         }
//       } else {
//         toast.error("Failed to create post");
//       }
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Removed useEffect for fetching subforums as it's no longer needed for an input field
//   // useEffect(() => {
//   //   const fetchSubforums = async () => {
//   //     if (!open) return;

//   //     setIsLoadingSubforums(true);
//   //     try {
//   //       const response = await fetch("/api/subforum");
//   //       if (!response.ok) throw new Error("Failed to fetch subforums");
//   //       const data = await response.json();
//   //       setSubforums(data);
//   //     } catch (error) {
//   //       console.error("Failed to fetch subforums:", error);
//   //       toast.error("Failed to load subforums");
//   //     } finally {
//   //       setIsLoadingSubforums(false);
//   //     }
//   //   };

//   //   fetchSubforums();
//   // }, [open]);

//   const MAX_TITLE_LENGTH = 300;

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
//           <PlusIcon className="h-4 w-4 mr-2" />
//           New Post
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[800px] p-0 gap-0 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-xl">
//         <form onSubmit={handleSubmit} className="flex flex-col h-full">
//           {/* Header */}
//           <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg">
//             <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
//               Create post
//             </DialogTitle>
//             <Button
//               variant="ghost"
//               className="text-gray-600 dark:text-gray-400"
//             >
//               Drafts
//             </Button>
//           </div>

//           {/* Input Community ID */}
//           <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
//             <div className="grid gap-2">
//               <Label
//                 htmlFor="subforumId"
//                 className="font-medium text-gray-900 dark:text-gray-100"
//               >
//                 Community ID <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 id="subforumId"
//                 name="subforumId"
//                 value={formData.subforumId}
//                 onChange={handleChange}
//                 placeholder="e.g., reactjs"
//                 required
//                 className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-md py-1.5 focus:ring-blue-500 focus:border-blue-500"
//               />
//               <p className="text-xs text-gray-500 dark:text-gray-400">
//                 Enter the ID of the community where you want to post (e.g.,
//                 "reactjs")
//               </p>
//             </div>
//           </div>

//           {/* Tabs for Post Type */}
//           <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
//             <TabButton
//               label="Text"
//               icon={<NewspaperIcon className="h-4 w-4 mr-1" />}
//               isActive={selectedTab === "text"}
//               onClick={() => handleTabChange("text")} // Use new handler
//             />
//             <TabButton
//               label="Images & Video"
//               icon={<ImageIcon className="h-4 w-4 mr-1" />}
//               isActive={selectedTab === "images"}
//               onClick={() => handleTabChange("images")} // Use new handler
//             />
//             <TabButton
//               label="Link"
//               icon={<LinkIcon className="h-4 w-4 mr-1" />}
//               isActive={selectedTab === "link"}
//               onClick={() => handleTabChange("link")} // Use new handler
//             />
//             <TabButton
//               label="Poll"
//               icon={<BarChart2Icon className="h-4 w-4 mr-1" />} // Using BarChart2Icon for poll
//               isActive={selectedTab === "poll"}
//               onClick={() => handleTabChange("poll")} // Use new handler
//             />
//           </div>

//           {/* Main Form Content */}
//           <div className="flex-1 p-4 bg-white dark:bg-gray-800">
//             {/* Title Input */}
//             <div className="relative mb-4">
//               <Input
//                 id="title"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 placeholder="Title*"
//                 maxLength={MAX_TITLE_LENGTH}
//                 required
//                 className="w-full p-3 text-lg font-medium border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
//               />
//               <span className="absolute bottom-2 right-3 text-xs text-gray-400">
//                 {formData.title.length}/{MAX_TITLE_LENGTH}
//               </span>
//             </div>

//             {/* Add Tags Button */}
//             <Button
//               variant="outline"
//               size="sm"
//               className="mb-4 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
//             >
//               Add tags
//             </Button>

//             {/* Conditional Content based on Tab */}
//             {selectedTab === "text" && (
//               <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
//                 {/* Rich Text Editor Toolbar (simplified) */}
//                 <div className="flex items-center p-2 bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   >
//                     <BoldIcon className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   >
//                     <ItalicIcon className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   >
//                     <StrikethroughIcon className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   >
//                     <CodeIcon className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   >
//                     <LinkIcon className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   >
//                     <ListIcon className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   >
//                     <ListOrderedIcon className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   >
//                     <QuoteIcon className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   >
//                     <Code2Icon className="h-4 w-4" />
//                   </Button>
//                   <span className="ml-auto text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
//                     Switch to Markdown Editor
//                   </span>
//                 </div>
//                 <Textarea
//                   id="content"
//                   name="content"
//                   value={formData.content}
//                   onChange={handleChange}
//                   placeholder="Body text (optional)"
//                   rows={10}
//                   className="w-full p-3 border-none focus:ring-0 resize-y min-h-[150px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
//                 />
//               </div>
//             )}

//             {selectedTab === "images" && (
//               <div className="grid gap-2 border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-gray-800">
//                 <Label className="font-medium text-gray-900 dark:text-gray-100">
//                   Images
//                 </Label>
//                 <div className="flex flex-wrap gap-2">
//                   {(formData.images ?? []).map((img, idx) => (
//                     <div key={idx} className="relative group">
//                       <img
//                         src={img}
//                         alt={`uploaded-${idx}`}
//                         className="w-24 h-24 object-cover rounded border border-gray-200 dark:border-gray-700"
//                       />
//                       <button
//                         type="button"
//                         className="absolute top-1 right-1 bg-white dark:bg-gray-900 bg-opacity-80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
//                     className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-blue-400 dark:border-blue-600 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors text-blue-600 dark:text-blue-400"
//                     aria-label="Add image"
//                   >
//                     <PlusIcon className="w-8 h-8" />
//                   </button>
//                 </div>
//               </div>
//             )}

//             {selectedTab === "link" && (
//               <div className="grid gap-2 border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-gray-800">
//                 <Label
//                   htmlFor="url"
//                   className="font-medium text-gray-900 dark:text-gray-100"
//                 >
//                   URL
//                 </Label>
//                 <div className="relative">
//                   <Input
//                     id="url"
//                     name="url"
//                     type="url"
//                     value={formData.url}
//                     onChange={handleChange}
//                     placeholder="https://example.com"
//                     className="pl-9 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
//                     pattern="https?://.*"
//                     title="Please enter a valid URL starting with http:// or https://"
//                   />
//                   <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 </div>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                   Include a link to share (must start with http:// or https://)
//                 </p>
//               </div>
//             )}

//             {selectedTab === "poll" && (
//               <div className="grid gap-4 border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-gray-800">
//                 {/* Poll Question */}
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="poll-question"
//                     className="font-medium text-gray-900 dark:text-gray-100"
//                   >
//                     Question
//                   </Label>
//                   <Input
//                     id="poll-question"
//                     value={pollData.question}
//                     onChange={handlePollQuestionChange}
//                     placeholder="Ask a question..."
//                     className="bg-gray-50 dark:bg-gray-700"
//                   />
//                 </div>

//                 {/* Poll Options */}
//                 <div className="space-y-2">
//                   <Label className="font-medium text-gray-900 dark:text-gray-100">
//                     Options
//                   </Label>
//                   <div className="space-y-2">
//                     {pollData.options.map((option, index) => (
//                       <div key={index} className="flex gap-2">
//                         <Input
//                           value={option.optionText}
//                           onChange={(e) =>
//                             handlePollOptionChange(index, e.target.value)
//                           }
//                           placeholder={`Option ${index + 1}`}
//                           className="bg-gray-50 dark:bg-gray-700"
//                         />
//                         {pollData.options.length > 2 && (
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => removePollOption(index)}
//                             className="text-red-500 hover:text-red-600"
//                           >
//                             <XCircleIcon className="h-5 w-5" />
//                           </Button>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                   {pollData.options.length < 6 && (
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={addPollOption}
//                       className="mt-2"
//                     >
//                       <PlusCircleIcon className="h-4 w-4 mr-2" />
//                       Add Option
//                     </Button>
//                   )}
//                 </div>

//                 {/* Poll Duration */}
//                 <div className="space-y-2">
//                   <Label className="font-medium text-gray-900 dark:text-gray-100">
//                     Poll Duration
//                   </Label>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className={cn(
//                           "w-full justify-start text-left font-normal",
//                           !pollData.expiresAt && "text-muted-foreground"
//                         )}
//                       >
//                         <CalendarIcon className="mr-2 h-4 w-4" />
//                         {pollData.expiresAt
//                           ? format(pollData.expiresAt, "PPP")
//                           : "Select end date"}
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={pollData.expiresAt || undefined}
//                         onSelect={(date) =>
//                           setPollData((prev) => ({ ...prev, expiresAt: date }))
//                         }
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     Optional: Select when the poll should end
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Footer with Action Buttons */}
//           <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg">
//             <Button
//               type="button"
//               variant="outline"
//               className="px-4 py-2 text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900"
//               onClick={() => setOpen(false)}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "Posting..." : "Post"}
//             </Button>
//           </div>
//         </form>

//         <GalleryView
//           modal={true}
//           activeTab="library"
//           onUseSelected={handleGallerySelect}
//           modalOpen={galleryOpen}
//           setModalOpen={setGalleryOpen}
//         />
//       </DialogContent>
//     </Dialog>
//   );
// }

// // Helper component for tabs
// interface TabButtonProps {
//   label: string;
//   icon: React.ReactNode;
//   isActive: boolean;
//   onClick: () => void;
// }

// function TabButton({ label, icon, isActive, onClick }: TabButtonProps) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`flex items-center justify-center flex-1 py-3 px-4 text-sm font-semibold border-b-2 transition-colors duration-200
//         ${
//           isActive
//             ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
//             : "border-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
//         }`}
//     >
//       {icon}
//       {label}
//     </button>
//   );
// }

// // Import additional icons needed for the rich text editor toolbar
// import {
//   BarChart2Icon,
//   BoldIcon,
//   Code2Icon,
//   CodeIcon,
//   ImageIcon,
//   ItalicIcon,
//   ListIcon,
//   ListOrderedIcon, // For Poll tab
//   NewspaperIcon, // For Text tab
//   QuoteIcon,
//   StrikethroughIcon,
// } from "lucide-react";

////////////////////////////////////////////////

// "use client";

// import GalleryView from "@/modules/media/components/gallery-view";
// import { Button } from "@repo/ui/components/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogTrigger,
// } from "@repo/ui/components/dialog";
// import { Input } from "@repo/ui/components/input";
// import { Label } from "@repo/ui/components/label";
// import { Textarea } from "@repo/ui/components/textarea";
// import {
//   BarChart2Icon,
//   BoldIcon,
//   Code2Icon,
//   CodeIcon,
//   ImageIcon,
//   ItalicIcon,
//   LinkIcon,
//   ListIcon,
//   ListOrderedIcon,
//   NewspaperIcon,
//   PlusIcon,
//   QuoteIcon,
//   SearchIcon,
//   StrikethroughIcon,
//   Trash2Icon,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { createPost } from "../actions/create.action";
// import type { InsertPost } from "../schemas";

// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList, // Import CommandList to make the scrollable area explicit
// } from "@repo/ui/components/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@repo/ui/components/popover";
// import { cn } from "@repo/ui/lib/utils";
// import { CheckIcon, ChevronDownIcon } from "lucide-react"; // Changed ChevronsUpDownIcon to ChevronDownIcon for the single dropdown icon

// const initialPostData: InsertPost = {
//   title: "",
//   content: "",
//   images: [],
//   url: "",
//   subforumId: "",
//   status: "published",
//   voteScore: 0,
// };

// // Define the Subforum interface with an optional members count
// interface Subforum {
//   id: string;
//   name: string;
//   members?: number; // Added optional members count
// }

// export function NewPost() {
//   const router = useRouter();
//   const [open, setOpen] = useState(false);
//   const [galleryOpen, setGalleryOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState<InsertPost>(initialPostData);
//   const [subforums, setSubforums] = useState<Subforum[]>([]);
//   const [isLoadingSubforums, setIsLoadingSubforums] = useState(false);
//   const [selectedTab, setSelectedTab] = useState<
//     "text" | "images" | "link" | "poll"
//   >("text");

//   const [comboboxOpen, setComboboxOpen] = useState(false);
//   const [communitySearchTerm, setCommunitySearchTerm] = useState(""); // State for search term in CommandInput

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageRemove = (idx: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       images: (prev.images ?? []).filter((_, i) => i !== idx),
//     }));
//   };

//   const handleGallerySelect = (selectedFiles: { url: string }[]) => {
//     setFormData((prev) => ({
//       ...prev,
//       images: [...(prev.images ?? []), ...selectedFiles.map((f) => f.url)],
//     }));
//     setGalleryOpen(false);
//   };

//   const handleTabChange = (tab: "text" | "images" | "link" | "poll") => {
//     setSelectedTab(tab);
//     setFormData((prev) => {
//       const newFormData = { ...prev };
//       if (tab !== "text") newFormData.content = "";
//       if (tab !== "images") newFormData.images = [];
//       if (tab !== "link") newFormData.url = "";
//       return newFormData;
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       if (!formData.title.trim()) {
//         throw new Error("Title is required");
//       }

//       if (!formData.subforumId) {
//         throw new Error("Community is required");
//       }

//       const submissionData: InsertPost = {
//         ...formData,
//         url: "",
//         content: "",
//         images: [],
//       };

//       if (selectedTab === "text") {
//         if (!formData.content?.trim()) {
//           throw new Error("Content cannot be empty for text posts.");
//         }
//         submissionData.content = formData.content?.trim();
//       } else if (selectedTab === "images") {
//         if (!formData.images || formData.images.length === 0) {
//           throw new Error("At least one image is required for image posts.");
//         }
//         submissionData.images = formData.images;
//       } else if (selectedTab === "link") {
//         if (!formData.url?.trim()) {
//           throw new Error("URL is required for link posts.");
//         }
//         submissionData.url = formData.url?.trim();
//       }

//       await createPost(submissionData);
//       toast.success("Post created successfully!");
//       setFormData(initialPostData);
//       setOpen(false);
//       router.refresh();
//     } catch (error) {
//       if (error instanceof Error) {
//         try {
//           const parsedError = JSON.parse(error.message);
//           if (parsedError.error?.issues) {
//             const issues = parsedError.error.issues.map((i: any) => i.message);
//             toast.error(issues.join("\n"));
//           } else {
//             toast.error(error.message);
//           }
//         } catch {
//           toast.error(error.message);
//         }
//       } else {
//         toast.error("Failed to create post");
//       }
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   useEffect(() => {
//     const fetchSubforums = async () => {
//       if (!open) return;

//       setIsLoadingSubforums(true);
//       try {
//         const response = await fetch("/api/subforum");
//         if (!response.ok) throw new Error("Failed to fetch subforums");
//         const data = await response.json();
//         // Assuming your API response data structure might include members for each subforum
//         // For demonstration, I'll add some dummy members data if it's not present
//         const fetchedSubforums = data.data.map((sf: Subforum) => ({
//           ...sf,
//           members: sf.members || Math.floor(Math.random() * 200000) + 1000, // Dummy members
//         }));
//         setSubforums(fetchedSubforums);
//       } catch (error) {
//         console.error("Failed to fetch subforums:", error);
//         toast.error("Failed to load communities");
//       } finally {
//         setIsLoadingSubforums(false);
//       }
//     };

//     fetchSubforums();
//   }, [open]);

//   const MAX_TITLE_LENGTH = 300;

//   // Filtered subforums based on search term
//   const filteredSubforums = subforums.filter((subforum) =>
//     subforum.name.toLowerCase().includes(communitySearchTerm.toLowerCase())
//   );

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
//           <PlusIcon className="h-4 w-4 mr-2" />
//           New Post
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[800px] p-0 gap-0 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-xl">
//         <form onSubmit={handleSubmit} className="flex flex-col h-full">
//           {/* Header */}
//           <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg">
//             <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
//               Create post
//             </DialogTitle>
//             <Button
//               variant="ghost"
//               className="text-gray-600 dark:text-gray-400"
//             >
//               Drafts
//             </Button>
//           </div>

//           {/* Select Community */}
//           <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
//             <div className="grid gap-2">
//               {/* Removed explicit Label for "Choose a Community" to match Reddit's UI */}
//               <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
//                 <PopoverTrigger asChild>
//                   {/* Styled Button to mimic Reddit's select input */}
//                   <Button
//                     variant="outline"
//                     role="combobox"
//                     aria-expanded={comboboxOpen}
//                     className="w-full justify-start rounded-full pl-3 pr-2 py-2 h-auto text-left
//                                bg-gray-100 dark:bg-gray-700
//                                border border-gray-300 dark:border-gray-600
//                                text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400
//                                hover:bg-gray-200 dark:hover:bg-gray-600
//                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent
//                                transition-colors duration-150"
//                     disabled={isLoadingSubforums}
//                   >
//                     {/* Reddit 'r/' Icon Placeholder - Replace with your actual icon */}
//                     <div className="flex items-center space-x-2">
//                       {/* You can replace this div with an actual Reddit 'r/' SVG or Image */}
//                       <div className="w-6 h-6 rounded-full flex items-center justify-center bg-black text-white text-xs font-bold mr-1">
//                         r/
//                       </div>
//                       {formData.subforumId
//                         ? subforums.find(
//                             (subforum) => subforum.id === formData.subforumId
//                           )?.name
//                         : isLoadingSubforums
//                           ? "Loading communities..."
//                           : "Select a community"}
//                     </div>
//                     {/* ChevronDownIcon on the right */}
//                     <ChevronDownIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
//                   <Command>
//                     {/* Custom CommandInput for the search bar like Reddit */}
//                     <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-3 py-2">
//                       <SearchIcon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
//                       <CommandInput
//                         placeholder="Search community"
//                         value={communitySearchTerm}
//                         onValueChange={setCommunitySearchTerm}
//                         className="flex-1 border-none focus:ring-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
//                       />
//                     </div>
//                     <CommandList className="max-h-[250px] overflow-y-auto">
//                       <CommandEmpty>No community found.</CommandEmpty>
//                       <CommandGroup>
//                         {/* Display User Profile Option if applicable (like Reddit) */}
//                         <CommandItem
//                           onSelect={() => {
//                             // Logic for selecting user profile (if you have a user profile ID)
//                             // For now, it just closes the combobox
//                             setComboboxOpen(false);
//                             toast.info(
//                               "User profile selection not implemented."
//                             );
//                           }}
//                           className="px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
//                         >
//                           {/* User Profile Icon/Avatar Placeholder */}
//                           <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white mr-2">
//                             u/
//                           </div>
//                           <div className="flex flex-col">
//                             <span className="text-sm font-medium">
//                               u/Extreme_Look7882
//                             </span>
//                             <span className="text-xs text-gray-500 dark:text-gray-400">
//                               Your profile
//                             </span>
//                           </div>
//                         </CommandItem>

//                         {/* Subforum Items */}
//                         {filteredSubforums.map((subforum) => (
//                           <CommandItem
//                             key={subforum.id}
//                             value={subforum.name}
//                             onSelect={() => {
//                               setFormData((prev) => ({
//                                 ...prev,
//                                 subforumId: subforum.id,
//                               }));
//                               setComboboxOpen(false);
//                             }}
//                             className="px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
//                           >
//                             {/* Reddit 'r/' Icon Placeholder or actual community icon */}
//                             {/* For a more accurate Reddit look, each community would have its own icon */}
//                             <div className="w-6 h-6 rounded-full flex items-center justify-center bg-orange-600 text-white text-xs font-bold mr-2">
//                               r/
//                             </div>
//                             <div className="flex flex-col">
//                               <span className="text-sm font-medium">
//                                 r/{subforum.name}
//                               </span>
//                               {subforum.members !== undefined && (
//                                 <span className="text-xs text-gray-500 dark:text-gray-400">
//                                   {subforum.members.toLocaleString()} members
//                                   {formData.subforumId === subforum.id && (
//                                     <span className="ml-2 text-blue-500">
//                                       {" "}
//                                       • Subscribed
//                                     </span>
//                                   )}
//                                 </span>
//                               )}
//                             </div>
//                             <CheckIcon
//                               className={cn(
//                                 "ml-auto h-4 w-4",
//                                 formData.subforumId === subforum.id
//                                   ? "opacity-100 text-blue-500"
//                                   : "opacity-0"
//                               )}
//                             />
//                           </CommandItem>
//                         ))}
//                       </CommandGroup>
//                     </CommandList>
//                   </Command>
//                 </PopoverContent>
//               </Popover>
//               {/* Removed the descriptive text "Select the community where you want to post." */}
//             </div>
//           </div>

//           {/* Tabs for Post Type */}
//           <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
//             <TabButton
//               label="Text"
//               icon={<NewspaperIcon className="h-4 w-4 mr-1" />}
//               isActive={selectedTab === "text"}
//               onClick={() => handleTabChange("text")}
//             />
//             <TabButton
//               label="Images & Video"
//               icon={<ImageIcon className="h-4 w-4 mr-1" />}
//               isActive={selectedTab === "images"}
//               onClick={() => handleTabChange("images")}
//             />
//             <TabButton
//               label="Link"
//               icon={<LinkIcon className="h-4 w-4 mr-1" />}
//               isActive={selectedTab === "link"}
//               onClick={() => handleTabChange("link")}
//             />
//             <TabButton
//               label="Poll"
//               icon={<BarChart2Icon className="h-4 w-4 mr-1" />}
//               isActive={selectedTab === "poll"}
//               onClick={() => handleTabChange("poll")}
//             />
//           </div>

//           {/* Main Form Content */}
//           <div className="flex-1 p-4 bg-white dark:bg-gray-800">
//             {/* Title Input */}
//             <div className="relative mb-4">
//               <Input
//                 id="title"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 placeholder="Title*"
//                 maxLength={MAX_TITLE_LENGTH}
//                 required
//                 className="w-full p-3 text-lg font-medium border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
//               />
//               <span className="absolute bottom-2 right-3 text-xs text-gray-400">
//                 {formData.title.length}/{MAX_TITLE_LENGTH}
//               </span>
//             </div>

//             {/* Add Tags Button */}
//             <Button
//               variant="outline"
//               size="sm"
//               className="mb-4 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
//             >
//               Add tags
//             </Button>

//             {/* Conditional Content based on Tab */}
//             {selectedTab === "text" && (
//               <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
//                 {/* Rich Text Editor Toolbar (simplified) */}
//                 <div className="flex items-center p-2 bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   >
//                     <BoldIcon className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   >
//                     <ItalicIcon className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   >
//                     <StrikethroughIcon className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   >
//                     <CodeIcon className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   >
//                     <LinkIcon className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   >
//                     <ListIcon className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   >
//                     <ListOrderedIcon className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   >
//                     <QuoteIcon className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                   >
//                     <Code2Icon className="h-4 w-4" />
//                   </Button>
//                   <span className="ml-auto text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
//                     Switch to Markdown Editor
//                   </span>
//                 </div>
//                 <Textarea
//                   id="content"
//                   name="content"
//                   value={formData.content}
//                   onChange={handleChange}
//                   placeholder="Body text (optional)"
//                   rows={10}
//                   className="w-full p-3 border-none focus:ring-0 resize-y min-h-[150px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
//                 />
//               </div>
//             )}

//             {selectedTab === "images" && (
//               <div className="grid gap-2 border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-gray-800">
//                 <Label className="font-medium text-gray-900 dark:text-gray-100">
//                   Images
//                 </Label>
//                 <div className="flex flex-wrap gap-2">
//                   {(formData.images ?? []).map((img, idx) => (
//                     <div key={idx} className="relative group">
//                       <img
//                         src={img}
//                         alt={`uploaded-${idx}`}
//                         className="w-24 h-24 object-cover rounded border border-gray-200 dark:border-gray-700"
//                       />
//                       <button
//                         type="button"
//                         className="absolute top-1 right-1 bg-white dark:bg-gray-900 bg-opacity-80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
//                     className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-blue-400 dark:border-blue-600 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors text-blue-600 dark:text-blue-400"
//                     aria-label="Add image"
//                   >
//                     <PlusIcon className="w-8 h-8" />
//                   </button>
//                 </div>
//               </div>
//             )}

//             {selectedTab === "link" && (
//               <div className="grid gap-2 border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-gray-800">
//                 <Label
//                   htmlFor="url"
//                   className="font-medium text-gray-900 dark:text-gray-100"
//                 >
//                   URL
//                 </Label>
//                 <div className="relative">
//                   <Input
//                     id="url"
//                     name="url"
//                     type="url"
//                     value={formData.url}
//                     onChange={handleChange}
//                     placeholder="https://example.com"
//                     className="pl-9 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
//                     pattern="https?://.*"
//                     title="Please enter a valid URL starting with http:// or https://"
//                   />
//                   <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 </div>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                   Include a link to share (must start with http:// or https://)
//                 </p>
//               </div>
//             )}

//             {selectedTab === "poll" && (
//               <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400">
//                 <p>Poll creation functionality would go here.</p>
//                 <p className="text-sm mt-2">
//                   (This tab is for demonstration; actual poll fields would be
//                   implemented.)
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Footer with Action Buttons */}
//           <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg">
//             <Button
//               type="button"
//               variant="outline"
//               className="px-4 py-2 text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900"
//               onClick={() => setOpen(false)}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "Posting..." : "Post"}
//             </Button>
//           </div>
//         </form>

//         <GalleryView
//           modal={true}
//           activeTab="library"
//           onUseSelected={handleGallerySelect}
//           modalOpen={galleryOpen}
//           setModalOpen={setGalleryOpen}
//         />
//       </DialogContent>
//     </Dialog>
//   );
// }

// // Helper component for tabs (remains the same)
// interface TabButtonProps {
//   label: string;
//   icon: React.ReactNode;
//   isActive: boolean;
//   onClick: () => void;
// }

// function TabButton({ label, icon, isActive, onClick }: TabButtonProps) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`flex items-center justify-center flex-1 py-3 px-4 text-sm font-semibold border-b-2 transition-colors duration-200
//         ${
//           isActive
//             ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
//             : "border-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
//         }`}
//     >
//       {icon}
//       {label}
//     </button>
//   );
// }

"use client";

import GalleryView from "@/modules/media/components/gallery-view";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";
import {
  BarChart2Icon,
  BoldIcon,
  Code2Icon,
  CodeIcon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  NewspaperIcon,
  PlusIcon,
  QuoteIcon,
  SearchIcon,
  StrikethroughIcon,
  Trash2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createPost } from "../actions/create.action";
import type { InsertPost } from "../schemas";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList, // Import CommandList to make the scrollable area explicit
} from "@repo/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { cn } from "@repo/ui/lib/utils";
import { CheckIcon, ChevronDownIcon } from "lucide-react"; // Changed ChevronsUpDownIcon to ChevronDownIcon for the single dropdown icon

// --- START: Poll Feature Implementation ---

// Extend InsertPost to include poll-related fields
interface InsertPostWithPoll extends InsertPost {
  pollOptions?: string[]; // Array to store poll options
  pollDuration?: number; // Duration of the poll in minutes (or hours/days, adjust as needed)
}

const initialPostData: InsertPostWithPoll = {
  title: "",
  content: "",
  images: [],
  url: "",
  subforumId: "",
  status: "published",
  voteScore: 0,
  pollOptions: ["", ""], // Start with two empty options for a poll
  pollDuration: 1440, // Default poll duration (e.g., 24 hours in minutes)
};

// --- END: Poll Feature Implementation ---

// Define the Subforum interface with an optional members count
interface Subforum {
  id: string;
  name: string;
  members?: number; // Added optional members count
}

export function NewPost() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Use InsertPostWithPoll for formData
  const [formData, setFormData] = useState<InsertPostWithPoll>(initialPostData);
  const [subforums, setSubforums] = useState<Subforum[]>([]);
  const [isLoadingSubforums, setIsLoadingSubforums] = useState(false);
  const [selectedTab, setSelectedTab] = useState<
    "text" | "images" | "link" | "poll"
  >("text");

  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [communitySearchTerm, setCommunitySearchTerm] = useState(""); // State for search term in CommandInput

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- START: Poll Feature Implementation ---
  const handlePollOptionChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newOptions = [...(prev.pollOptions || [])];
      newOptions[index] = value;
      return { ...prev, pollOptions: newOptions };
    });
  };

  const handleAddPollOption = () => {
    setFormData((prev) => ({
      ...prev,
      pollOptions: [...(prev.pollOptions || []), ""],
    }));
  };

  const handleRemovePollOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pollOptions: (prev.pollOptions || []).filter((_, i) => i !== index),
    }));
  };

  const handlePollDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      pollDuration: parseInt(e.target.value, 10),
    }));
  };
  // --- END: Poll Feature Implementation ---

  const handleImageRemove = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images ?? []).filter((_, i) => i !== idx),
    }));
  };

  const handleGallerySelect = (selectedFiles: { url: string }[]) => {
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images ?? []), ...selectedFiles.map((f) => f.url)],
    }));
    setGalleryOpen(false);
  };

  const handleTabChange = (tab: "text" | "images" | "link" | "poll") => {
    setSelectedTab(tab);
    setFormData((prev) => {
      const newFormData: InsertPostWithPoll = { ...prev };
      // Clear fields not relevant to the new tab
      if (tab !== "text") newFormData.content = "";
      if (tab !== "images") newFormData.images = [];
      if (tab !== "link") newFormData.url = "";
      // --- START: Poll Feature Implementation ---
      if (tab !== "poll") {
        newFormData.pollOptions = initialPostData.pollOptions; // Reset poll options
        newFormData.pollDuration = initialPostData.pollDuration; // Reset poll duration
      }
      // --- END: Poll Feature Implementation ---
      return newFormData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }

      if (!formData.subforumId) {
        throw new Error("Community is required");
      }

      // --- START: Poll Feature Implementation ---
      // Create submissionData with the extended interface
      const submissionData: InsertPostWithPoll = {
        ...formData,
        // Ensure only relevant fields are passed based on the selected tab
        url: selectedTab === "link" ? formData.url : "",
        content: selectedTab === "text" ? formData.content : "",
        images: selectedTab === "images" ? formData.images : [],
        pollOptions: selectedTab === "poll" ? formData.pollOptions : [],
        pollDuration:
          selectedTab === "poll" ? formData.pollDuration : undefined,
      };
      // --- END: Poll Feature Implementation ---

      if (selectedTab === "text") {
        if (!submissionData.content?.trim()) {
          throw new Error("Content cannot be empty for text posts.");
        }
      } else if (selectedTab === "images") {
        if (!submissionData.images || submissionData.images.length === 0) {
          throw new Error("At least one image is required for image posts.");
        }
      } else if (selectedTab === "link") {
        if (!submissionData.url?.trim()) {
          throw new Error("URL is required for link posts.");
        }
      }
      // --- START: Poll Feature Implementation ---
      else if (selectedTab === "poll") {
        const validOptions = (submissionData.pollOptions || []).filter(
          (option) => option.trim() !== ""
        );
        if (validOptions.length < 2) {
          throw new Error("A poll must have at least two options.");
        }
        submissionData.pollOptions = validOptions; // Only send valid options
        if (!submissionData.pollDuration || submissionData.pollDuration <= 0) {
          throw new Error("Poll duration must be a positive number.");
        }
      }
      // --- END: Poll Feature Implementation ---

      // Cast submissionData back to InsertPost if your createPost action expects only InsertPost
      // If your backend schema for `createPost` can handle `pollOptions` and `pollDuration`,
      // then you don't need this casting. For now, we'll assume `createPost` needs only `InsertPost`
      // and you'd handle poll-specific data separately or extend `InsertPost` in `schemas.ts`.
      // For this implementation, we'll pass `submissionData` directly as it's typed to handle it.
      await createPost(submissionData);
      toast.success("Post created successfully!");
      setFormData(initialPostData);
      setOpen(false);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        try {
          const parsedError = JSON.parse(error.message);
          if (parsedError.error?.issues) {
            const issues = parsedError.error.issues.map((i: any) => i.message);
            toast.error(issues.join("\n"));
          } else {
            toast.error(error.message);
          }
        } catch {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to create post");
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchSubforums = async () => {
      if (!open) return;

      setIsLoadingSubforums(true);
      try {
        const response = await fetch("/api/subforum");
        if (!response.ok) throw new Error("Failed to fetch subforums");
        const data = await response.json();
        // Assuming your API response data structure might include members for each subforum
        // For demonstration, I'll add some dummy members data if it's not present
        const fetchedSubforums = data.data.map((sf: Subforum) => ({
          ...sf,
          members: sf.members || Math.floor(Math.random() * 200000) + 1000, // Dummy members
        }));
        setSubforums(fetchedSubforums);
      } catch (error) {
        console.error("Failed to fetch subforums:", error);
        toast.error("Failed to load communities");
      } finally {
        setIsLoadingSubforums(false);
      }
    };

    fetchSubforums();
  }, [open]);

  const MAX_TITLE_LENGTH = 300;

  // Filtered subforums based on search term
  const filteredSubforums = subforums.filter((subforum) =>
    subforum.name.toLowerCase().includes(communitySearchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <PlusIcon className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 gap-0 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-xl">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg">
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Create post
            </DialogTitle>
            <Button
              variant="ghost"
              className="text-gray-600 dark:text-gray-400"
            >
              Drafts
            </Button>
          </div>

          {/* Select Community */}
          <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="grid gap-2">
              {/* Removed explicit Label for "Choose a Community" to match Reddit's UI */}
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  {/* Styled Button to mimic Reddit's select input */}
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    className="w-full justify-start rounded-full pl-3 pr-2 py-2 h-auto text-left
                                 bg-gray-100 dark:bg-gray-700
                                 border border-gray-300 dark:border-gray-600
                                 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400
                                 hover:bg-gray-200 dark:hover:bg-gray-600
                                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent
                                 transition-colors duration-150"
                    disabled={isLoadingSubforums}
                  >
                    {/* Reddit 'r/' Icon Placeholder - Replace with your actual icon */}
                    <div className="flex items-center space-x-2">
                      {/* You can replace this div with an actual Reddit 'r/' SVG or Image */}
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-black text-white text-xs font-bold mr-1">
                        r/
                      </div>
                      {formData.subforumId
                        ? subforums.find(
                            (subforum) => subforum.id === formData.subforumId
                          )?.name
                        : isLoadingSubforums
                          ? "Loading communities..."
                          : "Select a community"}
                    </div>
                    {/* ChevronDownIcon on the right */}
                    <ChevronDownIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
                  <Command>
                    {/* Custom CommandInput for the search bar like Reddit */}
                    <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-3 py-2">
                      <SearchIcon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <CommandInput
                        placeholder="Search community"
                        value={communitySearchTerm}
                        onValueChange={setCommunitySearchTerm}
                        className="flex-1 border-none focus:ring-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      />
                    </div>
                    <CommandList className="max-h-[250px] overflow-y-auto">
                      <CommandEmpty>No community found.</CommandEmpty>
                      <CommandGroup>
                        {/* Display User Profile Option if applicable (like Reddit) */}
                        <CommandItem
                          onSelect={() => {
                            // Logic for selecting user profile (if you have a user profile ID)
                            // For now, it just closes the combobox
                            setComboboxOpen(false);
                            toast.info(
                              "User profile selection not implemented."
                            );
                          }}
                          className="px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {/* User Profile Icon/Avatar Placeholder */}
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white mr-2">
                            u/
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              u/Extreme_Look7882
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Your profile
                            </span>
                          </div>
                        </CommandItem>

                        {/* Subforum Items */}
                        {filteredSubforums.map((subforum) => (
                          <CommandItem
                            key={subforum.id}
                            value={subforum.name}
                            onSelect={() => {
                              setFormData((prev) => ({
                                ...prev,
                                subforumId: subforum.id,
                              }));
                              setComboboxOpen(false);
                            }}
                            className="px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {/* Reddit 'r/' Icon Placeholder or actual community icon */}
                            {/* For a more accurate Reddit look, each community would have its own icon */}
                            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-orange-600 text-white text-xs font-bold mr-2">
                              r/
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                r/{subforum.name}
                              </span>
                              {subforum.members !== undefined && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {subforum.members.toLocaleString()} members
                                  {formData.subforumId === subforum.id && (
                                    <span className="ml-2 text-blue-500">
                                      {" "}
                                      • Subscribed
                                    </span>
                                  )}
                                </span>
                              )}
                            </div>
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                formData.subforumId === subforum.id
                                  ? "opacity-100 text-blue-500"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {/* Removed the descriptive text "Select the community where you want to post." */}
            </div>
          </div>

          {/* Tabs for Post Type */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <TabButton
              label="Text"
              icon={<NewspaperIcon className="h-4 w-4 mr-1" />}
              isActive={selectedTab === "text"}
              onClick={() => handleTabChange("text")}
            />
            <TabButton
              label="Images & Video"
              icon={<ImageIcon className="h-4 w-4 mr-1" />}
              isActive={selectedTab === "images"}
              onClick={() => handleTabChange("images")}
            />
            <TabButton
              label="Link"
              icon={<LinkIcon className="h-4 w-4 mr-1" />}
              isActive={selectedTab === "link"}
              onClick={() => handleTabChange("link")}
            />
            <TabButton
              label="Poll"
              icon={<BarChart2Icon className="h-4 w-4 mr-1" />}
              isActive={selectedTab === "poll"}
              onClick={() => handleTabChange("poll")}
            />
          </div>

          {/* Main Form Content */}
          <div className="flex-1 p-4 bg-white dark:bg-gray-800">
            {/* Title Input */}
            <div className="relative mb-4">
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title*"
                maxLength={MAX_TITLE_LENGTH}
                required
                className="w-full p-3 text-lg font-medium border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              <span className="absolute bottom-2 right-3 text-xs text-gray-400">
                {formData.title.length}/{MAX_TITLE_LENGTH}
              </span>
            </div>

            {/* Add Tags Button */}
            <Button
              variant="outline"
              size="sm"
              className="mb-4 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Add tags
            </Button>

            {/* Conditional Content based on Tab */}
            {selectedTab === "text" && (
              <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                {/* Rich Text Editor Toolbar (simplified) */}
                <div className="flex items-center p-2 bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <BoldIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <ItalicIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <StrikethroughIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <CodeIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <ListIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <ListOrderedIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <QuoteIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <Code2Icon className="h-4 w-4" />
                  </Button>
                  <span className="ml-auto text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                    Switch to Markdown Editor
                  </span>
                </div>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Body text (optional)"
                  rows={10}
                  className="w-full p-3 border-none focus:ring-0 resize-y min-h-[150px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>
            )}

            {selectedTab === "images" && (
              <div className="grid gap-2 border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-gray-800">
                <Label className="font-medium text-gray-900 dark:text-gray-100">
                  Images
                </Label>
                <div className="flex flex-wrap gap-2">
                  {(formData.images ?? []).map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`uploaded-${idx}`}
                        className="w-24 h-24 object-cover rounded border border-gray-200 dark:border-gray-700"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white dark:bg-gray-900 bg-opacity-80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                    className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-blue-400 dark:border-blue-600 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors text-blue-600 dark:text-blue-400"
                    aria-label="Add image"
                  >
                    <PlusIcon className="w-8 h-8" />
                  </button>
                </div>
              </div>
            )}

            {selectedTab === "link" && (
              <div className="grid gap-2 border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-gray-800">
                <Label
                  htmlFor="url"
                  className="font-medium text-gray-900 dark:text-gray-100"
                >
                  URL
                </Label>
                <div className="relative">
                  <Input
                    id="url"
                    name="url"
                    type="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="pl-9 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    pattern="https?://.*"
                    title="Please enter a valid URL starting with http:// or https://"
                  />
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Include a link to share (must start with http:// or https://)
                </p>
              </div>
            )}

            {/* --- START: Poll Feature Implementation --- */}
            {selectedTab === "poll" && (
              <div className="grid gap-4 border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create a poll by adding options. A poll must have at least two
                  options.
                </p>

                {formData.pollOptions?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) =>
                        handlePollOptionChange(index, e.target.value)
                      }
                      className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    />
                    {formData.pollOptions &&
                      formData.pollOptions.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePollOption(index)}
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
                          aria-label={`Remove option ${index + 1}`}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddPollOption}
                  className="w-full text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900"
                  disabled={(formData.pollOptions?.length || 0) >= 6} // Limit to 6 options, for example
                >
                  <PlusIcon className="h-4 w-4 mr-2" /> Add Option
                </Button>

                <div className="grid gap-2 mt-4">
                  <Label
                    htmlFor="pollDuration"
                    className="font-medium text-gray-900 dark:text-gray-100"
                  >
                    Poll Duration (minutes)
                  </Label>
                  <Input
                    id="pollDuration"
                    name="pollDuration"
                    type="number"
                    value={formData.pollDuration}
                    onChange={handlePollDurationChange}
                    placeholder="e.g., 1440 for 24 hours"
                    min="1"
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Enter the duration in minutes (e.g., 1440 minutes for 24
                    hours).
                  </p>
                </div>
              </div>
            )}
            {/* --- END: Poll Feature Implementation --- */}
          </div>

          {/* Footer with Action Buttons */}
          <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg">
            <Button
              type="button"
              variant="outline"
              className="px-4 py-2 text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>

        <GalleryView
          modal={true}
          activeTab="library"
          onUseSelected={handleGallerySelect}
          modalOpen={galleryOpen}
          setModalOpen={setGalleryOpen}
        />
      </DialogContent>
    </Dialog>
  );
}

// Helper component for tabs (remains the same)
interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, icon, isActive, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center flex-1 py-3 px-4 text-sm font-semibold border-b-2 transition-colors duration-200
        ${
          isActive
            ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
            : "border-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}
