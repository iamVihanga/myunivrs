"use client";
import { formatDistanceToNow } from "date-fns";
import {
  DollarSignIcon,
  ExternalLinkIcon,
  HomeIcon,
  LinkIcon,
  MapPinIcon,
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
import { deleteHousing } from "../actions/delete.action";
import type { Housing } from "../schemas";

type Props = {
  housing: Housing;
};

export function HousingCard({ housing }: Props) {
  const id = useId();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Default image if none provided
  const displayImage =
    housing.images && housing.images.length > 0 ? housing.images[0] : "";

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteHousing(housing.id);
      toast.success("Housing listing deleted successfully");
    } catch (error) {
      console.error("Failed to delete housing:", error);
      toast.error("Failed to delete housing listing");
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
              alt={housing.title}
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
                <h3 className="font-semibold line-clamp-1">{housing.title}</h3>
                <p className="text-xs text-muted-foreground">
                  Added {formatDistanceToNow(housing.createdAt)} ago
                </p>
              </div>
            </div>

            {/* Info with separators */}
            <div className="flex flex-wrap items-center gap-2 text-sm mt-2">
              {housing.address && (
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-3.5 w-3.5 text-cyan-500" />
                  <span className="text-sm truncate max-w-[180px]">
                    {housing.address}
                  </span>
                </div>
              )}
              {housing.city && (
                <span className="text-xs text-muted-foreground">
                  | {housing.city}
                </span>
              )}
              {housing.state && (
                <span className="text-xs text-muted-foreground">
                  | {housing.state}
                </span>
              )}
              {housing.zipCode && (
                <span className="text-xs text-muted-foreground">
                  | {housing.zipCode}
                </span>
              )}
              {housing.price && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <div className="flex items-center gap-1">
                    <DollarSignIcon className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-sm font-medium">{housing.price}</span>
                  </div>
                </>
              )}
              {housing.bedrooms && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span>{housing.bedrooms} bed</span>
                </>
              )}
              {housing.bathrooms && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span>{housing.bathrooms} bath</span>
                </>
              )}
              {housing.parking && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span>{housing.parking} parking</span>
                </>
              )}
              {housing.squareFootage && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span>{housing.squareFootage} sqft</span>
                </>
              )}
              {housing.yearBuilt && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span>Built {housing.yearBuilt}</span>
                </>
              )}
              {housing.isFurnished && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <Badge variant="secondary">Furnished</Badge>
                </>
              )}
              {housing.housingType && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span>{housing.housingType}</span>
                </>
              )}
              {housing.contactNumber && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span>Contact: {housing.contactNumber}</span>
                </>
              )}
              {housing.link && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
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
                </>
              )}
            </div>
          </div>

          {/* Actions section */}
          <div className="flex items-center gap-2 ml-2 shrink-0">
            <Badge
              variant="outline"
              className="bg-cyan-50 text-cyan-700 border-cyan-200 text-xs w-fit"
            >
              {housing.status || "Published"}
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
              <Link href={`/dashboard/housing/${housing.id}`}>
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
              This will permanently delete the housing listing "{housing.title}
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
