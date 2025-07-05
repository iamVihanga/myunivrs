"use client";

import { ArrowLeft, CheckIcon, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useId } from "react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/ui/components/select";
import { useAppForm } from "@repo/ui/components/tanstack-form";

import { createUser } from "@/features/user-management/actions/create-user";
import {
  createUserSchema,
  type CreateUserSchema
} from "@/features/user-management/schemas";

export default function NewUserPage() {
  const toastId = useId();
  const router = useRouter();

  const form = useAppForm({
    validators: { onChange: createUserSchema },
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user" as "user" | "admin"
    },
    onSubmit: ({ value }) => handleCreateUser(value)
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const handleCreateUser = async (values: CreateUserSchema) => {
    try {
      toast.loading("Creating new user...", { id: toastId });

      const newUser = await createUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role
      });

      toast.success(
        `User "${values.name}" created successfully! Redirecting to users list...`,
        { id: toastId, duration: 2000 }
      );

      // Wait a moment before redirecting to let user see the success message
      setTimeout(() => {
        router.push("/dashboard/users");
      }, 1500);
    } catch (error: any) {
      toast.error(`Failed to create user: ${error.message}`, { id: toastId });
    }
  };

  return (
    <div className="container mx-auto py-8 px-3 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/users">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 font-heading">
              Create New User
            </h1>
            <p className="text-muted-foreground mt-1">
              Add a new user to the system
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">User Information</CardTitle>
          <CardDescription>
            Fill in the details below to create a new user account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppForm>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <form.AppField
                name="name"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Full Name</field.FormLabel>
                    <field.FormControl>
                      <Input
                        placeholder="e.g. John Doe"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        disabled={form.state.isSubmitting}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />

              {/* Email */}
              <form.AppField
                name="email"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Email Address</field.FormLabel>
                    <field.FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        disabled={form.state.isSubmitting}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />

              {/* Role */}
              <form.AppField
                name="role"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Role</field.FormLabel>
                    <field.FormControl>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(value as "user" | "admin")
                        }
                        disabled={form.state.isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <div className="text-left py-2 px-4">
                                <span className="font-medium">User</span>
                                <p className="text-xs text-muted-foreground">
                                  Standard user access
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              <div className="text-left py-2 px-4">
                                <span className="font-medium">Admin</span>
                                <p className="text-xs text-muted-foreground">
                                  Full system access
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </field.FormControl>
                    <p className="text-sm text-muted-foreground">
                      Admins have full access to manage users and system
                      settings
                    </p>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />

              {/* Password */}
              <form.AppField
                name="password"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Password</field.FormLabel>
                    <field.FormControl>
                      <Input
                        type="password"
                        placeholder="Enter a secure password"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        disabled={form.state.isSubmitting}
                      />
                    </field.FormControl>
                    <p className="text-sm text-muted-foreground">
                      Must be at least 6 characters long
                    </p>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />

              {/* Confirm Password */}
              <form.AppField
                name="confirmPassword"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Confirm Password</field.FormLabel>
                    <field.FormControl>
                      <Input
                        type="password"
                        placeholder="Re-enter the password"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        disabled={form.state.isSubmitting}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />

              {/* Form Actions */}
              <div className="flex items-center gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  loading={form.state.isSubmitting}
                  icon={form.state.isSubmitSuccessful && <CheckIcon />}
                >
                  {form.state.isSubmitting ? "Creating User..." : "Create User"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  disabled={form.state.isSubmitting}
                >
                  <Link href="/dashboard/users">Cancel</Link>
                </Button>
              </div>
            </form>
          </form.AppForm>
        </CardContent>
      </Card>
    </div>
  );
}
