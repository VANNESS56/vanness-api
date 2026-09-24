import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

import AuthProvider from "@/components/AuthProvider";
import DevToolsBlocker from "@/components/DevToolsBlocker";
import NextTopLoader from "nextjs-toploader";
import ParticleNetwork from "@/components/ParticleNetwork";

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
      <body className={`${orbitron.variable} ${orbitron.className} antialiased`}>
        <ParticleNetwork />
        <NextTopLoader color="#4f46e5" showSpinner={false} />
        <AuthProvider>
          <DevToolsBlocker />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
