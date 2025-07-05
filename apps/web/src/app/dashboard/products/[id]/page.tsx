import { client } from "@/lib/rpc";

import { Badge } from "@repo/ui/components/badge";
import { Card, CardContent } from "@repo/ui/components/card";
import { format } from "date-fns";
import {
  ArrowLeft,
  DollarSign,
  ImageIcon,
  InfoIcon,
  PackageIcon,
  Settings2Icon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";


type Props = {
  params: { id: string };
};

export default async function SingleProductPage({ params }: Props) {
  const rpcClient = await client();


  try {
    const productRes = await rpcClient.api.products[":id"].$get({
      param: { id: params.id },
    });

    if (productRes.status !== 200) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          Something went wrong
        </div>
      );
    }

    const product = await productRes.json();

    // Format dates for display
    const formattedCreatedDate = format(new Date(product.createdAt), "PPP");
    const formattedUpdatedDate = product.updatedAt
      ? format(new Date(product.updatedAt), "PPP")
      : null;

    return (
      <div className="container mx-auto py-8 px-3 max-w-5xl">
        {/* Back navigation */}
        <Link
          href="/dashboard/products"
          className="inline-flex items-center mb-6 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to listings
        </Link>

        <div className="flex flex-col gap-6">
          {/* Header section */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                <PackageIcon className="w-7 h-7 text-cyan-600" />
                {product.title}
              </h1>
              <div className="text-muted-foreground">
                <span>{product.categoryId || "No category"}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-right">
              <Badge
                variant={product.status === "published" ? "default" : "outline"}
                className="capitalize"
              >
                {product.status}
              </Badge>
              <div className="text-2xl font-bold text-emerald-600 flex items-center gap-1 justify-end">
                <DollarSign className="h-5 w-5" />
                {Number(product.price).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Images */}
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="w-5 h-5 text-cyan-600" />
                  <h2 className="font-semibold text-lg">Images</h2>
                </div>
                {product.images && product.images.length > 0 ? (
                  <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2">
                    {product.images.map((image: string, index: number) => (
                      <div
                        key={index}
                        className="aspect-square w-24 h-24 rounded-md bg-slate-100 overflow-hidden flex-shrink-0"
                      >
                        <img
                          src={image}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No images available for this product
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card>
              <CardContent className="space-y-2 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <InfoIcon className="w-5 h-5 text-cyan-600" />
                  <h2 className="font-semibold text-lg">Basic Information</h2>
                </div>
                <div>
                  <p>{product.description || "No description provided."}</p>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Details */}
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Settings2Icon className="w-5 h-5 text-cyan-600" />
                  <h2 className="font-semibold text-lg">Pricing & Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Price:</span>{" "}
                    <span>{Number(product.price).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="font-medium">Discount Percentage:</span>{" "}
                    <span>{product.discountPercentage || "0"}%</span>
                  </div>
                  <div>
                    <span className="font-medium">Negotiable:</span>{" "}
                    <span>{product.isNegotiable ? "Yes" : "No"}</span>
                  </div>
                  <div>
                    <span className="font-medium">Stock Quantity:</span>{" "}
                    <span>{product.stockQuantity || "-"}</span>
                  </div>
                  <div>
                    <span className="font-medium">Condition:</span>{" "}
                    <span>{product.condition || "-"}</span>
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>{" "}
                    <span>{product.location || "-"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dates */}
            <Card>
              <CardContent className="space-y-2 pt-6">
                <div>
                  <span className="font-medium">Created At:</span>{" "}
                  <span>{formattedCreatedDate}</span>
                </div>
                {formattedUpdatedDate && (
                  <div>
                    <span className="font-medium">Updated At:</span>{" "}
                    <span>{formattedUpdatedDate}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return notFound();
  }

}
