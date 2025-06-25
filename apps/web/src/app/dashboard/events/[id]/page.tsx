import { client } from "@/lib/rpc";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@repo/ui/components/tabs";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  PartyPopper,
  Tag
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function SingleEventPage({ params }: Props) {
  const rpcClient = await client();

  try {
    const eventRes = await rpcClient.api.events[":id"].$get({
      param: { id: params.id }
    });

    if (eventRes.status !== 200) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          Something went wrong
        </div>
      );
    }

    const event = await eventRes.json();

    // Format dates for display
    const formattedCreatedDate = format(new Date(event.createdAt), "PPP");
    const formattedUpdatedDate = event.updatedAt
      ? format(new Date(event.updatedAt), "PPP")
      : null;
    const formattedEventDate = format(new Date(event.eventDate), "PPP");
    const formattedEventTime = format(new Date(event.eventDate), "p");

    return (
      <div className="container mx-auto py-8 px-3 max-w-5xl">
        {/* Back navigation */}
        <Link
          href="/dashboard/events"
          className="inline-flex items-center mb-6 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to events
        </Link>

        <div className="flex flex-col gap-6">
          {/* Header section */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  {event.title}
                </h1>
                {event.isFeatured && (
                  <Badge className="bg-amber-500">Featured</Badge>
                )}
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{event.location}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-end">
                <Badge
                  variant={
                    event.status === "published" ? "default" : "outline"
                  }
                  className="capitalize"
                >
                  {event.status}
                </Badge>
              </div>
              <div className="text-xl font-bold text-right flex items-center gap-1 justify-end">
                <Calendar className="h-5 w-5 text-indigo-500" />
                {formattedEventDate}
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main info card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>
                  Information and description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <p>{event.description || "No description provided."}</p>
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
                          Event ID
                        </dt>
                        <dd className="mt-1 text-sm">{event.id}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Date
                        </dt>
                        <dd className="mt-1 text-sm flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          {formattedEventDate}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Time
                        </dt>
                        <dd className="mt-1 text-sm flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          {formattedEventTime}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Status
                        </dt>
                        <dd className="mt-1 text-sm">
                          <Badge
                            variant={
                              event.status === "published"
                                ? "default"
                                : "outline"
                            }
                            className="capitalize"
                          >
                            {event.status}
                          </Badge>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Featured
                        </dt>
                        <dd className="mt-1 text-sm">
                          {event.isFeatured ? "Yes" : "No"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">
                          Location
                        </dt>
                        <dd className="mt-1 text-sm flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          {event.location}
                        </dd>
                      </div>
                    </dl>
                  </TabsContent>
                  <TabsContent value="media" className="pt-4">
                    {event.images && event.images.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {event.images.map((image: string, index: number) => (
                          <div
                            key={index}
                            className="aspect-square rounded-md bg-slate-100 overflow-hidden"
                          >
                            <img
                              src={image}
                              alt={`Event image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No images available for this event
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Side info cards */}
            <div className="space-y-6">
              {/* Event info card */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
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
                    <div className="flex items-start gap