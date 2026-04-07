import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { User } from "lucide-react";

export default async function ArtistListPage() {
  const { data: artists, error } = await supabase
    .from("artists")
    .select("id, name")
    .order("name");

  if (error) {
    console.error("Gagal mengambil data artis:", error);
  }

  return (
    <>
      <Header />
      <div className="flex-1 px-8 pt-6">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
           <User className="w-6 h-6 text-orange-400" /> Daftar Artis / Content Creator
        </h2>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {artists?.map((artist) => (
            <Link 
              key={artist.id} 
              href={`/artist/${encodeURIComponent(artist.name.toLowerCase())}`}
            >
              <div className="group relative border border-[#333333] flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full bg-[#222222] transition-all hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#333333] text-2xl font-bold text-gray-500 group-hover:bg-orange-500 group-hover:text-black transition-all mb-3 text-center">
                   {artist.name.charAt(0)}
                </div>
                <h3 className="text-center px-4 text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                  {artist.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
