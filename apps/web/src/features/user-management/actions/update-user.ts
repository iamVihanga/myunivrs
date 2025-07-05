import { authClient } from "@/lib/auth-client";

export type UpdateUserRoleParams = {
  userId: string;
  role: "user" | "admin";
};

export async function updateUserRole({ userId, role }: UpdateUserRoleParams) {
  const response = await authClient.admin.setRole({
    userId,
    role
  });

  const { data, error } = response;
  console.log({ data, error });

  if (error) {
    console.log(error);
    throw new Error(`${error.message}`);
  }

  return data;
}

export type BanUserParams = {
  userId: string;
  banReason?: string;
  banExpiresIn?: number; // seconds
};

export async function banUser({
  userId,
  banReason = "No reason provided",
  banExpiresIn
}: BanUserParams) {
  const response = await authClient.admin.banUser({
    userId,
    banReason,
    ...(banExpiresIn && { banExpiresIn })
  });

  const { data, error } = response;
  console.log({ data, error });

  if (error) {
    console.log(error);
    throw new Error(`${error.message}`);
  }

  return data;
}

export async function unbanUser(userId: string) {
  const response = await authClient.admin.unbanUser({
    userId
  });

  const { data, error } = response;
  console.log({ data, error });

  if (error) {
    console.log(error);
    throw new Error(`${error.message}`);
  }

  return data;
}

export async function deleteUser(userId: string) {
  const response = await authClient.admin.removeUser({
    userId
  });

  const { data, error } = response;
  console.log({ data, error });

  if (error) {
    console.log(error);
    throw new Error(`${error.message}`);
  }

  return data;
}
