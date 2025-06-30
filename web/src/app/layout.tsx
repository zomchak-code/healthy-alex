import "~/styles/globals.css";

import { type Metadata } from "next";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { TRPCReactProvider } from "~/trpc/react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ThemeProvider } from "~/app/_components/theme-provider"
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Healthy Alex",
  description: "Healthy Alex",
  icons: [{ rel: "icon", url: "/heart.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <NuqsAdapter>
          <TRPCReactProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="h-screen flex flex-col">
                <Link href="/" className="p-4 bg-secondary flex items-center gap-2">
                  <Heart /> Healthy Alex
                </Link>
                <div className="min-h-0">
                  <Suspense>
                    {children}
                  </Suspense>
                </div>
              </div>
            </ThemeProvider>
          </TRPCReactProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
