import { client } from "@/lib/rpc";
import {
  Card,
  CardContent
} from "@repo/ui/components/card";
import { format } from "date-fns";
import {
  ArrowLeft,
  InfoIcon,
  PackageIcon
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function SingleAdsPage({ params }: Props) {
  const rpcClient = await client();

  try {
    const adsRes = await rpcClient.api.ads[":id"].$get({
      param: { id: params.id },
    });

    if (adsRes.status !== 200) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          Something went wrong
        </div>
      );
    }

    const ads = await adsRes.json();

    // Format dates for display
    const formattedCreatedDate = format(new Date(ads.createdAt), "PPP");
    const formattedUpdatedDate = ads.updatedAt
      ? format(new Date(ads.updatedAt), "PPP")
      : null;

    return (
      <div className="container mx-auto py-8 px-3 max-w-5xl">
        {/* Back navigation */}
        <Link
          href="/dashboard/ads"
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
                {ads.title}
              </h1>
              <div className="flex items-center text-muted-foreground">
                <PackageIcon className="h-4 w-4 mr-1" />
                <span className="capitalize">{ads.postType}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {/* <div className="flex items-center justify-end">
                <Badge
                  variant={ads.status === "active" ? "default" : "outline"}
                  className="capitalize bg-cyan-50 text-cyan-700 border-cyan-200"
                >
                  {ads.status || "Active"}
                </Badge>
              </div> */}
            </div>
          </div>

          {/* Modern Sectioned Content */}
          <div className="flex flex-col gap-6">
            {/* Main info card */}
            <Card className="min-w-0">
              <CardContent className="space-y-6 pt-6">
                {/* 1. Images */}
                <section className="mb-6 p-4 rounded-lg border bg-cyan-50">
                  <div className="flex items-center gap-2 mb-4">
                    <PackageIcon className="w-5 h-5 text-cyan-600" />
                    <h2 className="font-semibold text-lg">Images</h2>
                  </div>
                  {ads.images && ads.images.length > 0 ? (
                    <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2">
                      {ads.images.map((image: string, index: number) => (
                        <div
                          key={index}
                          className="aspect-square w-24 h-24 rounded-md bg-slate-100 overflow-hidden flex-shrink-0"
                        >
                          <img
                            src={image}
                            alt={`Ad image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No images available for this ad
                    </div>
                  )}
                </section>

                {/* 2. Basic Info */}
                <section className="mb-6 p-4 rounded-lg border bg-cyan-50">
                  <div className="flex items-center gap-2 mb-4">
                    <InfoIcon className="w-5 h-5 text-cyan-600" />
                    <h2 className="font-semibold text-lg">Basic Information</h2>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Title:</span>{" "}
                      <span>{ads.title}</span>
                    </div>
                    <div>
                      <span className="font-medium">Post Type:</span>{" "}
                      <span className="capitalize">{ads.postType}</span>
                    </div>
                    <div>
                      <span className="font-medium">Description:</span>{" "}
                      <span>
                        {ads.description || "No description provided."}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Company Name:</span>{" "}
                      <span>{ads.companyName || "-"}</span>
                    </div>
                  </div>
                </section>

                {/* 3. Additional Details */}
                <section className="mb-6 p-4 rounded-lg border bg-cyan-50">
                  <div className="flex items-center gap-2 mb-4">
                    <PackageIcon className="w-5 h-5 text-cyan-600" />
                    <h2 className="font-semibold text-lg">Additional Details</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Contact Information:</span>{" "}
                      <span>{ads.contactInformation || "-"}</span>
                    </div>
                    <div>
                      <span className="font-medium">Occurrence:</span>{" "}
                      <span className="capitalize">{ads.occurrence || "-"}</span>
                    </div>
                    <div>
                      <span className="font-medium">Featured:</span>{" "}
                      <span>{ads.isFeatured ? "Yes" : "No"}</span>
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      <span>{formattedCreatedDate}</span>
                    </div>
                    <div>
                      <span className="font-medium">Updated:</span>{" "}
                      <span>{formattedUpdatedDate || "-"}</span>
                    </div>
                  </div>
                </section>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching ad:", error);
    return notFound();
  }
}
