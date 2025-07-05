import { UserWithRole } from "better-auth/plugins";

export interface UserTableData {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: "user" | "admin";
  banned: boolean | null;
  banReason: string | null;
  banExpires: string | null;
}

// Transform function to convert API response to table data format
export const transformUserToTableData = (user: UserWithRole): UserTableData => {
  return {
    id: user.id,
    name: user.name || "Unknown User",
    email: user.email,
    emailVerified: user.emailVerified || false,
    image: user.image || null,
    createdAt:
      typeof user.createdAt === "string"
        ? user.createdAt
        : user.createdAt?.toISOString() || "",
    updatedAt:
      typeof user.updatedAt === "string"
        ? user.updatedAt
        : user.updatedAt?.toISOString() || "",
    role: user.role as "user" | "admin",
    banned: user.banned || null,
    banReason: user.banReason || null,
    banExpires: user.banExpires
      ? typeof user.banExpires === "string"
        ? user.banExpires
        : user.banExpires.toISOString()
      : null
  };
};

export const getUserInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const getUserRoleBadgeVariant = (role: "user" | "admin") => {
  return role === "admin" ? "default" : "secondary";
};

export const getUserStatusBadgeVariant = (banned: boolean | null) => {
  return banned ? "destructive" : "default";
};

export const getEmailStatusBadgeVariant = (verified: boolean) => {
  return verified ? "default" : "destructive";
};

export const formatJoinDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Placeholder functions for user actions - to be implemented
export const viewUser = (userId: string) => {
  console.log("View user:", userId);
  // TODO: Implement view user functionality
  // This could open a modal or navigate to a detailed user page
};

export const editUser = (userId: string) => {
  console.log("Edit user:", userId);
  // TODO: Implement edit user functionality
  // This could open an edit form or navigate to an edit page
};

export const banUser = (userId: string, reason?: string) => {
  console.log("Ban user:", userId, "Reason:", reason);
  // TODO: Implement ban user functionality
  // This should call an API to ban the user
};

export const unbanUser = (userId: string) => {
  console.log("Unban user:", userId);
  // TODO: Implement unban user functionality
  // This should call an API to unban the user
};

export const deleteUser = (userId: string) => {
  console.log("Delete user:", userId);
  // TODO: Implement delete user functionality
  // This should show a confirmation dialog and then delete the user
};
