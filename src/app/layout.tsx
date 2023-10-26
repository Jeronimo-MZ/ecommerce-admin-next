import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ModalProvider } from "@/providers/modal-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { AuthProvider } from "@/components/auth-provider";
import { getServerSession } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  return (
    <AuthProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <ModalProvider />
          <ToastProvider />
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
