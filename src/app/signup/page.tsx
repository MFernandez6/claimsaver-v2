import { Suspense } from "react";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata = {
  title: "Create account",
  description: "Create a ClaimSaver+ account",
};

export default function SignupPage() {
  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <Suspense
        fallback={
          <div className="h-64 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        }
      >
        <SignupForm />
      </Suspense>
    </div>
  );
}
