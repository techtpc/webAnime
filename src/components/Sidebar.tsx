"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { navItems } from "@/lib/data";

const Icons = {
  home: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.99 8.99a.75.75 0 0 1-1.06 1.06L12 5.384l-8.46 8.508a.75.75 0 0 1-1.06-1.06l8.99-8.99Z" />
      <path d="M12 5.234l-8.25 8.29V21a.75.75 0 0 0 .75.75h3.5a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 0 .75.75h3.5a.75.75 0 0 0 .75-.75v-7.476l-8.25-8.29Z" />
    </svg>
  ),
  genre: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  ),
  year: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
    </svg>
  ),
  artist: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  ),
  studio: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
    </svg>
  ),

  tag: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.659A2.25 2.25 0 0 0 9.568 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
  )
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-64 flex-col justify-between bg-[#1a1a1a] p-6 border-r border-[#333333] pt-20">
        <div>
          {/* Logo */}
          <Link href="/" className="mb-2 block">
            <h1 className="text-2xl font-black italic tracking-tight">
              <span className="text-orange-500">Prot</span>
              <span className="text-white">Tube</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">Premium Theater</p>
          </Link>

          {/* Navigation */}
          <nav className="mt-8 space-y-2">
            {navItems.map((item, idx) => {
              const isActive = pathname === item.href;
              const Icon = Icons[item.icon as keyof typeof Icons];

              return (
                <Link
                  key={idx}
                  href={item.href || "#"}
                  className={`flex items-center space-x-4 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${isActive
                      ? "bg-[#2a2a2a] text-orange-500 rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                      : "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
                    }`}
                >
                  {Icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Promo Card */}
        <div className="mt-auto rounded-xl border border-orange-500/50 bg-[#222222] p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 rounded-bl-full"></div>
          <h3 className="mb-2 text-sm font-bold text-orange-400">Limited Offer</h3>
          <p className="mb-4 text-xs text-gray-300">Experience 4K HDR without limits.</p>
          <button className="w-full rounded-lg bg-orange-500 py-2.5 text-sm font-bold text-black hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
            Go Pro
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar - Overlay Style */}
      <div className="lg:hidden fixed inset-0 z-30 hidden bg-black/50 md:hidden" id="mobile-nav-overlay"></div>
      <aside className="lg:hidden fixed left-0 top-16 z-30 hidden w-64 max-h-[calc(100vh-64px)] flex-col overflow-y-auto bg-[#1a1a1a] p-4 border-r border-[#333333] md:hidden" id="mobile-nav">
        {/* Navigation for Mobile */}
        <nav className="space-y-2">
          {navItems.map((item, idx) => {
            const isActive = pathname === item.href;
            const Icon = Icons[item.icon as keyof typeof Icons];

            return (
              <Link
                key={idx}
                href={item.href || "#"}
                className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                    ? "bg-[#2a2a2a] text-orange-500"
                    : "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
                  }`}
              >
                {Icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
