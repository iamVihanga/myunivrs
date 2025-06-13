"use client";
import { formatDistanceToNow } from "date-fns";
import { ExternalLinkIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
import Link from "next/link";
import { useId } from "react";
import type { Housing } from "../schemas";

type Props = {
  housing: Housing;
};

export function HousingCard({ housing }: Props) {
  const id = useId();

  // Default image if none provided
  const displayImage =
    housing.images && housing.images.length > 0
      ? housing.images[0]
      : "https://placehold.co/400x300?text=No+Image";

  return (
    <Card key={id} className="overflow-hidden flex flex-col h-full">
      <div className="w-full h-52 bg-muted">
        <img
          src={displayImage}
          alt={housing.title}
          className="w-full h-full object-cover"
        />
      </div>

      <CardHeader className="pt-4 pb-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="line-clamp-2">{housing.title}</CardTitle>
            <CardDescription className="p-0 mt-1">
              Added {formatDistanceToNow(housing.createdAt)} ago
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-sm line-clamp-3 text-muted-foreground">
          {housing.description || "No description provided"}
        </p>
      </CardContent>

      <Separator />

      <CardContent className="pt-3 pb-3">
        <div className="flex justify-end">
          <Button
            size="sm"
            icon={<ExternalLinkIcon className="h-4 w-4" />}
            variant="outline"
            asChild
          >
            <Link href={`/dashboard/housing/${housing.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
