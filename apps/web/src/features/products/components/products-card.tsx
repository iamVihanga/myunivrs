"use client";
import { formatDistanceToNow } from "date-fns";
import {
  DollarSignIcon,
  ExternalLinkIcon,
  MapPinIcon,
  PackageIcon,
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
import { EditProductDialog } from "./edit-product-dialog";

type Props = {
  products: Product;
};

export function ProductsCard({ products }: Props) {
  const id = useId();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const displayImage =
    products.images && products.images.length > 0 ? products.images[0] : "";

  const priceNum = parseFloat(products.price || "0");
  const discountNum = parseFloat(products.discountPercentage || "0");

  const discountedPrice =
    discountNum > 0
      ? (priceNum * (1 - discountNum / 100)).toFixed(2)
      : priceNum.toFixed(2);

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
          {/* Avatar */}

          <Avatar className="h-16 w-16 rounded-full border">
            <AvatarImage
              src={displayImage}
              alt={products.title}
              className="size-16"
            />
            <AvatarFallback className="bg-cyan-50 text-cyan-700">
              <PackageIcon className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>

          {/* Main Info */}

          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <div>
                <h3 className="font-semibold line-clamp-1">{products.title}</h3>
                <p className="text-xs text-muted-foreground">
                  Added {formatDistanceToNow(products.createdAt)} ago
                </p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2 text-sm mt-2">
              {products.location && (
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-3.5 w-3.5 text-cyan-500" />
                  <span className="text-sm truncate max-w-[180px]">
                    {products.location}
                  </span>
                </div>
              )}
              {products.price && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <div className="flex items-center gap-1">
                    <DollarSignIcon className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-sm font-medium">
                      ${discountedPrice}
                      {discountNum > 0 && (
                        <span className="text-xs text-red-500 line-through ml-1">
                          ${priceNum.toFixed(2)}
                        </span>
                      )}
                    </span>
                  </div>
                </>
              )}
              {discountNum > 0 && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <Badge variant="secondary">{discountNum}% Off</Badge>
                </>
              )}
              {products.condition && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span className="capitalize">{products.condition}</span>
                </>
              )}
              {products.stockQuantity && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span>{products.stockQuantity} in stock</span>
                </>
              )}
              {products.isNegotiable && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <Badge variant="secondary">Negotiable</Badge>
                </>
              )}
              {products.categoryId && (
                <>
                  <div className="text-gray-300 text-sm px-1">|</div>
                  <span>Category ID: {products.categoryId}</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-2 shrink-0">
            <Badge
              variant="outline"
              className="bg-cyan-50 text-cyan-700 border-cyan-200 text-xs w-fit capitalize"
            >
              {products.status}
            </Badge>

            {/* Add Edit button */}
            <EditProductDialog product={products} />

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
              This will permanently delete the product listing "{products.title}
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
