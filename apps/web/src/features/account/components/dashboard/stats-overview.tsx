import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import {
  BriefcaseIcon,
  CalendarIcon,
  HomeIcon,
  RepeatIcon,
  ShoppingBagIcon
} from "lucide-react";

export function StatsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">
            Housing Listings
          </CardTitle>
          <HomeIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-heading font-bold">3</div>
          <p className="text-xs text-muted-foreground">+1 listing this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">
            Job Applications
          </CardTitle>
          <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-heading font-bold">7</div>
          <p className="text-xs text-muted-foreground">2 in progress</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Events</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-heading font-bold">12</div>
          <p className="text-xs text-muted-foreground">3 upcoming this week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Products</CardTitle>
          <ShoppingBagIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-heading font-bold">5</div>
          <p className="text-xs text-muted-foreground">2 sold this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Sell & Swaps</CardTitle>
          <RepeatIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-heading font-bold">8</div>
          <p className="text-xs text-muted-foreground">3 active listings</p>
        </CardContent>
      </Card>
    </div>
  );
}
