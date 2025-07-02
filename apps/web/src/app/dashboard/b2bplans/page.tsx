import { B2bplanssList } from "@/features/b2bplans/components/b2bplans-list";
import { NewB2bplans } from "@/features/b2bplans/components/new-b2bplans";

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

export default function B2bplansPage({ searchParams }: PageProps) {
  const { page = "1", search = "" } = searchParams;

  return (
    <div className="container mx-auto py-8 px-3 max-w-5xl">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">B2bplans Listings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your property listings
          </p>
        </div>
        <NewB2bplans />
      </div>

      <B2bplanssList page={page} search={search} />
    </div>
  );
}
