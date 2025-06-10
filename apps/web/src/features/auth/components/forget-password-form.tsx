"use client";

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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useId } from "react";

import { authClient } from "@/lib/auth-client";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { forgotPasswordSchema, type ForgotPasswordSchemaT } from "../schemas";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const toastId = useId();
  const router = useRouter();

  const form = useAppForm({
    validators: { onChange: forgotPasswordSchema },
    defaultValues: {
      email: ""
    },
    onSubmit: ({ value }) => handleForgotPassword(value)
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const handleForgotPassword = async (values: ForgotPasswordSchemaT) => {
    await authClient.forgetPassword({
      email: values.email,
      redirectTo: "/reset-password",
      fetchOptions: {
        onRequest() {
          toast.loading("Requesting Password Reset...", { id: toastId });
        },
        onSuccess(ctx) {
          toast.success("Password reset link sent!", {
            id: toastId,
            description: "Check your email inbox for get the link"
          });
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
            Reset Password
          </CardTitle>
          <CardDescription>
            Request a password reset link to be sent to your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppForm>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <form.AppField
                  name="email"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Email</field.FormLabel>
                      <field.FormControl>
                        <Input
                          placeholder="john@example.com"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />

                <div className="grid gap-6">
                  <Button
                    type="submit"
                    className="w-full"
                    loading={form.state.isSubmitting}
                    icon={form.state.isSubmitSuccessful && <CheckIcon />}
                  >
                    Request Link
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
