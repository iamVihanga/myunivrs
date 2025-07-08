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
import { createAdsPaymentPlan } from "../actions/create.action";
import { InsertAdsPaymentPlan } from "../schemas";

const STATUS_OPTIONS = ["published", "draft", "archived"];
const DEFAULT_CURRENCY = "USD";

export function NewAdsPaymentPlan() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InsertAdsPaymentPlan>({
    planName: "",
    description: "",
    price: "",
    currency: DEFAULT_CURRENCY,
    durationDays: 1,
    features: "",
    maxAds: 1,
    status: "published",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,

      [name]:
        type === "number" ||
        name === "price" ||
        name === "durationDays" ||
        name === "maxAds"
          ? value === ""
            ? 0
            : Number(value)
          : value,

    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.planName ||
      formData.price === undefined ||
      formData.currency === "" ||
      !formData.durationDays ||
      !formData.maxAds
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (
      isNaN(Number(formData.price)) ||
      isNaN(Number(formData.durationDays)) ||
      isNaN(Number(formData.maxAds))
    ) {
      toast.error("Price, Duration (days), and Max Ads must be numbers");
      return;
    }


    let featuresObj = {};
    if (formData.features && String(formData.features).trim() !== "") {
      try {
        featuresObj = JSON.parse(formData.features as string);
      } catch {
        toast.error("Features must be valid JSON");
        return;
      }
    }


    setIsSubmitting(true);

    try {
      await createAdsPaymentPlan({
        planName: formData.planName,
        description: formData.description,
        price: String(formData.price),
        currency: formData.currency,
        durationDays: Number(formData.durationDays),
        features: formData.features,
        maxAds: Number(formData.maxAds),
        status: formData.status,
      });

      toast.success("Ads Payment Plan created successfully!");
      setFormData({
        planName: "",
        description: "",
        price: "",
        currency: DEFAULT_CURRENCY,
        durationDays: 1,
        features: "",
        maxAds: 1,
        status: "published",
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create Ads Payment Plan. Please try again.");
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
          Add New Payment Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Ads Payment Plan</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new ads payment plan.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="planName">
                Plan Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="planName"
                name="planName"
                placeholder="Enter plan name"
                value={formData.planName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">
                Price <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
                required
                min={0}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="currency">
                Currency <span className="text-red-500">*</span>
              </Label>
              <Input
                id="currency"
                name="currency"
                placeholder="USD"
                value={formData.currency}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="durationDays">
                Duration (days) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="durationDays"
                name="durationDays"
                type="number"
                placeholder="Number of days"
                value={formData.durationDays}
                onChange={handleChange}
                required
                min={1}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="maxAds">
                Max Ads <span className="text-red-500">*</span>
              </Label>
              <Input
                id="maxAds"
                name="maxAds"
                type="number"
                placeholder="Maximum number of ads"
                value={formData.maxAds}
                onChange={handleChange}
                required
                min={1}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="features">Features</Label>
              <Textarea
                id="features"
                name="features"
                placeholder='e.g. "highlighted", "24/7 support"}'
                value={formData.features as string}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter plan description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={3}
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
              {isSubmitting ? "Creating..." : "Create Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
