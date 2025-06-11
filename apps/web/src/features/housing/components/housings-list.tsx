import { Card, CardContent } from "@repo/ui/components/card";
import { getAllHousing } from "../actions/getAll.action";
import { HousingCard } from "./housing-card";

export async function HousingsList() {
  const housingsData = await getAllHousing();

  // Convert string dates to Date objects
  const housings = housingsData.map((housing) => ({
    ...housing,
    createdAt: new Date(housing.createdAt),
    updatedAt: housing.updatedAt ? new Date(housing.updatedAt) : null
  }));

  return (
    <>
      {housings.length === 0 ? (
        <Card>
          <CardContent className="pt-6 pb-6 flex justify-center">
            <p className="text-muted-foreground">
              No housing listings found. Create one to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {housings.map((housing) => (
            <HousingCard key={housing.id} housing={housing} />
          ))}
        </div>
      )}
    </>
  );
}
