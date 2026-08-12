import { Suspense } from "react";
import Image from "next/image";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-full items-center justify-center bg-[radial-gradient(ellipse_at_top,_#0f3050_0%,_#061b30_55%,_#04111f_100%)] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#c79b54]/30 bg-[#fffcf7]/95 p-8 shadow-xl dark:border-[#a47c36]/40 dark:bg-[#0a243c]/95">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="Captain ToTo"
            width={64}
            height={64}
            className="mb-3 h-16 w-16"
            priority
          />
          <h1 className="text-2xl font-bold text-[#061b30] dark:text-[#f5efe3]">
            Captain ToTo
          </h1>
          <p className="mt-1 text-sm text-[#a47c36]">
            Sign in to the booking system
          </p>
        </div>
        <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-xs text-[#a47c36]/80">
          Accounts are created by the CEO in Settings → Users.
        </p>
      </div>
    </div>
  );
}
