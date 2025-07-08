import { client } from "@/lib/rpc";
import { Badge } from "@repo/ui/components/badge";
import { Card, CardContent } from "@repo/ui/components/card";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  DollarSign,
  InfoIcon,
  PackageIcon,
  Settings2Icon,
  StarIcon,
} from "lucide-react";
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

    return (
      <div className="container mx-auto py-8 px-3 max-w-5xl">
        {/* Back navigation */}
        <Link
          href="/dashboard/adzPaymentPlan"
          className="inline-flex items-center mb-6 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to payment plans
        </Link>

        <div className="flex flex-col gap-6">
          {/* Header section */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                <CreditCard className="w-7 h-7 text-cyan-600" />
                {plan.planName}
              </h1>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{plan.durationDays} days</span>
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
              <div className="text-2xl font-bold text-right flex items-center gap-1 justify-end">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                {Number(plan.price).toLocaleString()} {plan.currency}
              </div>
            </div>
          </div>

          {/* Modern Sectioned Content */}
          <div className="flex flex-col gap-6">
            <Card className="min-w-0">
              <CardContent className="space-y-6 pt-6">
                {/* Basic Info */}
                <section className="mb-6 p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-2 mb-4">
                    <InfoIcon className="w-5 h-5 text-cyan-600" />
                    <h2 className="font-semibold text-lg">Basic Information</h2>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Plan Name:</span>{" "}
                      <span>{plan.planName}</span>
                    </div>
                    <div>
                      <span className="font-medium">Description:</span>{" "}
                      <span>
                        {plan.description || "No description provided."}
                      </span>
                    </div>
                  </div>
                </section>

                {/* Plan Details */}
                <section className="mb-6 p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-2 mb-4">
                    <PackageIcon className="w-5 h-5 text-cyan-600" />
                    <h2 className="font-semibold text-lg">Plan Details</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Price:</span>{" "}
                      <span>
                        {Number(plan.price).toLocaleString()} {plan.currency}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>{" "}
                      <span>{plan.durationDays} days</span>
                    </div>
                    <div>
                      <span className="font-medium">Maximum Ads:</span>{" "}
                      <span>{plan.maxAds}</span>
                    </div>
                    <div>
                      <span className="font-medium">Currency:</span>{" "}
                      <span>{plan.currency}</span>
                    </div>
                  </div>
                </section>

                {/* Features */}
                <section className="mb-6 p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-2 mb-4">
                    <StarIcon className="w-5 h-5 text-cyan-600" />
                    <h2 className="font-semibold text-lg">Features</h2>
                  </div>
                  {plan.features ? (
                    <pre className="bg-slate-50 rounded p-4 text-sm overflow-x-auto">
                      {JSON.stringify(JSON.parse(plan.features), null, 2)}
                    </pre>
                  ) : (
                    <div className="text-muted-foreground">
                      No features specified
                    </div>
                  )}
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
                          plan.status === "published" ? "default" : "outline"
                        }
                        className="capitalize"
                      >
                        {plan.status}
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

            {/* Actions Card */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button variant="outline" className="w-full">
                    Edit Plan
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Delete Plan
                  </Button>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
