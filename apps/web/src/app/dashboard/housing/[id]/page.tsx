import { client } from "@/lib/rpc";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { format } from "date-fns";
import {
  ArrowLeft,
  DollarSign,
  ExternalLink,
  HomeIcon,
  ImageIcon,
  InfoIcon,
  LinkIcon,
  MapPinIcon,
  Settings2Icon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function SingleHousingPage({ params }: Props) {
  const rpcClient = await client();

  try {
    const housingRes = await rpcClient.api.housing[":id"].$get({
      param: { id: params.id },
    });

    if (housingRes.status !== 200) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          Something went wrong
        </div>
      );
    }

    const housing = await housingRes.json();

    // Format dates for display
    const formattedCreatedDate = format(new Date(housing.createdAt), "PPP");
    const formattedUpdatedDate = housing.updatedAt
      ? format(new Date(housing.updatedAt), "PPP")
      : null;

    return (
      <div className="container mx-auto py-8 px-3 max-w-5xl">
        {/* Back navigation */}
        <Link
          href="/dashboard/housing"
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
                <HomeIcon className="w-7 h-7 text-cyan-600" />
                {housing.title}
              </h1>
              <div className="flex items-center text-muted-foreground">
                <MapPinIcon className="h-4 w-4 mr-1" />
                <span>{housing.address}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-end">
                <Badge
                  variant={
                    housing.status === "published" ? "default" : "outline"
                  }
                  className="capitalize"
                >
                  {housing.status}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-right flex items-center gap-1">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                {Number(housing.price).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Modern Sectioned Content */}
          <div className="flex flex-col gap-6">
            {/* Main info card */}
            <Card className="min-w-0">
              <CardContent className="space-y-6 pt-6">
                {/* 1. Images */}
                <section className="mb-6 p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-2 mb-4">
                    <ImageIcon className="w-5 h-5 text-cyan-600" />
                    <h2 className="font-semibold text-lg">Images</h2>
                  </div>
                  {housing.images && housing.images.length > 0 ? (
                    <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2">
                      {housing.images.map((image: string, index: number) => (
                        <div
                          key={index}
                          className="aspect-square w-24 h-24 rounded-md bg-slate-100 overflow-hidden flex-shrink-0"
                        >
                          <img
                            src={image}
                            alt={`Property image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No images available for this property
                    </div>
                  )}
                </section>

                {/* 2. Basic Info */}
                <section className="mb-6 p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-2 mb-4">
                    <InfoIcon className="w-5 h-5 text-cyan-600" />
                    <h2 className="font-semibold text-lg">Basic Information</h2>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Title:</span>{" "}
                      <span>{housing.title}</span>
                    </div>
                    <div>
                      <span className="font-medium">Description:</span>{" "}
                      <span>
                        {housing.description || "No description provided."}
                      </span>
                    </div>
                  </div>
                </section>

                {/* 3. Location */}
                <section className="mb-6 p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPinIcon className="w-5 h-5 text-cyan-600" />
                    <h2 className="font-semibold text-lg">Location</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Address:</span>{" "}
                      <span>{housing.address}</span>
                    </div>
                    <div>
                      <span className="font-medium">City:</span>{" "}
                      <span>{housing.city || "-"}</span>
                    </div>
                    <div>
                      <span className="font-medium">State:</span>{" "}
                      <span>{housing.state || "-"}</span>
                    </div>
                    <div>
                      <span className="font-medium">Zip Code:</span>{" "}
                      <span>{housing.zipCode || "-"}</span>
                    </div>
                  </div>
                </section>

                {/* 4. Property Details */}
                <section className="mb-6 p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-2 mb-4">
                    <HomeIcon className="w-5 h-5 text-cyan-600" />
                    <h2 className="font-semibold text-lg">Property Details</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Bedrooms:</span>{" "}
                      <span>{housing.bedrooms || "-"}</span>
                    </div>
                    <div>
                      <span className="font-medium">Bathrooms:</span>{" "}
                      <span>{housing.bathrooms || "-"}</span>
                    </div>
                    <div>
                      <span className="font-medium">Parking:</span>{" "}
                      <span>{housing.parking || "-"}</span>
                    </div>
                    <div>
                      <span className="font-medium">Square Footage:</span>{" "}
                      <span>{housing.squareFootage || "-"}</span>
                    </div>
                    <div>
                      <span className="font-medium">Year Built:</span>{" "}
                      <span>{housing.yearBuilt || "-"}</span>
                    </div>
                    <div>
                      <span className="font-medium">Housing Type:</span>{" "}
                      <span>{housing.housingType || "-"}</span>
                    </div>
                    <div>
                      <span className="font-medium">Contact Number:</span>{" "}
                      <span>{housing.contactNumber || "-"}</span>
                    </div>
                  </div>
                </section>

                {/* 5. Preferences & Status */}
                <section className="mb-6 p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings2Icon className="w-5 h-5 text-cyan-600" />
                    <h2 className="font-semibold text-lg">
                      Preferences & Status
                    </h2>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-2">
                    <div>
                      <span className="font-medium">Furnished:</span>{" "}
                      <span>{housing.isFurnished ? "Yes" : "No"}</span>
                    </div>
                    <div>
                      <span className="font-medium flex items-center gap-1">
                        <LinkIcon className="w-4 h-4" />
                        Website Link:
                      </span>{" "}
                      {housing.link ? (
                        <a
                          href={housing.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          View listing <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      ) : (
                        <span>No link available</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      <Badge
                        variant={
                          housing.status === "published" ? "default" : "outline"
                        }
                        className="capitalize"
                      >
                        {housing.status}
                      </Badge>
                    </div>
                  </div>
                </section>
              </CardContent>
            </Card>

            {/* Other information (Contact card, etc.) shown full width below */}
            {housing.agentProfile && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Agent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3"></div>
                </CardContent>
                <CardFooter>
                  <Button variant="default" className="w-full">
                    Contact Agent
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
