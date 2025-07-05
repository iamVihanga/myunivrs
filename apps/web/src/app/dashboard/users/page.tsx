"use client";
import {
  fetchUsers,
  GetUsersParams
} from "@/features/user-management/actions/get-users";
import { UsersDataTable } from "@/features/user-management/components/users-data-table";
import { transformUserToTableData } from "@/features/user-management/lib/utils";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Separator } from "@repo/ui/components/separator";
import { UserWithRole } from "better-auth/plugins";
import { UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {};

interface ResponseType {
  users: UserWithRole[];
  total: number;
  limit: number | undefined;
  offset: number | undefined;
}

export default function UsersPage({}: Props) {
  const [queryRes, setQueryRes] = useState<ResponseType>({
    users: [],
    total: 0,
    limit: undefined,
    offset: undefined
  });
  const [userType, setUserType] = useState<"all" | "app" | "admins">("all");
  const [userQueryParams, setUserQueryParams] = useState<GetUsersParams>({
    page: "1",
    limit: "8",
    sort: "desc",
    search: "",
    role: undefined
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    switch (userType) {
      case "all":
        setUserQueryParams({
          ...userQueryParams,
          role: undefined
        });
        break;
      case "app":
        setUserQueryParams({
          ...userQueryParams,
          role: "user"
        });
        break;
      case "admins":
        setUserQueryParams({
          ...userQueryParams,
          role: "admin"
        });
        break;
      default:
        setUserQueryParams({
          ...userQueryParams,
          role: undefined
        });
    }
  }, [userType]);

  useEffect(() => {
    handleFetchUsers();
  }, [userQueryParams]);

  const handleFetchUsers = async () => {
    try {
      setIsLoading(true);
      const users = await fetchUsers(userQueryParams);

      setQueryRes(users as ResponseType);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setUserQueryParams({
      ...userQueryParams,
      search: value,
      page: "1" // Reset to first page when searching
    });
  };

  const handlePageChange = (page: number) => {
    setUserQueryParams({
      ...userQueryParams,
      page: page.toString()
    });
  };

  const handlePageSizeChange = (pageSize: number) => {
    setUserQueryParams({
      ...userQueryParams,
      limit: pageSize.toString(),
      page: "1" // Reset to first page when changing page size
    });
  };

  console.log({ queryRes });

  return (
    <div className="container mx-auto py-8 px-3 max-w-5xl">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-heading">
            Manage Users
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your user accounts
          </p>
        </div>
        <Button asChild icon={<UserPlusIcon />}>
          <Link href="/dashboard/users/new">Create New User</Link>
        </Button>
      </div>

      <Separator />
      <div className="h-12 w-full flex items-center">
        <Button
          variant={userType === "all" ? `default` : "ghost"}
          className="h-full rounded-none"
          onClick={() => setUserType("all")}
        >
          All Users
        </Button>
        <Button
          variant={userType === "app" ? `default` : "ghost"}
          className="h-full rounded-none"
          onClick={() => setUserType("app")}
        >
          App Users
        </Button>
        <Button
          variant={userType === "admins" ? `default` : "ghost"}
          className="h-full rounded-none"
          onClick={() => setUserType("admins")}
        >
          System Admins
        </Button>
      </div>
      <Separator />

      {/* Search and Stats */}
      <div className="flex items-center justify-between gap-4 py-4">
        <Input
          placeholder="Search users by email..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
          disabled={isLoading}
        />
        <div className="text-sm text-muted-foreground">
          {queryRes.total} total users
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading users...</div>
        </div>
      ) : queryRes.users.length > 0 ? (
        <UsersDataTable
          data={queryRes.users.map(transformUserToTableData)}
          total={queryRes.total}
          currentPage={parseInt(userQueryParams.page || "1")}
          pageSize={parseInt(userQueryParams.limit || "8")}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onRefresh={handleFetchUsers}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <UserPlusIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No users found</h3>
          <p className="text-muted-foreground mb-6">
            {userType === "all"
              ? "There are no users in the system yet."
              : `There are no ${userType === "app" ? "app users" : "system admins"} yet.`}
          </p>
          <Button asChild>
            <Link href="/dashboard/users/new">Create New User</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
