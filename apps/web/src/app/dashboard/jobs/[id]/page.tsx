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
  BriefcaseIcon,
  CodeIcon,
  DollarSignIcon,
  ExternalLink,
  InfoIcon,
  LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";


type Props = {
  params: { id: string };
};

export default async function SingleJobsPage({ params }: Props) {
  const rpcClient = await client();

  try {
    const jobsRes = await rpcClient.api.jobs[":id"].$get({
      param: { id: params.id },
    });

    if (jobsRes.status !== 200) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          Something went wrong
        </div>
      );
    }

    const job = await jobsRes.json();

    // Type guard to check if job is a valid job object
    function isJob(obj: any): obj is {
      id: string;
      createdAt: string;
      updatedAt: string | null;
      title: string;
      description?: string;
      jobType: string;
      cvRequired: boolean;
      requiredSkills?: string[];
      salaryRange?: { min?: number; max?: number; currency?: string };
      actionUrl?: string;
      agentProfile?: string;
      status: string;
      company: string;
      isFeatured: boolean;
      images: string[];
    } {
      return (
        obj &&
        typeof obj === "object" &&
        typeof obj.id === "string" &&
        typeof obj.title === "string" &&
        typeof obj.company === "string"
      );
    }

    if (!isJob(job)) {
      return notFound();
    }

    // Format dates for display
    const formattedCreatedDate = format(new Date(job.createdAt), "PPP");
    const formattedUpdatedDate = job.updatedAt
      ? format(new Date(job.updatedAt), "PPP")
      : null;

    return (
      <div className="container mx-auto py-8 px-3 max-w-5xl">
        {/* Back navigation */}
        <Link
          href="/dashboard/jobs"
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
                <BriefcaseIcon className="w-7 h-7 text-cyan-600" />
                {job.title}
              </h1>
              <div className="flex items-center text-muted-foreground">
                <span>{job.company}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-end gap-2">
                {job.isFeatured && (
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800 border-yellow-300"
                  >
                    Featured
                  </Badge>
                )}
                <Badge
                  variant={job.status === "published" ? "default" : "outline"}
                  className="capitalize"
                >
                  {job.status}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-right flex items-center gap-1">
                <DollarSignIcon className="h-5 w-5 text-emerald-600" />
                {job.salaryRange &&
                (job.salaryRange.min || job.salaryRange.max) ? (
                  <span>
                    {job.salaryRange.min && job.salaryRange.max
                      ? `${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}`
                      : job.salaryRange.min
                        ? `${job.salaryRange.min.toLocaleString()}`
                        : job.salaryRange.max
                          ? `${job.salaryRange.max.toLocaleString()}`
                          : "Not specified"}
                    {job.salaryRange.currency && ` ${job.salaryRange.currency}`}
                  </span>
                ) : (
                  "Not specified"
                )}
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
                    <LinkIcon className="w-5 h-5 text-cyan-600" />
                    <h2 className="font-semibold text-lg">Images</h2>
                  </div>
                  {job.images && job.images.length > 0 ? (
                    <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2">
                      {job.images.map((image: string, index: number) => (
                        <div
                          key={index}
                          className="aspect-square w-24 h-24 rounded-md bg-slate-100 overflow-hidden flex-shrink-0"
                        >
                          <img
                            src={image}
                            alt={`Job image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No images available for this job
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
                      <span>{job.title}</span>
                    </div>
                    <div>
                      <span className="font-medium">Description:</span>{" "}
                      <span>
                        {job.description || "No description provided."}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Company:</span>{" "}
                      <span>{job.company}</span>
                    </div>
                  </div>
                </section>

                {/* 3. Job Requirements */}
                <section className="mb-6 p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-2 mb-4">
                    <CodeIcon className="w-5 h-5 text-cyan-600" />
                    <h2 className="font-semibold text-lg">Job Requirements</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Job Type:</span>{" "}
                      <Badge variant="secondary" className="capitalize">
                        {job.jobType.replace("_", " ")}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">CV Required:</span>{" "}
                      <Badge variant={job.cvRequired ? "default" : "outline"}>
                        {job.cvRequired ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium">Required Skills:</span>{" "}
                      {job.requiredSkills && job.requiredSkills.length > 0 ? (
                        job.requiredSkills.map((skill: string) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="mr-1"
                          >
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">
                          None specified
                        </span>
                      )}
                    </div>
                  </div>
                </section>

                {/* 4. Compensation */}
                <section className="mb-6 p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSignIcon className="w-5 h-5 text-cyan-600" />
                    <h2 className="font-semibold text-lg">Compensation</h2>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Salary Range:</span>{" "}
                      {job.salaryRange &&
                      (job.salaryRange.min || job.salaryRange.max) ? (
                        <span>
                          {job.salaryRange.min && (
                            <>
                              Min:{" "}
                              <span className="font-medium">
                                {job.salaryRange.min.toLocaleString()}
                              </span>
                            </>
                          )}
                          {job.salaryRange.max && (
                            <>
                              {job.salaryRange.min && (
                                <span className="mx-1">|</span>
                              )}
                              Max:{" "}
                              <span className="font-medium">
                                {job.salaryRange.max.toLocaleString()}
                              </span>
                            </>
                          )}
                          {job.salaryRange.currency && (
                            <span className="ml-2 text-muted-foreground">
                              {job.salaryRange.currency}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          Not specified
                        </span>
                      )}
                    </div>
                  </div>
                </section>

                {/* 5. Application Details */}
                <section className="mb-6 p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-2 mb-4">
                    <LinkIcon className="w-5 h-5 text-cyan-600" />
                    <h2 className="font-semibold text-lg">
                      Application Details
                    </h2>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-2">
                    <div>
                      <span className="font-medium flex items-center gap-1">
                        <LinkIcon className="w-4 h-4" />
                        Application Link:
                      </span>{" "}
                      {job.actionUrl ? (
                        <a
                          href={job.actionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          Apply now <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      ) : (
                        <span>No link available</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Featured:</span>{" "}
                      <Badge variant={job.isFeatured ? "default" : "outline"}>
                        {job.isFeatured ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      <Badge
                        variant={
                          job.status === "published" ? "default" : "outline"
                        }
                        className="capitalize"
                      >
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                </section>
              </CardContent>
            </Card>

            {/* Agent Contact Card */}
            {job.agentProfile && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Agent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Agent Profile:</span>{" "}
                      <span>{job.agentProfile}</span>
                    </div>
                  </div>
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
