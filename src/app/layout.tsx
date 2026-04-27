import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

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
        {/* 1. Tambahkan Toaster di sini */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#222',
              color: '#fff',
              border: '1px solid #333',
            },
          }}
        />

        <div className="flex min-h-screen">
          <Sidebar />
          <main className="lg:ml-64 flex-1 flex flex-col pb-10 pt-14 md:pt-0">
            {children}
          </main>
        </div>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DS8BG9K04S"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DS8BG9K04S');
          `}
        </Script>
      </body>
    </html>
  );
}