import { client } from "@/lib/rpc";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { format } from "date-fns";
import { ArrowLeft, BellIcon, InfoIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function SingleNotificationPage({ params }: Props) {
  const rpcClient = await client();

  try {
    const response = await rpcClient.api.notifications[":id"].$get({
      param: { id: params.id },
    });

    if (response.status !== 200) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          Something went wrong
        </div>
      );
    }

    const notification = await response.json();

    const formattedCreatedDate = format(
      new Date(notification.createdAt),
      "PPP"
    );
    const formattedUpdatedDate = notification.updatedAt
      ? format(new Date(notification.updatedAt), "PPP")
      : null;

    return (
      <div className="container mx-auto py-8 px-3 max-w-3xl">
        {/* Back navigation */}
        <Link
          href="/dashboard/notifications"
          className="inline-flex items-center mb-6 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to notifications
        </Link>

        <Card>
          <CardHeader className="flex flex-col gap-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <BellIcon className="w-5 h-5 text-cyan-600" />
              {notification.title}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Created on {formattedCreatedDate}
              {formattedUpdatedDate && (
                <> · Updated on {formattedUpdatedDate}</>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <section>
              <div className="flex items-center gap-2 mb-1">
                <InfoIcon className="h-4 w-4 text-cyan-600" />
                <h2 className="font-semibold text-sm">Message</h2>
              </div>
              <p className="text-sm text-gray-800">{notification.message}</p>
            </section>

            <section className="flex items-center gap-2">
              <span className="font-medium text-sm">Status:</span>
              <Badge
                variant={notification.read ? "default" : "outline"}
                className="capitalize"
              >
                {notification.read ? "Read" : "Unread"}
              </Badge>
            </section>
          </CardContent>

          <CardFooter>
            <Button variant="default" className="w-full" asChild>
              <Link href="/dashboard/notifications">Go Back</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
