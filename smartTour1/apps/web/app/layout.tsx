import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TourGuardProvider } from "@/lib/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TourGuard - Smart Tourist Safety Dashboard",
  description: "Real-time tourist safety monitoring dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TourGuardProvider>
          {children}
        </TourGuardProvider>
      </body>
    </html>
  );
}