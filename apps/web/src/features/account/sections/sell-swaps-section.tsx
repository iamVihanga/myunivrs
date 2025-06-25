import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { RepeatIcon, CalendarIcon, TagIcon } from "lucide-react";

export function SellSwapsSection() {
  // Dummy data
  const items = [
    {
      id: 1,
      title: "Swap: Fiction Books for Computer Science Books",
      type: "swap",
      category: "Books",
      postedDate: "2023-06-05",
      status: "active",
      description: "I have a collection of fiction novels and looking to swap for computer science textbooks."
    },
    {
      id: 2,
      title: "Selling: Dorm Room Decor Bundle",
      type: "sell",
      category: "Home Decor",
      price: 35,
      postedDate: "2023-06-02",
      status: "active",
      description: "Complete set of dorm room decor including string lights, posters, and wall hangings."
    },
    {
      id: 3,
      title: "Swap: Gaming Console for Laptop",
      type: "swap",
      category: "Electronics",
      postedDate: "2023-05-28",
      status: "pending",
      description: "Looking to swap my gaming console for a laptop for school."
    },
    {
      id: 4,
      title: "Selling: Acoustic Guitar",
      type: "sell",
      category: "Musical Instruments",
      price: 150,
      postedDate: "2023-05-20",
      status: "completed",
      description: "Acoustic guitar in excellent condition, comes with case and tuner."
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500">Active</Badge>;
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sell & Swaps</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            New Swap
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            Sell Item
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <RepeatIcon className="h-3.5 w-3.5" />
                    <span>{item.category}</span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={item.type === "swap" ? "outline" : "default"}>
                    {item.type === "swap" ? "Swap" : "Sell"}
                  </Badge>
                  {getStatusBadge(item.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                {item.type === "sell" && item.price && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <TagIcon className="h-4 w-4" />
                    <span>${item.price}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Posted: {item.postedDate}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="outline" size="sm">
                View Offers
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}