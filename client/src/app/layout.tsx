import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AnalyticsProvider } from "@/components/Analytics/AnalyticsContext";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Albert ChenXeed - Personal Website",
  description: "A small website to introduce myself.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </body>
    </html>
  );
}
