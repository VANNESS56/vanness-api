import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import AuthProvider from "@/components/AuthProvider";
import DevToolsBlocker from "@/components/DevToolsBlocker";

export const metadata: Metadata = {
  title: "Panness API Dashboard",
  description: "Dashboard panel untuk layanan API Panness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <DevToolsBlocker />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
