import { client } from "@/lib/rpc";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { ExternalLinkIcon } from "lucide-react";

type Props = {
  params: { id: string };
};

export default async function SingleJobsPage({ params }: Props) {
  const rpcClient = await client();

  const jobsRes = await rpcClient.api.jobs[":id"].$get({
    param: { id: params.id },
  });

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
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Job Not Found</CardTitle>
            <CardDescription>
              The requested job listing does not exist.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex flex-wrap items-center gap-2">
            {job.title}
            {job && (
              <Badge
                variant="outline"
                className="bg-yellow-100 text-yellow-800 border-yellow-300 ml-2"
              >
                Featured
              </Badge>
            )}
            <Badge className="ml-2 capitalize">{job.status}</Badge>
          </CardTitle>
          <CardDescription>
            <span className="text-muted-foreground">{job.company}</span>
          </CardDescription>
        </CardHeader>
        <div className="p-6 space-y-4">
          <div>
            <strong>Description:</strong>
            <div className="mt-1 text-muted-foreground">
              {job.description || "No description provided."}
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div>
              <strong>Job Type:</strong>{" "}
              <Badge variant="secondary" className="capitalize">
                {job.jobType.replace("_", " ")}
              </Badge>
            </div>
            <div>
              <strong>CV Required:</strong>{" "}
              <Badge variant={job.cvRequired ? "default" : "outline"}>
                {job.cvRequired ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
          <div>
            <strong>Required Skills:</strong>{" "}
            {job.requiredSkills && job.requiredSkills.length > 0 ? (
              job.requiredSkills.map((skill: string) => (
                <Badge key={skill} variant="secondary" className="mr-1">
                  {skill}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">None specified</span>
            )}
          </div>
          <div>
            <strong>Salary Range:</strong>{" "}
            {job.salaryRange && (job.salaryRange.min || job.salaryRange.max) ? (
              <span>
                {job.salaryRange.min && (
                  <>
                    Min:{" "}
                    <span className="font-medium">{job.salaryRange.min}</span>
                  </>
                )}
                {job.salaryRange.max && (
                  <>
                    {job.salaryRange.min && <span className="mx-1">|</span>}
                    Max:{" "}
                    <span className="font-medium">{job.salaryRange.max}</span>
                  </>
                )}
                {job.salaryRange.currency && (
                  <span className="ml-2 text-muted-foreground">
                    {job.salaryRange.currency}
                  </span>
                )}
              </span>
            ) : (
              <span className="text-muted-foreground">Not specified</span>
            )}
          </div>
          <div>
            <strong>Application Link:</strong>{" "}
            {job.actionUrl ? (
              <Button
                asChild
                variant="link"
                className="p-0 h-auto align-baseline"
              >
                <a
                  href={job.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-cyan-700"
                >
                  {job.actionUrl}
                  <ExternalLinkIcon className="h-4 w-4" />
                </a>
              </Button>
            ) : (
              <span className="text-muted-foreground">Not provided</span>
            )}
          </div>
          <div>
            <strong>Agent Profile:</strong>{" "}
            {job.agentProfile ? (
              <span className="text-muted-foreground">{job.agentProfile}</span>
            ) : (
              <span className="text-muted-foreground">N/A</span>
            )}
          </div>
        </div>
        <CardFooter>
          <div className="text-xs text-muted-foreground flex flex-col sm:flex-row sm:gap-4">
            <span>Job ID: {job.id}</span>
            <span>
              Posted:{" "}
              {job.createdAt ? new Date(job.createdAt).toLocaleString() : "N/A"}
            </span>
            <span>
              Updated:{" "}
              {job.updatedAt ? new Date(job.updatedAt).toLocaleString() : "N/A"}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
