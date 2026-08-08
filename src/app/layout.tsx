import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { isSupabaseConfigured } from "@/lib/supabase";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Captain ToTo — Booking System",
  description: "Internal booking management system for Captain ToTo travel.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="h-full">
        <div className="flex h-full">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            {!isSupabaseConfigured && (
              <div className="border-b border-amber-200 bg-amber-50 px-6 py-2 text-center text-xs text-amber-800">
                Demo mode — data is stored in memory and resets on restart.
                Connect Supabase (see <code>.env.example</code>) to save
                permanently.
              </div>
            )}
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
