import type { Metadata } from "next";
import "@/app/globals.css";
import Header from "@/components/layout/header";
import NavBar from "@/components/layout/nav-bar";
import { ThemeProvider } from "@/components/theme-provider";
import { Separator } from "@/components/ui/separator";
import FooterComp from "@/components/layout/footer";
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
      <body className="flex min-h-screen flex-col w-min-fit">

          <div className="top-0 bg-gradient-to-b from-verde-be/30 to-white">
            <Header />
            <div className="flex justify-center items-center">
              <Separator className="w-[90%]" />
            </div>
            <NavBar />
            <div className="flex justify-center items-center">
              <Separator className="w-[90%]" />
            </div>
          </div>
          <main className="container flex-1 grow">
            {children}
          </main>
          <Toaster />
          <FooterComp />
      </body>
    </html>
  );
}
