import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CommandMenu } from "@/components/command-menu";
import { Toaster } from "@/components/ui/sonner";
import { initializeModules } from "@/core/modules/bootstrap";
import "./globals.css";

// Initialize modules on app startup
initializeModules().catch(console.error);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenCMMS",
  description: "Open Source Computerized Maintenance Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <CommandMenu />
        <Toaster />
      </body>
    </html>
  );
}
