"use client";

import {
  IconBuildings,
  IconDashboard,
  IconHelp,
  IconInnerShadowTop,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";
import * as React from "react";

import { NavDocuments } from "@/components/dashboard/nav-documents";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
import { authClient } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";
import { Skeleton } from "@repo/ui/components/skeleton";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Housing",
      url: "/dashboard/housing",
      icon: IconBuildings,
    },
    {
      name: "Sell/Swap",
      url: "/dashboard/sellswap",
      icon: IconBuildings,
    },
    {
      name: "Jobs",
      url: "/dashboard/jobs",
      icon: IconBuildings,

    },
    
    {
      name: "University",
      url: "/dashboard/university",
      icon: IconBuildings,
    },
    {
      name: "Ads Payment Plan",
      url: "/dashboard/adzPaymentPlan",
      icon: IconBuildings,
    },
    {
      name: "Site Settings",
      url: "/dashboard/siteSettings",
      icon: IconBuildings,
    },
    {
      name: "Products",
      url: "/dashboard/products",
      icon: IconBuildings,
    },
    {
      name: "Ads",
      url: "/dashboard/ads",
      icon: IconBuildings,
    },
    {
      name: "b2bplans",
      url: "/dashboard/b2bplans",

      icon: IconBuildings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const activeOrg = authClient.useActiveOrganization();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {activeOrg.isPending ? (
              <Skeleton className="h-6 w-full rounded-md" />
            ) : activeOrg.data ? (
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <div>
                  <IconInnerShadowTop className="!size-5" />
                  <span className="text-base font-semibold">
                    {activeOrg.data.name}
                  </span>
                </div>
              </SidebarMenuButton>
            ) : (
              <></>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
