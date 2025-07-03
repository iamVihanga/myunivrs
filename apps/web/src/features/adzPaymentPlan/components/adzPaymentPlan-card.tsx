"use client";
import { formatDistanceToNow } from "date-fns";
import {
  DollarSignIcon,
  ExternalLinkIcon,
  HomeIcon,
  InfoIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import Link from "next/link";
import { useId } from "react";
import { deleteAdsPaymentPlan } from "../actions/delete.action";
import type { AdsPaymentPlan } from "../schemas";

type Props = {
  adsPaymentPlan: AdsPaymentPlan;
};

export function AdsPaymentPlanCard({ adsPaymentPlan }: Props) {
  const id = useId();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteAdsPaymentPlan(adsPaymentPlan.id);
      toast.success("Ads payment plan deleted successfully");
    } catch (error) {
      console.error("Failed to delete ads payment plan:", error);
      toast.error("Failed to delete ads payment plan");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card
        key={id}
        className="transition-all hover:shadow-lg border-l-4 border-l-cyan-500 p-4"
      >
        <div className="flex items-center gap-4">
          {/* Avatar section */}
          <Avatar className="h-16 w-16 rounded-full border">
            <AvatarFallback className="bg-cyan-50 text-cyan-700">
              <HomeIcon className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>

          {/* Main content section */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <div>
                <h3 className="font-semibold line-clamp-1">
                  {adsPaymentPlan.planName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Added{" "}
                  {formatDistanceToNow(new Date(adsPaymentPlan.createdAt))} ago
                </p>
              </div>
            </div>

            {/* Info with separators */}
            <div className="flex flex-wrap items-center gap-2 text-sm mt-2">
              <div className="flex items-center gap-1">
                <DollarSignIcon className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-sm font-medium">
                  {Number(adsPaymentPlan.price).toLocaleString()}{" "}
                  {adsPaymentPlan.currency}
                </span>
              </div>
              <div className="text-gray-300 text-sm px-1">|</div>
              <div className="flex items-center gap-1">
                <InfoIcon className="h-3.5 w-3.5 text-cyan-500" />
                <span className="text-sm">
                  {adsPaymentPlan.durationDays} days
                </span>
              </div>
              <div className="text-gray-300 text-sm px-1">|</div>
              <span className="text-sm">Max Ads: {adsPaymentPlan.maxAds}</span>
              <div className="text-gray-300 text-sm px-1">|</div>
              <Badge
                variant="outline"
                className="bg-cyan-50 text-cyan-700 border-cyan-200 text-xs w-fit capitalize"
              >
                {adsPaymentPlan.status}
              </Badge>
            </div>
            {adsPaymentPlan.description && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {adsPaymentPlan.description}
              </p>
            )}
            {adsPaymentPlan.features &&
              Object.keys(adsPaymentPlan.features).length > 0 && (
                <pre className="bg-slate-50 rounded p-2 text-xs mt-2 max-h-24 overflow-auto">
                  {JSON.stringify(adsPaymentPlan.features, null, 2)}
                </pre>
              )}
          </div>

          {/* Actions section */}
          <div className="flex items-center gap-2 ml-2 shrink-0">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="h-8 px-2"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" asChild className="h-8 px-2">
              <Link href={`/dashboard/adzPaymentPlan/${adsPaymentPlan.id}`}>
                <ExternalLinkIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the payment plan "
              {adsPaymentPlan.planName}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Plan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
