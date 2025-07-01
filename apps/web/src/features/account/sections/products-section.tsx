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
import { BoxIcon, TagIcon } from "lucide-react";

export function ProductsSection() {
  // Dummy data
  const products = [
    {
      id: 1,
      name: "Textbook: Introduction to Computer Science",
      category: "Books",
      price: 65,
      condition: "Like New",
      listed: "2023-06-01",
      status: "available"
    },
    {
      id: 2,
      name: "Desk Lamp",
      category: "Furniture",
      price: 25,
      condition: "Good",
      listed: "2023-05-25",
      status: "available"
    },
    {
      id: 3,
      name: "Scientific Calculator",
      category: "Electronics",
      price: 45,
      condition: "Excellent",
      listed: "2023-05-20",
      status: "pending"
    },
    {
      id: 4,
      name: "Bike - Mountain",
      category: "Transportation",
      price: 120,
      condition: "Used",
      listed: "2023-05-15",
      status: "sold"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-emerald-500">Available</Badge>;
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>;
      case "sold":
        return <Badge variant="secondary">Sold</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Products</h2>
        <Button className="bg-primary hover:bg-primary/90">
          List New Product
        </Button>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{product.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <BoxIcon className="h-3.5 w-3.5" />
                    <span>{product.category}</span>
                  </CardDescription>
                </div>
                {getStatusBadge(product.status)}
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <TagIcon className="h-4 w-4" />
                  <span>${product.price}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span>Condition: {product.condition}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span>Listed: {product.listed}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                Edit Listing
              </Button>
              {product.status !== "sold" && (
                <Button variant="outline" size="sm">
                  Mark as Sold
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
