import { client } from "@/lib/rpc";
import { Badge } from "@repo/ui/components/badge";
import { Card, CardContent } from "@repo/ui/components/card";
import { format } from "date-fns";
import {
  ArrowLeft,
  DollarSign,
  ImageIcon,
  InfoIcon,
  MapPinIcon,
  PackageIcon,
  PhoneIcon,
  RefreshCcw,
  TagsIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function SingleSellSwapPage({ params }: Props) {
  const rpcClient = await client();

  try {
    const res = await rpcClient.api.sellswaps[":id"].$get({
      param: { id: params.id },
    });

    if (res.status !== 200) {
      return (
        <div className="flex items-center justify-center h-full">
          Something went wrong
        </div>
      );
    }

    const item = await res.json();
    const formattedCreatedDate = format(new Date(item.createdAt), "PPP");

    return (
      <div className="container mx-auto py-8 px-3 max-w-5xl">
        <Link
          href="/dashboard/sellswap"
          className="inline-flex items-center mb-6 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sell/Swap listings
        </Link>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                <PackageIcon className="w-7 h-7 text-green-600" />
                {item.title}
              </h1>
              <div className="text-muted-foreground">
                <span>Posted on {formattedCreatedDate}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Badge
                className="capitalize"
                variant={item.status === "published" ? "default" : "outline"}
              >
                {item.status}
              </Badge>
              {item.type === "sell" && item.price && (
                <div className="text-2xl font-bold flex items-center gap-1 text-right">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  {Number(item.price).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          <Card>
            <CardContent className="space-y-6 pt-6">
              {/* Images */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon className="h-5 w-5 text-green-600" />
                  <h2 className="font-semibold text-lg">Images</h2>
                </div>
                {item.images?.length > 0 ? (
                  <div className="flex gap-2 overflow-x-auto">
                    {item.images.map((url: string, idx: number) => (
                      <div
                        key={idx}
                        className="aspect-square w-24 h-24 bg-slate-100 rounded-md overflow-hidden"
                      >
                        <img
                          src={url}
                          alt={`Image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No images available.</p>
                )}
              </section>

              {/* Basic Info */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <InfoIcon className="h-5 w-5 text-green-600" />
                  <h2 className="font-semibold text-lg">Item Details</h2>
                </div>
                <p>
                  <span className="font-medium">Description:</span>{" "}
                  {item.description || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Condition:</span>{" "}
                  {item.condition}
                </p>
                <p>
                  <span className="font-medium">Quantity:</span> {item.quantity}
                </p>
                <p>
                  <span className="font-medium">Type:</span> {item.type}
                </p>
              </section>

              {/* Location */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <MapPinIcon className="h-5 w-5 text-green-600" />
                  <h2 className="font-semibold text-lg">Location</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <p>
                    <span className="font-medium">City:</span>{" "}
                    {item.city || "-"}
                  </p>
                  <p>
                    <span className="font-medium">State:</span>{" "}
                    {item.state || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Zip Code:</span>{" "}
                    {item.zipCode || "-"}
                  </p>
                </div>
              </section>

              {/* Preferences */}
              {item.type === "swap" && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <RefreshCcw className="h-5 w-5 text-green-600" />
                    <h2 className="font-semibold text-lg">Swap Preferences</h2>
                  </div>
                  <p>{item.swapPreferences || "No preferences mentioned."}</p>
                </section>
              )}

              {/* Tags */}
              {item.tags?.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <TagsIcon className="h-5 w-5 text-green-600" />
                    <h2 className="font-semibold text-lg">Tags</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag: string, idx: number) => (
                      <Badge key={idx} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

              {/* Contact */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <PhoneIcon className="h-5 w-5 text-green-600" />
                  <h2 className="font-semibold text-lg">Contact</h2>
                </div>
                <p>{item.contactNumber || "No contact number provided."}</p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
