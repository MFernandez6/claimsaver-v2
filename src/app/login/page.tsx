import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Sign in",
  description: "Sign in to ClaimSaver+",
};

export default function LoginPage() {
  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <Suspense
        fallback={
          <div className="h-64 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
