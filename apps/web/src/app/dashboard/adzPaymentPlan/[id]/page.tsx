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
import { format } from "date-fns";
import { ArrowLeft, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function SingleAdsPaymentPlanPage({ params }: Props) {
  const rpcClient = await client();

  try {
    const adsPaymentPlanRes = await rpcClient.api["ads-payment-plan"][
      ":id"
    ].$get({
      param: { id: params.id },
    });

    if (adsPaymentPlanRes.status !== 200) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          Something went wrong
        </div>
      );
    }

    const plan = await adsPaymentPlanRes.json();

    // Format dates for display
    const formattedCreatedDate = format(new Date(plan.createdAt), "PPP");
    const formattedUpdatedDate = plan.updatedAt
      ? format(new Date(plan.updatedAt), "PPP")
      : null;

    // Format features JSON for display
    let featuresDisplay: React.ReactNode = "No features";
    if (plan.features && Object.keys(plan.features).length > 0) {
      featuresDisplay = (
        <pre className="bg-slate-50 rounded p-2 text-xs overflow-x-auto">
          {JSON.stringify(plan.features, null, 2)}
        </pre>
      );
    }

    return (
      <div className="container mx-auto py-8 px-3 max-w-5xl">
        {/* Back navigation */}
        <Link
          href="/dashboard/adsPaymentPlan"
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
                {plan.planName}
              </h1>
              <div className="flex items-center text-muted-foreground">
                <span>{plan.currency}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-end">
                <Badge
                  variant={plan.status === "published" ? "default" : "outline"}
                  className="capitalize"
                >
                  {plan.status}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-right">
                ${Number(plan.price).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main info card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Plan Details</CardTitle>
                <CardDescription>
                  Payment plan information and description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <p>{plan.description || "No description provided."}</p>
                </div>

                <Separator />

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Plan ID
                    </dt>
                    <dd className="mt-1 text-sm">{plan.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Price
                    </dt>
                    <dd className="mt-1 text-sm flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                      {Number(plan.price).toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm">
                      <Badge
                        variant={
                          plan.status === "published" ? "default" : "outline"
                        }
                        className="capitalize"
                      >
                        {plan.status}
                      </Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Currency
                    </dt>
                    <dd className="mt-1 text-sm">{plan.currency}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Duration (days)
                    </dt>
                    <dd className="mt-1 text-sm">{plan.durationDays}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Max Ads
                    </dt>
                    <dd className="mt-1 text-sm">{plan.maxAds}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Features
                    </dt>
                    <dd className="mt-1 text-sm">{featuresDisplay}</dd>
                  </div>
                </dl>
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
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
