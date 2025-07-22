import {
  adminClient,
  apiKeyClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

import { env } from "@/lib/env";

export const authClient = createAuthClient({
  // Domain Configurations
  baseURL: env.NEXT_PUBLIC_BACKEND_URL,

  plugins: [adminClient(), apiKeyClient(), organizationClient()],
  fetchOptions: {
    onError: (ctx) => {
      toast.error(ctx.error.message);
    },
  },
});

export const { signIn, signOut, signUp, useSession } = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
  plugins: [organizationClient()],
});
