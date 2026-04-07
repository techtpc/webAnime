import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Building2 } from "lucide-react";

export default async function StudioListPage() {
  const { data: studios, error } = await supabase
    .from("studios")
    .select("id, name")
    .order("name");

  if (error) {
    console.error("Gagal mengambil data studio:", error);
  }

  return (
    <>
      <Header />
      <div className="flex-1 px-8 pt-6">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
           <Building2 className="w-6 h-6 text-green-400" /> Daftar Studio
        </h2>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {studios?.map((studio) => (
            <Link 
              key={studio.id} 
              href={`/studio/${encodeURIComponent(studio.name.toLowerCase())}`}
            >
              <div className="group relative flex items-center gap-4 cursor-pointer overflow-hidden rounded-xl bg-[#222222] p-4 border border-[#333333] transition-all hover:border-green-500 hover:bg-[#2a2a2a] shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#333333] text-green-400 group-hover:bg-green-500 group-hover:text-black transition-all">
                   <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-300 group-hover:text-white transition-colors">
                  {studio.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
