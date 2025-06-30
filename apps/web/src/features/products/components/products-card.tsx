"use client";
import { formatDistanceToNow } from "date-fns";
import {
  DollarSignIcon,
  ExternalLinkIcon,
  HomeIcon,
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
import { deleteProducts } from "../actions/delete.action";
import type { Product } from "../schemas";

type Props = {
  products: Product;
};

export function ProductCard({ products }: Props) {
  const id = useId();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Default image if none provided
  const displayImage =
    products.images && products.images.length > 0 ? products.images[0] : "";

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteProducts(products.id);
      toast.success("Product listing deleted successfully");
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product listing");
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
              alt={products.title}
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
                <h3 className="font-semibold line-clamp-1">{products.title}</h3>
                <p className="text-xs text-muted-foreground">
                  Added {formatDistanceToNow(products.createdAt)} ago
                </p>
              </div>
            </div>

            {/* Info with separators */}
            <div className="flex flex-wrap items-center gap-2 text-sm mt-2">
              {/* Location */}
              {products.location && (
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-3.5 w-3.5 text-cyan-500" />
                  <span className="truncate max-w-[120px]">
                    {products.location}
                  </span>
                </div>
              )}

              {/* Condition */}
              {products.condition && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <Badge variant="secondary" className="capitalize">
                    {products.condition.replace("_", " ")}
                  </Badge>
                </>
              )}

              {/* Price */}
              {typeof products.price === "number" && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <div className="flex items-center gap-1">
                    <DollarSignIcon className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="font-medium">{products.price}</span>
                  </div>
                </>
              )}

              {/* Discount */}
              {typeof products.discountPercentage === "number" &&
                products.discountPercentage > 0 && (
                  <>
                    <div className="text-gray-300 text-sm px-1">|</div>
                    <Badge
                      variant="outline"
                      className="text-green-700 border-green-200"
                    >
                      -{products.discountPercentage}%
                    </Badge>
                  </>
                )}

              {/* Stock */}
              {typeof products.stockQuantity === "number" && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span className="text-xs text-muted-foreground">
                    Stock: {products.stockQuantity}
                  </span>
                </>
              )}

              {/* Negotiable */}
              {typeof products.isNegotiable === "boolean" && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <Badge
                    variant={products.isNegotiable ? "default" : "outline"}
                    className={
                      products.isNegotiable
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : ""
                    }
                  >
                    {products.isNegotiable ? "Negotiable" : "Fixed Price"}
                  </Badge>
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
              {products.status || "Published"}
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
              <Link href={`/dashboard/products/${products.id}`}>
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
              This will permanently delete the products listing "
              {products.title}
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
