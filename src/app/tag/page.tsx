import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Tag } from "lucide-react";

export default async function TagListPage() {
  const { data: tags, error } = await supabase
    .from("tags")
    .select("id, name")
    .order("name");

  if (error) {
    console.error("Gagal mengambil data tag:", error);
  }

  return (
    <>
      <Header />
      <div className="flex-1 px-8 pt-6">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
           <Tag className="w-6 h-6 text-yellow-400" /> Tags
        </h2>
        
        <div className="flex flex-wrap gap-3">
          {tags?.map((tag) => (
            <Link 
              key={tag.id} 
              href={`/tag/${encodeURIComponent(tag.name.toLowerCase())}`}
            >
              <div className="group cursor-pointer rounded-full bg-[#222222] px-4 py-2 border border-[#333333] transition-all hover:bg-orange-500 hover:text-black">
                <span className="text-sm font-bold text-gray-300 group-hover:text-black transition-colors">
                  #{tag.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
