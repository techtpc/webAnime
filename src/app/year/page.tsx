import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Calendar } from "lucide-react";

export default async function YearListPage() {
  const { data: videos, error } = await supabase
    .from("videos")
    .select("release_year")
    .order("release_year", { ascending: false });

  if (error) {
    console.error("Gagal mengambil data tahun:", error);
  }

  const years = Array.from(new Set((videos as unknown as { release_year: number }[])?.map((v) => v.release_year).filter(Boolean))) as number[];

  return (
    <>
      <Header />
      <div className="flex-1 px-8 pt-6">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
           <Calendar className="w-6 h-6 text-blue-400" /> Tahun Rilis
        </h2>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {years.map((year) => (
            <Link 
              key={year} 
              href={`/year/${year}`}
            >
              <div className="group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#222222] border border-[#333333] transition-all hover:border-blue-500 hover:bg-[#2a2a2a]">
                <h3 className="text-xl font-bold text-gray-400 group-hover:text-white transition-colors">
                  {year}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
