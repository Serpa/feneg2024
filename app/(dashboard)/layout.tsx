import type { Metadata } from "next";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SideBarAdmin from "@/components/admin/sidebar";
import HeaderAdmin from "@/components/admin/header";
import PageWrapper from "@/components/admin/pageWrapper";
import AuthProvider from "@/components/session-provider";
import { Toaster } from "@/components/ui/toaster"
import SwrProvider from "@/components/swr-provider";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { NextAppDirEmotionCacheProvider } from "tss-react/next/appDir";
import { TssCacheProvider } from "tss-react";

export const metadata: Metadata = {
  title: "FENEG 2025 - Feira de Negócios Sicoob Frutal.",
  description: "Feira de Negócios Sicoob Frutal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head></head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SwrProvider>
              <div className="flex min-h-screen">
                <HeaderAdmin />
                <SideBarAdmin />
                <PageWrapper >
                  <NextAppDirEmotionCacheProvider options={{ key: "css" }}>
                    {children}
                  </NextAppDirEmotionCacheProvider>
                  <SpeedInsights />
                </PageWrapper>
              </div>
              <Toaster />
            </SwrProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
