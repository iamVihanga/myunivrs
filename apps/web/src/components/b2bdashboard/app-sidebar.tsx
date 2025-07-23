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
      url: "/dashboard/siteSettings",
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
      url: "/b2bdashboard/housing",
      icon: IconBuildings,
    },
    {
      name: "Jobs",
      url: "/b2bdashboard/jobs",
      icon: IconBuildings,
    },
    {
      name: "Events",
      url: "/b2bdashboard/events",
      icon: IconBuildings,
    },
    {
      name: "Products",
      url: "/b2bdashboard/products",
      icon: IconBuildings,
    },
    {
      name: "B2B plans",
      url: "/b2bdashboard/b2bplans",

      icon: IconBuildings,
    },
    {
      name: "B2B-Profile",
      url: "/b2bdashboard/b2bProfile",

      icon: IconBuildings,
    },
    {
      name: "Categories",
      url: "/b2bdashboard/categories",

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
