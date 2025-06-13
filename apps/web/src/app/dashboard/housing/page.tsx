import { HousingsList } from "@/features/housing/components/housings-list";
import { NewHousing } from "@/features/housing/components/new-housing";

export default function HousingPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Housing Listings</h1>
        <NewHousing />
      </div>

      <HousingsList />
    </div>
  );
}
