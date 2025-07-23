"use client";
import {
  CalendarIcon,
  ImageIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import GalleryView from "@/modules/media/components/gallery-view";
import { Button } from "@repo/ui/components/button";
import { Calendar } from "@repo/ui/components/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { Textarea } from "@repo/ui/components/textarea";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { createEvent } from "../actions/create.action";
import { InsertEvent } from "../schemas";

interface FormData extends Partial<InsertEvent> {
  images: string[];
}

export function NewEvent() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    location: "",
    images: [],
    eventDate: new Date().toISOString(),
    isFeatured: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    setDate(selectedDate);
    setFormData((prev) => ({
      ...prev,
      eventDate: selectedDate.toISOString(),
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

    // Enhanced form validation
    if (!formData.title?.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.location?.trim()) {
      toast.error("Location is required");
      return;
    }

    if (!formData.eventDate) {
      toast.error("Event date is required");
      return;
    }

    setIsSubmitting(true);

    try {
      await createEvent({
        ...formData,
        title: formData.title.trim(),
        location: formData.location.trim(),
        description: formData.description?.trim() || "",
        images: formData.images,
        eventDate: formData.eventDate,
        isFeatured: formData.isFeatured || false,
      });

      toast.success("Event created successfully!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        location: "",
        images: [],
        eventDate: new Date().toISOString(),
        isFeatured: false,
      });
      setDate(undefined);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Create event error:", error);
      toast.error("Failed to create event. Please try again.");
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
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Add New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new event.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto px-1 py-4">
            <div className="space-y-4 pr-2">
              <div className="grid gap-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Enter event location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="eventDate">
                  Event Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter event description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

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
            </div>
          </div>

          <DialogFooter className="flex-shrink-0">
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
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
