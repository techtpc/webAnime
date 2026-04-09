// app/page.tsx
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import Pagination from "@/components/Pagination";
import { supabase } from "@/lib/supabase";
import { Video } from "@/lib/data";

interface HomeProps {
  // Update tipe data searchParams menjadi Promise
  searchParams: Promise<{ q?: string }>;
}

export default async function Home(props: HomeProps) {
  // UNWRAP searchParams menggunakan await
  const searchParams = await props.searchParams;
  const searchTerm = searchParams.q || "";

  // 1. Inisialisasi Query
  let query = supabase
    .from("videos")
    .select(`
      id, 
      title, 
      thumbnail_url, 
      video_url,
      duration_seconds, 
      views, 
      release_year,
      created_at,
      studios (name)
    `);

  // 2. Tambahkan Filter jika searchTerm ada
  if (searchTerm) {
    query = query.ilike("title", `%${searchTerm}%`);
  }

  // 3. Jalankan Query
  const { data: videos, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil data dari Supabase:", error);
  }

  return (
    <>
      <Header />
      
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {/* Judul Seksi */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {searchTerm ? `Hasil pencarian: "${searchTerm}"` : "Terbaru"}
          </h2>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {videos && videos.length > 0 ? (
            videos.map((video: any) => (
              <VideoCard key={video.id} video={video} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-500 text-lg">
                {searchTerm 
                  ? `Tidak ditemukan video dengan judul "${searchTerm}"` 
                  : "Belum ada video tersedia."}
              </p>
            </div>
          )}
        </div>

        {/* Sembunyikan pagination saat mencari jika perlu, atau sesuaikan logikanya */}
        {!searchTerm && <Pagination />}
      </div>
    </>
  );
}