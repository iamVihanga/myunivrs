import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
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
import { BriefcaseIcon, BuildingIcon, ClockIcon } from "lucide-react";

export function JobsSection() {
  // Dummy data
  const jobs = [
    {
      id: 1,
      title: "Research Assistant",
      company: "University Research Lab",
      location: "On Campus",
      type: "Part-time",
      status: "applied",
      date: "2023-06-15",
      logo: "/logos/university.png"
    },
    {
      id: 2,
      title: "Web Developer Intern",
      company: "Tech Solutions Inc.",
      location: "Remote",
      type: "Internship",
      status: "interview",
      date: "2023-06-10",
      logo: "/logos/tech.png"
    },
    {
      id: 3,
      title: "Campus Tour Guide",
      company: "University Admissions",
      location: "On Campus",
      type: "Part-time",
      status: "applied",
      date: "2023-06-05",
      logo: "/logos/university.png"
    },
    {
      id: 4,
      title: "Library Assistant",
      company: "University Library",
      location: "On Campus",
      type: "Part-time",
      status: "rejected",
      date: "2023-05-20",
      logo: "/logos/university.png"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "applied":
        return <Badge variant="secondary">Applied</Badge>;
      case "interview":
        return <Badge className="bg-amber-500">Interview</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "offered":
        return <Badge className="bg-green-500">Offered</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Job Applications</h2>
        <Button className="bg-primary hover:bg-primary/90">Find Jobs</Button>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-muted">
                      {job.company.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{job.title}</CardTitle>
                    <CardDescription>{job.company}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(job.status)}
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <BuildingIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BriefcaseIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Applied {job.date}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
