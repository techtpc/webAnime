import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProtTube - Premium Theater",
  description: "Experience 4K HDR cinematic experiences without limits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0f0f0f] text-white antialiased`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="ml-64 flex flex-1 flex-col pb-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
