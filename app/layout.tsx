import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers"; // Import SessionProvider wrapper

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Modern Knowledge Graph",
  description: "A modern knowledge management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-900 text-zinc-100`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
