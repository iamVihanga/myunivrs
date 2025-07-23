import React from "react";

import { AppSidebar } from "@/components/b2bdashboard/app-sidebar";
import { SiteHeader } from "@/components/b2bdashboard/site-header";
import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar";

type Props = {
  children?: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-primary-foreground">
        <SiteHeader />

        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
