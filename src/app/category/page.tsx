import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Clapperboard } from "lucide-react";

export default async function CategoryListPage() {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("name, slug")
    .order("name");

  if (error) {
    console.error("Gagal mengambil data kategori:", error);
  }

  return (
    <>
      <Header />
      <div className="flex-1 px-8 pt-6">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
           <Clapperboard className="w-6 h-6 text-pink-400" /> Kategori
        </h2>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categories?.map((cat) => (
            <Link 
              key={cat.slug} 
              href={`/category/${cat.slug}`}
            >
              <div className="group relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#222222] border border-[#333333] transition-all hover:border-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#333]/50 to-transparent"></div>
                <h3 className="relative z-10 text-lg font-bold text-gray-300 group-hover:text-white transition-colors">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
