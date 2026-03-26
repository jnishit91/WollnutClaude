import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function SignUpPage() {
  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold text-white">
        Create your account
      </h1>
      <SignupForm />
    </>
  );
}
