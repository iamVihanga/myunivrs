"use client";
import { CheckIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useId, useRef, useState } from "react";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { PhoneInput } from "@repo/ui/components/phone-input";
import { useAppForm } from "@repo/ui/components/tanstack-form";
import { cn } from "@repo/ui/lib/utils";

import { authClient } from "@/lib/auth-client";
import { toKebabCase } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@repo/ui/components/avatar";
import { toast } from "sonner";
import { setupOrgSchema, type SetupOrgSchemaT } from "../schemas";

export function AgentSetupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const toastId = useId();
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setLogoFile(file);
    }
  };

  const form = useAppForm({
    validators: { onChange: setupOrgSchema },
    defaultValues: {
      name: "",
      logo: "",
      company: "",
      phoneNumber: "",
      website: ""
    },
    onSubmit: ({ value }) => handleSetup(value)
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const handleSetup = async (values: SetupOrgSchemaT) => {
    try {
      toast.loading("Setting up your profile...", { id: toastId });

      /**
       * 1. Update User Profile with Name
       */
      const updatedUser = await authClient.updateUser({
        name: values.name
      });

      if (updatedUser.error) throw new Error(updatedUser.error.message);

      /**
       * 2. Convert name to kebab case
       */
      const slug = toKebabCase(values.name);

      /**
       * 3. Create Agent Profile (akd. Organization) with the provided details
       */
      const agentProfile = await authClient.organization.create({
        name: values.name,
        slug,
        logo: values.logo,
        metadata: {
          company: values.company,
          phoneNumber: values.phoneNumber,
          website: values.website
        }
      });

      if (agentProfile.error) throw new Error(agentProfile.error.message);

      toast.success("Agent profile successfully prepared !", { id: toastId });

      router.push("/dashboard");
    } catch (err) {
      const error = err as Error;
      toast.error(`Failed: ${error.message}`, {
        id: toastId
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-heading font-bold">
            Agent Profile
          </CardTitle>
          <CardDescription>
            Complete your agent profile to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppForm>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="w-full flex items-center justify-center">
                  {/* Logo Field */}
                  <input
                    className="hidden"
                    type="file"
                    accept=".jpg, .png, .jpeg, .svg"
                    ref={imageInputRef}
                    onChange={handleImageChange}
                  />

                  <form.AppField
                    name="logo"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormControl>
                          <Avatar
                            className="size-[72px]"
                            onClick={() => {
                              if (!imageInputRef.current?.value) {
                                imageInputRef?.current?.click();
                              } else {
                                setLogoFile(null);
                                imageInputRef.current.value = "";
                              }
                            }}
                          >
                            {/* TODO: Uncomment after Image Module installed */}
                            {/* {field.state.value && (
                            <AvatarImage src={field.state.value} alt="logo" />
                            )} */}

                            <div className="relative group cursor-pointer hover:shadow-md">
                              <div
                                className={cn(
                                  "absolute z-20 w-full h-full top-0 left-0 inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-semibold",
                                  logoFile ? "hidden" : "group-hover:flex"
                                )}
                              ></div>
                              <AvatarImage
                                src={
                                  logoFile ? URL.createObjectURL(logoFile) : ""
                                }
                                alt="logo"
                                width={300}
                                height={300}
                                className="object-cover "
                              />
                            </div>

                            <AvatarFallback>
                              <ImageIcon className="size-7 text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />
                </div>

                <form.AppField
                  name="name"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Your Name</field.FormLabel>
                      <field.FormControl>
                        <Input
                          placeholder="John Doe"
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
                  name="company"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Company</field.FormLabel>
                      <field.FormControl>
                        <Input
                          placeholder="Abc Real Estate."
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
                  name="website"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Company Webiste</field.FormLabel>
                      <field.FormControl>
                        <Input
                          placeholder="www.abc-realestate.com"
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
                  name="phoneNumber"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Phone Number</field.FormLabel>
                      <field.FormControl>
                        <PhoneInput
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e)}
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
                    Complete Profile
                  </Button>
                </div>
              </div>
            </form>
          </form.AppForm>
        </CardContent>
      </Card>
    </div>
  );
}
