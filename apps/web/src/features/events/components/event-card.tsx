"use client";
import { format, formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  ExternalLinkIcon,
  MapPinIcon,
  PartyPopperIcon,
  TrashIcon
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@repo/ui/components/alert-dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import Link from "next/link";
import { useId } from "react";
import { deleteEvent } from "../actions/delete.action";
import type { Event } from "../schemas";

type Props = {
  event: Event;
};

export function EventCard({ event }: Props) {
  const id = useId();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Default image if none provided
  const displayImage =
    event.images && event.images.length > 0 ? event.images[0] : "";

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteEvent(event.id);
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error("Failed to delete event");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Format the event date
  const eventDateFormatted = format(new Date(event.eventDate), "PPP");
  const isEventFeatured = event.isFeatured;

  return (
    <>
      <Card
        key={id}
        className="transition-all hover:shadow-lg border-l-4 border-l-indigo-500 p-4"
      >
        <div className="flex items-center gap-4">
          {/* Avatar section */}
          <Avatar className="h-16 w-16 rounded-full border">
            <AvatarImage
              src={displayImage}
              alt={event.title}
              className="size-16"
            />
            <AvatarFallback className="bg-indigo-50 text-indigo-700">
              <PartyPopperIcon className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>

          {/* Main content section */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold line-clamp-1">{event.title}</h3>
                  {isEventFeatured && (
                    <Badge className="bg-amber-500 text-white border-amber-500">
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Added {formatDistanceToNow(new Date(event.createdAt))} ago
                </p>
              </div>
            </div>

            {/* Info with separators */}
            <div className="flex flex-wrap items-center gap-2 text-sm mt-2">
              {event.location && (
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="text-sm truncate max-w-[180px]">
                    {event.location}
                  </span>
                </div>
              )}

              {event.location && event.eventDate && (
                <div className="text-gray-300 text-sm px-1">|</div>
              )}

              {event.eventDate && (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3.5 w-3.5 text-purple-500" />
                  <span className="text-sm font-medium">
                    {eventDateFormatted}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions section */}
          <div className="flex items-center gap-2 ml-2 shrink-0">
            <Badge
              variant="outline"
              className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs w-fit"
            >
              {event.status || "Published"}
            </Badge>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="h-8 px-2"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" asChild className="h-8 px-2">
              <Link href={`/dashboard/events/${event.id}`}>
                <ExternalLinkIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the event "{event.title}". This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Event"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}