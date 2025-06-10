"use client";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useId } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { useAppForm } from "@repo/ui/components/tanstack-form";
import { cn } from "@repo/ui/lib/utils";

import { authClient } from "@/lib/auth-client";
import { resetPasswordSchema, type ResetPasswordSchemaT } from "../schemas";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const toastId = useId();
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const form = useAppForm({
    validators: { onChange: resetPasswordSchema },
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    },
    onSubmit: ({ value }) => handleSignin(value)
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const handleSignin = async (values: ResetPasswordSchemaT) => {
    if (!token) {
      toast.error("Invalid or expired token", { id: toastId });
      return;
    }

    await authClient.resetPassword({
      newPassword: values.newPassword,
      token,
      fetchOptions: {
        onRequest() {
          toast.loading("Updating Password...", { id: toastId });
        },
        onSuccess(ctx) {
          toast.success("Password updated successfully!", { id: toastId });
          router.push("/dashboard");
        },
        onError(ctx) {
          toast.error(`Failed: ${ctx.error.message}`, { id: toastId });
        }
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-heading font-bold">
            Welcome back
          </CardTitle>
          <CardDescription>
            Signin with your Email or Facebook account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!token && (
            <Alert>
              <AlertTitle>{`Invalid or expired token`}</AlertTitle>
              <AlertDescription>
                {`Please request a new password reset link or validate token is correct.`}
              </AlertDescription>
            </Alert>
          )}

          <form.AppForm>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <form.AppField
                  name="newPassword"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>New Password</field.FormLabel>
                      <field.FormControl>
                        <Input
                          placeholder="******"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />

                <form.AppField
                  name="confirmPassword"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Confirm Password</field.FormLabel>
                      <field.FormControl>
                        <Input
                          placeholder="******"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />

                {/* -------- */}

                <div className="grid gap-6">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={form.state.isSubmitting || !token}
                    loading={form.state.isSubmitting}
                    icon={form.state.isSubmitSuccessful && <CheckIcon />}
                  >
                    Update Password
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {`Don't have an account?`}
                  {` `}
                  <Link href="/signup" className="underline underline-offset-4">
                    Sign Up
                  </Link>
                </div>
              </div>
            </form>
          </form.AppForm>
        </CardContent>
      </Card>
    </div>
  );
}
