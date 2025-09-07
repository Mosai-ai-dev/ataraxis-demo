import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { HeaderShadcn } from "@/components/layout/HeaderShadcn";
import { TabNavigationShadcn } from "@/components/layout/TabNavigationShadcn";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ataraxis Navigator",
  description: "AI-powered assistant interface for navigators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <div className="min-h-screen flex flex-col">
          <HeaderShadcn />
          <main className="container mx-auto px-4 py-6 flex-1">
            <TabNavigationShadcn />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
