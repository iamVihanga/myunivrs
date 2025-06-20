"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@repo/ui/components/alert-dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import { formatDistanceToNow } from "date-fns";
import {
  Badge,
  DollarSignIcon,
  ExternalLinkIcon,
  HomeIcon,
  Link,
  MapPinIcon,
  TrashIcon,
} from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
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
      toast.success("Sell-Swaps listing deleted successfully");
    } catch (error) {
      console.error("Failed to delete Sell-Swaps:", error);
      toast.error("Failed to delete Sell-Swaps listing");
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
              alt={sellSwaps.title}
              className="size-16"
            />
            <AvatarFallback className="bg-cyan-50 text-cyan-700">
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
              {sellSwaps.type && (
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-3.5 w-3.5 text-cyan-500" />
                  <span className="text-sm truncate max-w-[180px]">
                    {sellSwaps.type}
                  </span>
                </div>
              )}

              {sellSwaps.type && sellSwaps.id && (
                <div className="text-gray-300 text-sm px-1">|</div>
              )}

              {sellSwaps.type && (
                <div className="flex items-center gap-1">
                  <DollarSignIcon className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-sm font-medium">
                    {parseInt(sellSwaps.type).toFixed(2)}
                  </span>
                </div>
              )}

              {sellSwaps.type && sellSwaps.title && (
                <div className="text-gray-300 text-sm px-1">|</div>
              )}

              {/* {housing.link && (
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-3.5 w-3.5 text-teal-500" />
                  <a
                    href={housing.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:underline truncate max-w-[180px] text-sm"
                  >
                    {housing.link}
                  </a>
                </div>
              )} */}
            </div>
          </div>

          {/* Actions section */}
          <div className="flex items-center gap-2 ml-2 shrink-0">
            <Badge
              fontVariant="outline"
              className="bg-cyan-50 text-cyan-700 border-cyan-200 text-xs w-fit"
            >
              {sellSwaps.type || "Published"}
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
              <Link href={`/dashboard/housing/${sellSwaps.id}`}>
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
              This will permanently delete the housing listing "
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
