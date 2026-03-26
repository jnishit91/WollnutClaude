"use client";

import AuthSessionProvider from "./session-provider";
import { QueryProvider } from "@/components/shared/QueryProvider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "hsl(240 17% 8%)",
            border: "1px solid hsl(240 10% 18%)",
            color: "hsl(0 0% 95%)",
          },
        }}
      />
    </AuthSessionProvider>
  );
}
