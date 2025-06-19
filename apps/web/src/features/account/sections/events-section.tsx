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
import { 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon, 
  UsersIcon,
  PartyPopperIcon 
} from "lucide-react";
import { format } from "date-fns";

export function EventsSection() {
  // Dummy data
  const events = [
    {
      id: 1,
      title: "Spring Campus Festival",
      location: "University Square",
      date: new Date("2023-06-25T13:00:00"),
      attendees: 120,
      going: true,
      isFeatured: true
    },
    {
      id: 2,
      title: "Tech Career Fair",
      location: "Engineering Building",
      date: new Date("2023-06-20T10:00:00"),
      attendees: 75,
      going: true,
      isFeatured: false
    },
    {
      id: 3,
      title: "Student Networking Mixer",
      location: "Student Union",
      date: new Date("2023-06-18T18:00:00"),
      attendees: 50,
      going: true,
      isFeatured: false
    },
    {
      id: 4,
      title: "Graduate Research Symposium",
      location: "Science Center",
      date: new Date("2023-06-30T09:00:00"),
      attendees: 65,
      going: false,
      isFeatured: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Events</h2>
        <Button className="bg-primary hover:bg-primary/90">
          Browse Events
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPinIcon className="h-3.5 w-3.5" />
                    <span>{event.location}</span>
                  </CardDescription>
                </div>
                {event.isFeatured && (
                  <Badge className="bg-amber-500">
                    <PartyPopperIcon className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{format(event.date, "MMM dd, yyyy")}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ClockIcon className="h-4 w-4" />
                  <span>{format(event.date, "h:mm a")}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <UsersIcon className="h-4 w-4" />
                  <span>{event.attendees} attending</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant={event.going ? "default" : "outline"} size="sm" className="flex-1">
                {event.going ? "Going" : "RSVP"}
              </Button>
              <Button variant="outline" size="sm">
                Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}