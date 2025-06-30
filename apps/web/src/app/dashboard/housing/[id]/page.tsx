import { client } from "@/lib/rpc";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  ExternalLink,
  LinkIcon,
  MapPin,
  Tag,
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
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                {housing.title}
              </h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
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
              <div className="text-2xl font-bold text-right">
                ${Number(housing.price).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main info card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
                <CardDescription>
                  Listing information and description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <p>{housing.description || "No description provided."}</p>
                </div>

                <Separator />

                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="pt-4">
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Property ID
                        </dt>
                        <dd className="mt-1 text-sm">{housing.id}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Price
                        </dt>
                        <dd className="mt-1 text-sm flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                          {Number(housing.price).toLocaleString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Status
                        </dt>
                        <dd className="mt-1 text-sm">
                          <Badge
                            variant={
                              housing.status === "published"
                                ? "default"
                                : "outline"
                            }
                            className="capitalize"
                          >
                            {housing.status}
                          </Badge>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          External Link
                        </dt>
                        <dd className="mt-1 text-sm">
                          {housing.link ? (
                            <a
                              href={housing.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center"
                            >
                              View listing{" "}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          ) : (
                            "No link available"
                          )}
                        </dd>
                      </div>
                    </dl>
                  </TabsContent>
                  <TabsContent value="media" className="pt-4">
                    {housing.images && housing.images.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {housing.images.map((image: string, index: number) => (
                          <div
                            key={index}
                            className="aspect-square rounded-md bg-slate-100 overflow-hidden"
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
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Side info cards */}
            <div className="space-y-6">
              {/* Listing info card */}
              <Card>
                <CardHeader>
                  <CardTitle>Listing Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Created on</p>
                      <p className="text-sm text-muted-foreground">
                        {formattedCreatedDate}
                      </p>
                    </div>
                  </div>

                  {formattedUpdatedDate && (
                    <div className="flex items-start gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Last updated</p>
                        <p className="text-sm text-muted-foreground">
                          {formattedUpdatedDate}
                        </p>
                      </div>
                    </div>
                  )}

                  {housing.link && (
                    <div className="flex items-start gap-2">
                      <LinkIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">External listing</p>
                        <a
                          href={housing.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          View original listing
                        </a>
                      </div>
                    </div>
                  )}

                  {housing.agentProfile && (
                    <div className="flex items-start gap-2">
                      <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Listed by</p>
                        <p className="text-sm text-muted-foreground">
                          {housing.agentProfile || "Unknown Agent"}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="flex gap-3 w-full">
                    <Button variant="outline" className="w-full">
                      Edit
                    </Button>
                    <Button variant="destructive" className="w-full">
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              {/* Contact card (if agent info available) */}
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
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
