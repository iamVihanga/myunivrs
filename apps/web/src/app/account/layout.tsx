import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AccountPageLayout({
  panel,
  login,
}: {
  panel?: React.ReactNode;
  login?: React.ReactNode;
}) {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (session && session.session.activeOrganizationId) {
    // users with active orgs are redirected to the dashboard
    redirect(`/dashboard`);
  }

  return <main>{session ? panel : login}</main>;
}
