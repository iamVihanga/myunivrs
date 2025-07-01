"use client";

import { formatDistanceToNow } from "date-fns";
import {
  DollarSignIcon,
  ExternalLinkIcon,
  HomeIcon,
  MapPinIcon,
  TagIcon,
  TrashIcon,
} from "lucide-react";
import { useId, useState } from "react";
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
import { deleteSellSwaps } from "../actions/delete.sellswaps";
import { SellSwap } from "../schemas";

type Props = {
  sellSwaps: SellSwap;
};

export function SellSwapCard({ sellSwaps }: Props) {
  const id = useId();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Default image if none provided
  const displayImage =
    sellSwaps.images && sellSwaps.images.length > 0 ? sellSwaps.images[0] : "";

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteSellSwaps(sellSwaps.id);
      toast.success("Sell/Swap listing deleted successfully");
    } catch (error) {
      console.error("Failed to delete listing:", error);
      toast.error("Failed to delete Sell/Swap listing");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card
        key={id}
        className="transition-all hover:shadow-lg border-l-4 border-l-green-500 p-4"
      >
        <div className="flex items-center gap-4">
          {/* Avatar section */}
          <Avatar className="h-16 w-16 rounded-full border">
            <AvatarImage
              src={displayImage}
              alt={sellSwaps.title}
              className="size-16"
            />
            <AvatarFallback className="bg-green-50 text-green-700">
              <HomeIcon className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>

          {/* Main content section */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <div>
                <h3 className="font-semibold line-clamp-1">
                  {sellSwaps.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Added {formatDistanceToNow(sellSwaps.createdAt)} ago
                </p>
              </div>
            </div>

            {/* Info with separators */}
            <div className="flex flex-wrap items-center gap-2 text-sm mt-2">
              {sellSwaps.city && (
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-sm truncate max-w-[180px]">
                    {sellSwaps.city}
                  </span>
                </div>
              )}

              {sellSwaps.city && sellSwaps.price && (
                <div className="text-gray-300 text-sm px-1">|</div>
              )}

              {sellSwaps.price && (
                <div className="flex items-center gap-1">
                  <DollarSignIcon className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-sm font-medium">
                    {Number(sellSwaps.price).toFixed(2)}
                  </span>
                </div>
              )}

              {sellSwaps.price && sellSwaps.status && (
                <div className="text-gray-300 text-sm px-1">|</div>
              )}

              {sellSwaps.status && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 text-xs w-fit"
                >
                  {sellSwaps.status}
                </Badge>
              )}

              {sellSwaps.status && sellSwaps.type && (
                <div className="text-gray-300 text-sm px-1">|</div>
              )}

              {sellSwaps.type && (
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-700 border-green-200 text-xs w-fit"
                >
                  {sellSwaps.type.charAt(0).toUpperCase() +
                    sellSwaps.type.slice(1)}
                </Badge>
              )}

              {sellSwaps.type && sellSwaps.condition && (
                <div className="text-gray-300 text-sm px-1">|</div>
              )}

              {sellSwaps.condition && (
                <Badge
                  variant="outline"
                  className="bg-gray-100 text-gray-700 border-gray-200 text-xs w-fit"
                >
                  {sellSwaps.condition}
                </Badge>
              )}

              {sellSwaps.tags && sellSwaps.tags.length > 0 && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <div className="flex items-center gap-1">
                    <TagIcon className="h-3.5 w-3.5 text-gray-400" />
                    {sellSwaps.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-gray-200 text-gray-700 rounded px-2 py-0.5 text-xs mr-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
            {sellSwaps.description && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {sellSwaps.description}
              </p>
            )}
          </div>

          {/* Actions section */}
          <div className="flex items-center gap-2 ml-2 shrink-0">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 text-xs w-fit"
            >
              {sellSwaps.status || "Draft"}
            </Badge>
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
              <Link href={`/dashboard/sellswaps/${sellSwaps.id}`}>
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
              This will permanently delete the sell/swap listing "
              {sellSwaps.title}
              ". This action cannot be undone.
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
