"use client";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createSiteSetting } from "../actions/create.action";
import { InsertSiteSettings } from "../schemas";

export function NewSiteSetting() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<
    Omit<InsertSiteSettings, "logoUrl" | "faviconUrl">
  >({
    siteName: "",
    siteDescription: "",
    primaryEmail: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoFile(e.target.files?.[0] ?? null);
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFaviconFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.siteName) {
      toast.error("Site name is required");
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
      // TODO: Upload logoFile and faviconFile to get their URLs if needed
      // For now, we'll just pass the files directly if the backend supports it, otherwise handle upload separately
      const data = {
        siteName: formData.siteName,
        siteDescription: formData.siteDescription || "",
        primaryEmail: formData.primaryEmail || "",
        logoUrl: logoFile ?? undefined,
        faviconUrl: faviconFile ?? undefined,
      };

      await createSiteSetting(data);

      toast.success("Site settings saved successfully!");
      setFormData({
        siteName: "",
        siteDescription: "",
        primaryEmail: "",
      });
      setLogoFile(null);
      setFaviconFile(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save site settings. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white rounded-lg shadow p-6 border"
    >
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
        <Label htmlFor="logoUrl">Logo Image</Label>
        <Input
          id="logoUrl"
          name="logoUrl"
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
        />
        {logoFile && (
          <div className="mt-1 text-xs text-muted-foreground">
            Selected: {logoFile.name}
          </div>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="faviconUrl">Favicon Icon</Label>
        <Input
          id="faviconUrl"
          name="faviconUrl"
          type="file"
          accept="image/*"
          onChange={handleFaviconChange}
        />
        {faviconFile && (
          <div className="mt-1 text-xs text-muted-foreground">
            Selected: {faviconFile.name}
          </div>
        )}
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

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          {isSubmitting ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
