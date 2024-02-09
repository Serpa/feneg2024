import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/header";
import NavBar from "@/components/layout/nav-bar";
import { ThemeProvider } from "@/components/theme-provider";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="min-w-fit bg-zinc-100">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <div className="flex justify-center items-center">
            <Separator className="w-[90%]" />
          </div>
          <NavBar />
          <div className="flex justify-center items-center">
            <Separator className="w-[90%]" />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
