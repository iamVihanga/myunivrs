"use client";
import { NewSiteSetting } from "@/features/siteSettings/components/new-siteSetting";

export default function SiteSettingPage() {
  return (
    <div className="container mx-auto py-8 px-3 max-w-2xl">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Site Setting</h1>
      <p className="text-muted-foreground mb-6">
        Manage your site settings below.
      </p>
      <NewSiteSetting />
    </div>
  );
}
