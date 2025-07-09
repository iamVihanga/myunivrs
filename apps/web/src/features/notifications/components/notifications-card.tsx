"use client";

import { formatDistanceToNow } from "date-fns";
import { ExternalLinkIcon, TrashIcon } from "lucide-react";
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
  AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import Link from "next/link";

import { deleteNotifications } from "../actions/delete.action";
import type { Notification } from "../schemas";
import { EditNotificationDialog } from "./edit-notification-dialog";

type Props = {
  notification: Notification;
};

export function NotificationsCard({ notification }: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteNotifications(notification.id);
      toast.success("Notification deleted successfully");
    } catch (error) {
      toast.error("Failed to delete notification");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card className="p-4 transition-all hover:shadow-md border-l-4 border-cyan-500">
        <div className="flex justify-between gap-4 items-start">
          <div className="flex flex-col space-y-1">
            <h3 className="font-semibold text-lg">{notification.title}</h3>
            <p className="text-muted-foreground text-sm">
              {notification.message}
            </p>
            <p className="text-xs text-gray-500">
              Created {formatDistanceToNow(new Date(notification.createdAt))}{" "}
              ago
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Add Edit button here */}
            <EditNotificationDialog notification={notification} />

            <Button size="sm" variant="outline" asChild className="h-8 px-2">
              <Link href={`/dashboard/notifications/${notification.id}`}>
                <ExternalLinkIcon className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="h-8 px-2"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this notification?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the notification titled "
              <strong>{notification.title}</strong>". This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Notification"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
