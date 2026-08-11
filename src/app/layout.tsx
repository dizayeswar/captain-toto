import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { isSupabaseConfigured } from "@/lib/supabase";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Captain ToTo — Booking System",
  description: "Internal booking management system for Captain ToTo travel.",
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
          <div className="flex h-full">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col bg-background">
              {!isSupabaseConfigured && (
                <div className="no-print border-b border-amber-200 bg-amber-50 px-6 py-2 text-center text-xs text-amber-800 dark:border-amber-700/50 dark:bg-amber-950/40 dark:text-amber-200">
                  Demo mode — data is stored in memory and resets on restart.
                  Connect Supabase (see <code>.env.example</code>) to save
                  permanently.
                </div>
              )}
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
