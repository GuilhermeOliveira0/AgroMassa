import type { Metadata } from "next";

import { ToastProvider } from "@/components/ui/toast-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "AgroMassa",
  description: "Base inicial do site AgroMassa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
