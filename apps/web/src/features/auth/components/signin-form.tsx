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
import { CiFacebook } from "react-icons/ci";
import { toast } from "sonner";
import { signinSchema, type SigninSchemaT } from "../schemas";

interface SigninFormProps {
  type?: "agent" | "user";
}

export function SigninForm({
  className,
  type = "user",
  ...props
}: React.ComponentProps<"div"> & SigninFormProps) {
  const toastId = useId();
  const router = useRouter();

  const form = useAppForm({
    validators: { onChange: signinSchema },
    defaultValues: {
      email: "",
      password: ""
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

  const handleSignin = async (values: SigninSchemaT) => {
    await authClient.signIn.email({
      email: values.email,
      password: values.password,
      fetchOptions: {
        onRequest() {
          toast.loading("Signing in...", { id: toastId });
        },
        onSuccess(ctx) {
          toast.success("User signed in successfully!", { id: toastId });
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
          <form.AppForm>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button variant="outline" className="w-full">
                    <CiFacebook className="size-5" />
                    Signin with Facebook
                  </Button>
                </div>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>

                {/* -------- */}

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

                <form.AppField
                  name="password"
                  children={(field) => (
                    <field.FormItem>
                      <div className="w-full flex items-center justify-between">
                        <field.FormLabel>Password</field.FormLabel>
                        <Link
                          href="/forgot-password"
                          className="text-xs text-secondary-foreground underline-offset-4 hover:underline"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                      <field.FormControl>
                        <Input
                          placeholder=""
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
                    loading={form.state.isSubmitting}
                    icon={form.state.isSubmitSuccessful && <CheckIcon />}
                  >
                    Sign In
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
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
