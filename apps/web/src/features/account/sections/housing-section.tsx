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
import { DollarSignIcon, ExternalLinkIcon, MapPinIcon } from "lucide-react";

export function HousingSection() {
  // Dummy data
  const housings = [
    {
      id: 1,
      title: "Cozy Studio Apartment",
      address: "123 University Ave, Campus Town",
      price: 850,
      bedrooms: 0,
      bathrooms: 1,
      status: "active",
      createdAt: "2023-05-15",
      image: "/images/apartment1.jpg"
    },
    {
      id: 2,
      title: "Shared 2BR Apartment",
      address: "456 College St, Downtown",
      price: 650,
      bedrooms: 2,
      bathrooms: 1,
      status: "active",
      createdAt: "2023-06-01",
      image: "/images/apartment2.jpg"
    },
    {
      id: 3,
      title: "Modern 1BR near Campus",
      address: "789 Student Drive, University Heights",
      price: 950,
      bedrooms: 1,
      bathrooms: 1,
      status: "pending",
      createdAt: "2023-06-10",
      image: "/images/apartment3.jpg"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Housing Listings</h2>
        <Button className="bg-primary hover:bg-primary/90">
          Add New Listing
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {housings.map((housing) => (
          <Card key={housing.id} className="overflow-hidden">
            <div className="aspect-video w-full overflow-hidden">
              <div className="h-48 bg-muted w-full"></div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="line-clamp-1">{housing.title}</CardTitle>
                <Badge
                  variant={
                    housing.status === "active" ? "default" : "secondary"
                  }
                >
                  {housing.status}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1">
                <MapPinIcon className="h-3.5 w-3.5" />
                <span className="line-clamp-1">{housing.address}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <DollarSignIcon className="h-4 w-4 mr-1 text-primary" />
                  <span className="font-bold">${housing.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">
                    /month
                  </span>
                </div>
                <div className="text-muted-foreground text-sm">
                  {housing.bedrooms} bed · {housing.bathrooms} bath
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ExternalLinkIcon className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
