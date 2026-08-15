import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import AppSidebar from "@/components/AppSidebar";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Captain ToTo — Booking System",
  description: "Internal booking management system for Captain ToTo travel.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/logo.png",
  },
};

const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('captain-toto-theme');
    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (t === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = t;
  } catch (e) {}
})();
`;

function SidebarFallback() {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-[#061b30] text-white">
      <div className="animate-pulse border-b border-white/10 p-5">
        <div className="h-10 w-10 rounded bg-white/10" />
        <div className="mt-3 h-4 w-28 rounded bg-white/10" />
      </div>
      <div className="flex-1 space-y-3 p-4">
        <div className="h-8 rounded bg-white/10" />
        <div className="h-8 rounded bg-white/10" />
        <div className="h-8 rounded bg-white/10" />
        <div className="h-8 rounded bg-white/10" />
      </div>
    </aside>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="h-full bg-background text-foreground">
        <ThemeProvider>
          <AppShell
            sidebar={
              <Suspense fallback={<SidebarFallback />}>
                <AppSidebar />
              </Suspense>
            }
          >
            {children}
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}

