import { client } from "@/lib/rpc";
import { Badge } from "@repo/ui/components/badge";
import { Card, CardContent } from "@repo/ui/components/card";
import { format } from "date-fns";
import {
  ArrowLeft,
  Globe2Icon,
  InfoIcon,
  MapPinIcon,
  Settings2Icon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function SingleUniversityPage({ params }: Props) {
  const rpcClient = await client();

  try {
    const universityRes = await rpcClient.api.university[":id"].$get({
      param: { id: params.id },
    });

    if (universityRes.status !== 200) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          Something went wrong
        </div>
      );
    }

    const university = await universityRes.json();

    // Format dates for display
    const formattedCreatedDate = format(new Date(university.createdAt), "PPP");
    const formattedUpdatedDate = university.updatedAt
      ? format(new Date(university.updatedAt), "PPP")
      : null;

    return (
      <div className="container mx-auto py-8 px-3 max-w-5xl">
        {/* Back navigation */}
        <Link
          href="/dashboard/university"
          className="inline-flex items-center mb-6 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to universities
        </Link>

        <div className="flex flex-col gap-6">
          {/* Header section */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Globe2Icon className="w-7 h-7 text-cyan-600" />
                {university.name}
              </h1>
              <div className="flex items-center text-muted-foreground">
                <MapPinIcon className="h-4 w-4 mr-1" />
                <span>{university.countryCode}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-end">
                <Badge
                  variant={
                    university.status === "published" ? "default" : "outline"
                  }
                  className="capitalize"
                >
                  {university.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="flex flex-col gap-6">
            <Card className="min-w-0">
              <CardContent className="space-y-6 pt-6">
                {/* Basic Information */}
                <section className="mb-6 p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-2 mb-4">
                    <InfoIcon className="w-5 h-5 text-cyan-600" />
                    <h2 className="font-semibold text-lg">Basic Information</h2>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Name:</span>{" "}
                      <span>{university.name}</span>
                    </div>
                    <div>
                      <span className="font-medium">Country Code:</span>{" "}
                      <span>{university.countryCode}</span>
                    </div>
                  </div>
                </section>

                {/* Status & Dates */}
                <section className="mb-6 p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings2Icon className="w-5 h-5 text-cyan-600" />
                    <h2 className="font-semibold text-lg">Status & Dates</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      <Badge
                        variant={
                          university.status === "published"
                            ? "default"
                            : "outline"
                        }
                        className="capitalize"
                      >
                        {university.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      <span>{formattedCreatedDate}</span>
                    </div>
                    {formattedUpdatedDate && (
                      <div>
                        <span className="font-medium">Last Updated:</span>{" "}
                        <span>{formattedUpdatedDate}</span>
                      </div>
                    )}
                  </div>
                </section>
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
