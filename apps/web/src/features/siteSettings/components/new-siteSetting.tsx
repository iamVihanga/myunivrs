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
import { createSiteSetting } from "../actions/create.action";
import { InsertSiteSettings } from "../schemas";

export function NewSiteSetting() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InsertSiteSettings>({
    siteName: "",
    siteDescription: "",
    logoUrl: "",
    faviconUrl: "",
    primaryEmail: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.siteName) {
      toast.error("Site name is required");
      return;
    }
    if (formData.logoUrl && !/^https?:\/\/.+\..+/.test(formData.logoUrl)) {
      toast.error("Logo URL must be a valid URL");
      return;
    }
    if (
      formData.faviconUrl &&
      !/^https?:\/\/.+\..+/.test(formData.faviconUrl)
    ) {
      toast.error("Favicon URL must be a valid URL");
      return;
    }
    if (
      formData.primaryEmail &&
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.primaryEmail)
    ) {
      toast.error("Primary email must be a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      await createSiteSetting(formData);

      toast.success("Site settings saved successfully!");
      setFormData({
        siteName: "",
        siteDescription: "",
        logoUrl: "",
        faviconUrl: "",
        primaryEmail: "",
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save site settings. Please try again.");
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
          Add Site Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Site Settings</DialogTitle>
            <DialogDescription>
              Fill out the form to update your site settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="siteName">
                Site Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="siteName"
                name="siteName"
                placeholder="Enter site name"
                value={formData.siteName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                name="siteDescription"
                placeholder="Enter site description"
                value={formData.siteDescription || ""}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                name="logoUrl"
                placeholder="https://example.com/logo.png"
                value={formData.logoUrl || ""}
                onChange={handleChange}
                type="url"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="faviconUrl">Favicon URL</Label>
              <Input
                id="faviconUrl"
                name="faviconUrl"
                placeholder="https://example.com/favicon.ico"
                value={formData.faviconUrl || ""}
                onChange={handleChange}
                type="url"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="primaryEmail">Primary Email</Label>
              <Input
                id="primaryEmail"
                name="primaryEmail"
                placeholder="admin@example.com"
                value={formData.primaryEmail || ""}
                onChange={handleChange}
                type="email"
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
              {isSubmitting ? "Saving..." : "Save Settings"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
