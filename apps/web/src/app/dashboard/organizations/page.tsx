"use client";

import { Building, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";

import { useListOrganizations } from "@/features/organizations/actions/use-list-organizations";
import { OrganizationsDataTable } from "@/features/organizations/components/organizations-data-table";
import { transformOrganizationToTableData } from "@/features/organizations/lib/utils";
import { QueryParamsSchema } from "@/features/organizations/types";

export default function OrganizationsPage() {
  const [queryParams, setQueryParams] = useState<QueryParamsSchema>({
    page: "1",
    limit: "10",
    sort: "desc"
  });

  const {
    data: organizationsResponse,
    isLoading,
    error,
    refetch
  } = useListOrganizations(queryParams);

  const handleRefresh = () => {
    refetch();
  };

  // Transform the data for the table
  const transformedData = organizationsResponse?.data
    ? organizationsResponse.data.map(transformOrganizationToTableData)
    : [];

  if (error) {
    return (
      <div className="container mx-auto py-8 px-3">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-red-600">
                Error Loading Organizations
              </CardTitle>
              <CardDescription>
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred"}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-3">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
              <Building className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 font-heading">
                Organizations
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and view all organizations in the system
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Organization
            </Button>
          </div>
        </div>

        {/* Stats */}
        {organizationsResponse?.meta && !isLoading && (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div className="ml-2">
                    <p className="text-sm font-medium leading-none">
                      Total Organizations
                    </p>
                    <p className="text-2xl font-bold">
                      {organizationsResponse.meta.totalCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="ml-2">
                    <p className="text-sm font-medium leading-none">
                      Current Page
                    </p>
                    <p className="text-2xl font-bold">
                      {organizationsResponse.meta.currentPage} of{" "}
                      {organizationsResponse.meta.totalPages}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Organizations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Organizations List</CardTitle>
          <CardDescription>
            A comprehensive list of all organizations in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrganizationsDataTable
            data={transformedData}
            isLoading={isLoading}
            onRefresh={handleRefresh}
          />
        </CardContent>
      </Card>
    </div>
  );
}
