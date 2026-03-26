import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold text-white">
        Welcome back
      </h1>
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  );
}
