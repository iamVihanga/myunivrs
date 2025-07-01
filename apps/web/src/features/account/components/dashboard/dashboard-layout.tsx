"use client";

import { EventsSection } from "@/features/account/sections/events-section";
import { HousingSection } from "@/features/account/sections/housing-section";
import { JobsSection } from "@/features/account/sections/jobs-section";
import { ProductsSection } from "@/features/account/sections/products-section";
import { SellSwapsSection } from "@/features/account/sections/sell-swaps-section";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@repo/ui/components/tabs";
import { DashboardHeader } from "./dashboard-header";
import { StatsOverview } from "./stats-overview";

export function AccountDashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-6">
        <StatsOverview />

        <Tabs defaultValue="housing" className="mt-8 bg-white p-6 rounded-md">
          <TabsList className="grid w-full grid-cols-5 bg-transparent gap-4">
            <TabsTrigger
              className="shadow-none border border-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 rounded-full bg-secondary"
              value="housing"
            >
              Housing
            </TabsTrigger>
            <TabsTrigger
              className="shadow-none border border-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 rounded-full bg-secondary"
              value="jobs"
            >
              Jobs
            </TabsTrigger>
            <TabsTrigger
              className="shadow-none border border-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 rounded-full bg-secondary"
              value="events"
            >
              Events
            </TabsTrigger>
            <TabsTrigger
              className="shadow-none border border-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 rounded-full bg-secondary"
              value="products"
            >
              Products
            </TabsTrigger>
            <TabsTrigger
              className="shadow-none border border-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 rounded-full bg-secondary"
              value="sell-swaps"
            >
              Sell & Swaps
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] mt-6">
            <TabsContent value="housing">
              <HousingSection />
            </TabsContent>

            <TabsContent value="jobs">
              <JobsSection />
            </TabsContent>

            <TabsContent value="events">
              <EventsSection />
            </TabsContent>

            <TabsContent value="products">
              <ProductsSection />
            </TabsContent>

            <TabsContent value="sell-swaps">
              <SellSwapsSection />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
}
