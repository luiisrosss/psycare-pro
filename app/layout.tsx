import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { HeroUIProvider } from "@heroui/react";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PsyCare Pro",
  description: "Sistema de gestión clínica para psicólogos autónomos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ClerkProvider appearance={{ variables: { colorPrimary: '#2563eb' }} }>
          <HeroUIProvider>
            <Navbar />
            {children}
          </HeroUIProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
