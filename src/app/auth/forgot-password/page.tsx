import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold text-white">
        Reset your password
      </h1>
      <ForgotPasswordForm />
    </>
  );
}
