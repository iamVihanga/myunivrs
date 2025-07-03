import { client } from "@/lib/rpc";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Globe, ImageIcon, Mail } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function SingleSiteSettingPage({ params }: Props) {
  const rpcClient = await client();

  try {
    const siteSettingRes = await rpcClient.api["site-settings"][":id"].$get({
      param: { id: params.id },
    });

    if (siteSettingRes.status !== 200) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          Something went wrong
        </div>
      );
    }

    const siteSetting = await siteSettingRes.json();

    // Format dates for display
    const formattedCreatedDate = format(new Date(siteSetting.createdAt), "PPP");
    const formattedUpdatedDate = siteSetting.updatedAt
      ? format(new Date(siteSetting.updatedAt), "PPP")
      : null;

    return (
      <div className="container mx-auto py-8 px-3 max-w-3xl">
        {/* Back navigation */}
        <Link
          href="/dashboard/siteSettings"
          className="inline-flex items-center mb-6 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to site settings
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {siteSetting.siteName}
              {siteSetting.logoUrl && (
                <span>
                  <img
                    src={siteSetting.logoUrl}
                    alt="Logo"
                    className="inline-block h-8 w-8 rounded ml-2 border"
                  />
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {siteSetting.siteDescription || "No description provided."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Site ID
                </dt>
                <dd className="mt-1 text-sm">{siteSetting.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Primary Email
                </dt>
                <dd className="mt-1 text-sm flex items-center gap-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {siteSetting.primaryEmail || (
                    <span className="italic text-muted-foreground">
                      Not set
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Logo URL
                </dt>
                <dd className="mt-1 text-sm flex items-center gap-1">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  {siteSetting.logoUrl ? (
                    <a
                      href={siteSetting.logoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Logo
                    </a>
                  ) : (
                    <span className="italic text-muted-foreground">
                      Not set
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Favicon URL
                </dt>
                <dd className="mt-1 text-sm flex items-center gap-1">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  {siteSetting.faviconUrl ? (
                    <a
                      href={siteSetting.faviconUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Favicon
                    </a>
                  ) : (
                    <span className="italic text-muted-foreground">
                      Not set
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Created: {formattedCreatedDate}
                </span>
              </div>
              {formattedUpdatedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Updated: {formattedUpdatedDate}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Edit</Button>
              <Button variant="destructive">Delete</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
