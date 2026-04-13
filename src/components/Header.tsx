"use client";

import { useState, useEffect, Suspense } from "react";
import { filterTabs } from "@/lib/data";
import { Menu, LogOut, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

// --- KOMPONEN SEARCH BAR ---
function SearchInput({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full items-center gap-2">
      <input 
        type="text" 
        placeholder={placeholder} 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none min-w-0" 
      />
      <button type="submit" className="text-gray-500 hover:text-white flex-shrink-0 transition">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </button>
    </form>
  );
}

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        const { data } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
        if (data?.role === 'admin') setIsAdmin(true);
      }
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (!session) setIsAdmin(false);
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const toastId = toast.loading("Sedang keluar dari sistem...");
    await supabase.auth.signOut();
    toast.success("Lu berhasil logout!", { id: toastId });
    // TENDANG KE HOMEPAGE YANG LU LUPA KEMAREN
    router.push("/");
    router.refresh();
  };

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0f0f0f]/90 backdrop-blur-md border-b border-[#333333]/50">
      
      {/* ================= MOBILE HEADER ================= */}
      <div className="md:hidden flex h-16 items-center justify-between px-4 gap-3">
        {/* INI DIA MANTRA TELEPATINYA */}
        <button 
          onClick={() => window.dispatchEvent(new Event('toggleSidebar'))}
          className="text-gray-400 hover:text-white transition flex-shrink-0"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex rounded-full bg-[#222222] px-3 py-2 border border-[#333333] focus-within:border-[#555555]">
            <Suspense fallback={<div className="h-5 w-full animate-pulse bg-transparent" />}>
              <SearchInput placeholder="Search..." />
            </Suspense>
          </div>
        </div>

        {user ? (
          <button onClick={handleLogout} className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-black border border-black flex-shrink-0">
            {userInitial}
          </button>
        ) : (
          <Link href="/login">
            <button className="text-xs font-bold bg-orange-500 text-black px-3 py-1.5 rounded-full flex-shrink-0">Login</button>
          </Link>
        )}
      </div>

      {/* ================= DESKTOP HEADER ================= */}
      <div className="hidden md:flex h-20 items-center justify-between bg-[#0f0f0f]/90 px-6 gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-6 ml-64 min-w-fit overflow-x-auto scrollbar-hide">
          {filterTabs.map((tab, idx) => (
            <button key={idx} className={`pb-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${idx === 0 ? "border-orange-500 text-orange-500" : "border-transparent text-gray-400 hover:text-white"}`}>
              {tab}
            </button>
          ))}
        </div>
        
        {/* Search Bar Desktop */}
        <div className="flex-1 max-w-xl">
          <div className="flex w-full items-center rounded-full bg-[#222222] px-4 py-2 border border-[#333333] focus-within:border-[#555555]">
            <Suspense fallback={<div className="h-5 w-full animate-pulse bg-transparent" />}>
              <SearchInput placeholder="Search cinematic experiences..." />
            </Suspense>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <button className="text-gray-400 hover:text-white relative transition mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-orange-500 border border-[#0f0f0f]"></span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link href="/admin/manage" className="flex items-center gap-1 text-xs font-bold bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full hover:bg-blue-500/20 transition">
                  <ShieldAlert className="w-4 h-4" /> Admin
                </Link>
              )}
              <div className="flex items-center space-x-2 rounded-full border border-orange-500/30 bg-[#222] px-3 py-1.5 hover:border-orange-500 transition">
                <span className="text-sm font-bold text-white">{userName}</span>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-black text-black">
                  {userInitial}
                </div>
              </div>
              <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition ml-2" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <button className="flex items-center space-x-2 rounded-full border border-[#333] bg-[#222] px-4 py-2 hover:bg-[#333] transition text-sm font-bold text-gray-300">
                  LOGIN
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}