import { authClient } from "@/lib/auth-client";

export type CreateUserParams = {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
};

export async function createUser({
  name,
  email,
  password,
  role
}: CreateUserParams) {
  const response = await authClient.admin.createUser({
    name,
    email,
    password,
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
