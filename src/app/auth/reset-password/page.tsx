import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default function ResetPasswordPage() {
  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold text-white">
        Set new password
      </h1>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </>
  );
}
