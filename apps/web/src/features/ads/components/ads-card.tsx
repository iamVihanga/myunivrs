"use client";
import { formatDistanceToNow } from "date-fns";
import { ExternalLinkIcon, PackageIcon, TrashIcon } from "lucide-react";
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import Link from "next/link";
import { useId } from "react";
import { deleteAds } from "../actions/delete.action";
import type { Ads } from "../schemas";

type Props = {
  ads: Ads;
};

export function AdsCard({ ads }: Props) {
  const id = useId();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Default image if none provided
  const displayImage = ads.images && ads.images.length > 0 ? ads.images[0] : "";

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteAds(ads.id);
      toast.success("Ads listing deleted successfully");
    } catch (error) {
      console.error("Failed to delete ads:", error);
      toast.error("Failed to delete ads listing");
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
            <AvatarImage
              src={displayImage}
              alt={ads.title}
              className="size-16"
            />
            <AvatarFallback className="bg-cyan-50 text-cyan-700">
              <PackageIcon className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>

          {/* Main content section */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <div>
                <h3 className="font-semibold line-clamp-1">{ads.title}</h3>
                <p className="text-xs text-muted-foreground">
                  Added {formatDistanceToNow(ads.createdAt)} ago
                </p>
              </div>
            </div>

            {/* Info with separators */}
            <div className="flex flex-wrap items-center gap-2 text-sm mt-2">
              {ads.postType && (
                <div className="flex items-center gap-1">
                  <PackageIcon className="h-3.5 w-3.5 text-cyan-500" />
                  <span className="text-sm capitalize">{ads.postType}</span>
                </div>
              )}
              {ads.companyName && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span className="text-sm truncate max-w-[180px]">
                    {ads.companyName}
                  </span>
                </>
              )}
              {ads.contactInformation && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span className="text-sm truncate max-w-[180px]">
                    Contact: {ads.contactInformation}
                  </span>
                </>
              )}
              {ads.occurrence && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span className="text-sm capitalize">{ads.occurrence}</span>
                </>
              )}
              {ads.isFeatured && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <Badge variant="secondary">Featured</Badge>
                </>
              )}
              {ads.description && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span className="text-sm line-clamp-1">
                    {ads.description}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Actions section */}
          <div className="flex items-center gap-2 ml-2 shrink-0">
            {/* <Badge
              variant="outline"
              className="bg-cyan-50 text-cyan-700 border-cyan-200 text-xs w-fit"
            >
              {ads.status || "Active"}
            </Badge> */}
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
              <Link href={`/dashboard/ads/${ads.id}`}>
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
              This will permanently delete the ads listing "{ads.title}". This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Listing"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
