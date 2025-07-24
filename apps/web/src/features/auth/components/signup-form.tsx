"use client";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useId, useState } from "react";
import { CiFacebook } from "react-icons/ci";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { useAppForm } from "@repo/ui/components/tanstack-form";
import { cn } from "@repo/ui/lib/utils";

import { Mode } from "@/features/account/components/login-template";
import { authClient } from "@/lib/auth-client";
import { signupSchema, type SignupSchema } from "../schemas";

interface SignupFormProps {
  type?: "agent" | "user";
  onAccountLayoutModalChange: React.Dispatch<React.SetStateAction<Mode>>;
}

export function SignupForm({
  className,
  type = "user",
  onAccountLayoutModalChange,
  ...props
}: React.ComponentProps<"div"> & SignupFormProps) {
  const toastId = useId();
  const router = useRouter();
  const [showB2BPopup, setShowB2BPopup] = useState(false);

  const form = useAppForm({
    validators: { onChange: signupSchema },
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: ({ value }) => handleSignup(value),
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const handleSignup = async (values: SignupSchema) => {
    await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: "",
      fetchOptions: {
        onRequest() {
          toast.loading("Registering new user...", { id: toastId });
        },
        onSuccess(ctx) {
          toast.success("User registered successfully !", { id: toastId });
          setShowB2BPopup(true); // Show popup after signup
        },
        onError(ctx) {
          toast.error(`Failed: ${ctx.error.message}`, { id: toastId });
        },
      },
    });
  };

  const handleB2BChoice = (isB2B: boolean) => {
    setShowB2BPopup(false);
    if (isB2B) {
      router.push("/setup");
    } else {
      router.push("/webApp/page");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-heading font-bold">
            Get Started {type === "agent" && " as Agent"}
          </CardTitle>
          <CardDescription>
            Signup with your Email or Facebook account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppForm>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button variant="outline" className="w-full">
                    <CiFacebook className="size-5" />
                    Signup with Facebook
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
                      <field.FormLabel>Password</field.FormLabel>
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

                <form.AppField
                  name="confirmPassword"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Confirm Password</field.FormLabel>
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
                    Sign Up
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {`Aleady have an account? `}
                  {type === "agent" && (
                    <Link
                      href="/signin"
                      className="underline underline-offset-4"
                    >
                      Sign In
                    </Link>
                  )}
                  {type === "user" && (
                    <span
                      onClick={() => onAccountLayoutModalChange("login")}
                      className="underline underline-offset-4"
                    >
                      Sign In
                    </span>
                  )}
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

      {/* B2B Popup */}
      {showB2BPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-lg font-bold mb-4">Register as a B2B User?</h2>
            <p className="mb-6">Would you like to register in B2B format?</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => handleB2BChoice(true)}>Yes</Button>
              <Button variant="outline" onClick={() => handleB2BChoice(false)}>
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
