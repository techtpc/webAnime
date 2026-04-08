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
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      </head>
      <body className={`${inter.className} bg-[#0f0f0f] text-white antialiased`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="lg:ml-64 flex-1 flex flex-col pb-10 pt-16 md:pt-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
