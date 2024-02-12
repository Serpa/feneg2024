import type { Metadata } from "next";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SideBarAdmin from "@/components/admin/sidebar";
import HeaderAdmin from "@/components/admin/header";
import PageWrapper from "@/components/admin/pageWrapper";
import AuthProvider from "@/components/session-provider";
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "FENEG 2024 - Feira de Negócios Sicoob Frutal.",
  description: "Feira de Negócios Sicoob Frutal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>

          <div className="flex min-h-screen">
            <HeaderAdmin />
            <SideBarAdmin />
            <PageWrapper >
              {children}
            </PageWrapper>
          </div>
          <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
