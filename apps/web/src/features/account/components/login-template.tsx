"use client";
import { useState } from "react";

import { SigninForm } from "@/features/auth/components/signin-form";
import { SignupForm } from "@/features/auth/components/signup-form";

export type Mode = "login" | "register";

export default function AccountLoginTemplate() {
  const [mode, setMode] = useState<Mode>("login");

  return mode === "login" ? (
    <SigninForm mode="user" onAccountLayoutModalChange={setMode} />
  ) : (
    <SignupForm type="user" onAccountLayoutModalChange={setMode} />
  );
}
