"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import {
  Calendar,
  Edit,
  Mail,
  MoreVertical,
  Shield,
  Trash2,
  User,
  UserCheck,
  UserX
} from "lucide-react";
import * as React from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@repo/ui/components/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/ui/components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@repo/ui/components/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@repo/ui/components/tooltip";
import { toast } from "sonner";
import { unbanUser } from "../actions/update-user";
import {
  UserTableData,
  getUserInitials,
  getUserRoleBadgeVariant
} from "../lib/utils";
import { BanUserModal } from "./ban-user-modal";
import { DeleteUserModal } from "./delete-user-modal";
import { UpdateRoleModal } from "./update-role-modal";

// Create the actions column with modal functionality
const createActionsColumn = (
  setSelectedUser: (user: UserTableData) => void,
  setUpdateRoleModalOpen: (open: boolean) => void,
  setBanUserModalOpen: (open: boolean) => void,
  setDeleteUserModalOpen: (open: boolean) => void,
  handleUnbanUser: (user: UserTableData) => void
): ColumnDef<UserTableData> => ({
  id: "actions",
  header: "Actions",
  cell: ({ row }) => {
    const user = row.original;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" size="icon">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => {
              setSelectedUser(user);
              setUpdateRoleModalOpen(true);
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Update Role
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {user.banned ? (
            <DropdownMenuItem
              onClick={() => handleUnbanUser(user)}
              className="text-green-600 focus:text-green-600"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Unban User
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                setSelectedUser(user);
                setBanUserModalOpen(true);
              }}
              className="text-orange-600 focus:text-orange-600"
            >
              <UserX className="h-4 w-4 mr-2" />
              Ban User
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setSelectedUser(user);
              setDeleteUserModalOpen(true);
            }}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
});

const columns: ColumnDef<UserTableData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      const initials = getUserInitials(user.name);

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {user.email}
            </span>
          </div>
        </div>
      );
    },
    enableHiding: false
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge variant={getUserRoleBadgeVariant(role)} className="px-2">
          {role === "admin" ? (
            <Shield className="h-3 w-3 mr-1" />
          ) : (
            <User className="h-3 w-3 mr-1" />
          )}
          {role === "admin" ? "Admin" : "User"}
        </Badge>
      );
    }
  },
  {
    accessorKey: "emailVerified",
    header: "Email Status",
    cell: ({ row }) => {
      const verified = row.original.emailVerified;
      return (
        <Badge variant={verified ? "default" : "destructive"} className="px-2">
          {verified ? (
            <UserCheck className="h-3 w-3 mr-1" />
          ) : (
            <UserX className="h-3 w-3 mr-1" />
          )}
          {verified ? "Verified" : "Unverified"}
        </Badge>
      );
    }
  },
  {
    accessorKey: "banned",
    header: "Status",
    cell: ({ row }) => {
      const user = row.original;
      const banned = user.banned;

      if (banned && user.banReason) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="destructive" className="px-2 cursor-help">
                  Banned
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  <strong>Reason:</strong> {user.banReason}
                  {user.banExpires && (
                    <>
                      <br />
                      <strong>Expires:</strong>{" "}
                      {new Date(user.banExpires).toLocaleDateString()}
                    </>
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      return (
        <Badge variant={banned ? "destructive" : "default"} className="px-2">
          {banned ? "Banned" : "Active"}
        </Badge>
      );
    }
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {date.toLocaleDateString()}
        </div>
      );
    }
  }
];

interface UsersDataTableProps {
  data: UserTableData[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRefresh?: () => void;
}

export function UsersDataTable({
  data,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onRefresh
}: UsersDataTableProps) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Modal states
  const [selectedUser, setSelectedUser] = React.useState<UserTableData | null>(
    null
  );
  const [updateRoleModalOpen, setUpdateRoleModalOpen] = React.useState(false);
  const [banUserModalOpen, setBanUserModalOpen] = React.useState(false);
  const [deleteUserModalOpen, setDeleteUserModalOpen] = React.useState(false);

  // Handle unban user
  const handleUnbanUser = async (user: UserTableData) => {
    try {
      await unbanUser(user.id);
      toast.success(`User "${user.name}" has been unbanned successfully!`);
      onRefresh?.();
    } catch (error: any) {
      toast.error(`Failed to unban user: ${error.message}`);
    }
  };

  // Modal success handlers
  const handleModalSuccess = () => {
    onRefresh?.();
  };

  // Create columns with action handlers
  const columnsWithActions = React.useMemo(
    () => [
      ...columns,
      createActionsColumn(
        setSelectedUser,
        setUpdateRoleModalOpen,
        setBanUserModalOpen,
        setDeleteUserModalOpen,
        handleUnbanUser
      )
    ],
    []
  );

  const table = useReactTable({
    data,
    columns: columnsWithActions,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    pageCount: Math.ceil(total / pageSize)
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">
      {/* Page Size Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Show</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(parseInt(value))}
          >
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="8">8</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm font-medium">entries</span>
        </div>

        {/* Bulk Actions */}
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // TODO: Implement bulk actions
                console.log(
                  "Bulk actions for:",
                  table
                    .getFilteredSelectedRowModel()
                    .rows.map((row) => row.original.id)
                );
              }}
            >
              Actions ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnsWithActions.length}
                  className="h-24 text-center"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of {data.length}{" "}
          row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, total)} of {total} entries
            </span>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={currentPage <= 1}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage >= totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedUser && (
        <>
          <UpdateRoleModal
            user={selectedUser}
            open={updateRoleModalOpen}
            onOpenChange={setUpdateRoleModalOpen}
            onSuccess={handleModalSuccess}
          />
          <BanUserModal
            user={selectedUser}
            open={banUserModalOpen}
            onOpenChange={setBanUserModalOpen}
            onSuccess={handleModalSuccess}
          />
          <DeleteUserModal
            user={selectedUser}
            open={deleteUserModalOpen}
            onOpenChange={setDeleteUserModalOpen}
            onSuccess={handleModalSuccess}
          />
        </>
      )}
    </div>
  );
}
