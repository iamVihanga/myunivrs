import { AdsPaymentPlanList } from "@/features/adzPaymentPlan/components/adzPaymentPlan-list";
import { NewAdsPaymentPlan } from "@/features/adzPaymentPlan/components/new-adzPaymentPlan";

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

export default function AdzPaymentPlanPage({ searchParams }: PageProps) {
  const { page = "1", search = "" } = searchParams;

  return (
    <div className="container mx-auto py-8 px-3 max-w-5xl">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Ads Payment Plan Listings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your property listings
          </p>
        </div>
        <NewAdsPaymentPlan />
      </div>

      <AdsPaymentPlanList page={page} search={search} />
    </div>
  );
}
