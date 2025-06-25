import { Metadata } from "next";

import LoginTemplate from "@/features/account/components/login-template";
import { Separator } from "@repo/ui/components/separator";
import { SchoolIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your myunivrs account."
};

export default function LoginPage() {
  return (
    <div className="bg-muted/10 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <SchoolIcon className="size-4" />
          </div>
          <span className="font-heading text-primary/90 font-bold h-4 flex items-center gap-1">
            MyUnivrs
            <Separator orientation="vertical" />
            <span className="font-normal">Student</span>
          </span>
        </a>
      </div>

      {/* Template */}
      <LoginTemplate />
    </div>
  );
}
