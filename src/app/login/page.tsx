import { Suspense } from "react";
import Image from "next/image";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-full items-center justify-center bg-[radial-gradient(ellipse_at_top,_#2a4a6e_0%,_#1a3352_45%,_#12243a_100%)] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/95 p-8 shadow-xl dark:bg-slate-900/95">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="Captain ToTo"
            width={64}
            height={64}
            className="mb-3 h-16 w-16"
            priority
          />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Captain ToTo
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sign in to the booking system
          </p>
        </div>
        <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-xs text-slate-400">
          Accounts are created by an administrator.
        </p>
      </div>
    </div>
  );
}
