// app/page.tsx
"use client";

import { Suspense, useState, useEffect } from "react";
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import Pagination from "@/components/Pagination";
import { supabase } from "@/lib/supabase";
import { Video } from "@/lib/data";
import { useSearchParams, useRouter } from "next/navigation";

const VIDEOS_PER_PAGE = 12;

// 1. KITA PISAHIN LOGIKA INTI KE KOMPONEN ANAK
function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter(); // PAKE INI BIAR GAK KEDIP!
  
  const searchTerm = searchParams.get("q") || "";
  const currentPageParam = searchParams.get("page") || "1";
  const currentPage = parseInt(currentPageParam);

  const [videos, setVideos] = useState<Video[]>([]);
  const [totalVideos, setTotalVideos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const offset = (currentPage - 1) * VIDEOS_PER_PAGE;

        let query = supabase
          .from("videos")
          .select(`id, title, thumbnail_url, video_url, duration_seconds, views, release_year, created_at, studios(name)`, { count: 'exact' });

        if (searchTerm) {
          query = query.ilike("title", `%${searchTerm}%`);
        }

        const { data: videosData, error: fetchError, count } = await query
          .order("created_at", { ascending: false })
          .range(offset, offset + VIDEOS_PER_PAGE - 1);

        if (fetchError) {
          console.error("Gagal mengambil data:", fetchError);
          setError("Gagal mengambil data dari server.");
        } else {
          setVideos(videosData || []);
          setTotalVideos(count || 0);
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Terjadi kesalahan sistem.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [currentPage, searchTerm]);

  const totalPages = Math.ceil(totalVideos / VIDEOS_PER_PAGE) || 1;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    params.set("page", newPage.toString());
    
    // INI CARA MODERN, GAK PAKE FULL RELOAD
    router.push(`/?${params.toString()}`);
  };

  return (
    <>
      <Header />
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {searchTerm ? `Hasil pencarian: "${searchTerm}"` : "Terbaru"}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-orange-500 animate-pulse font-bold">Menarik data dari satelit...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 font-bold">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {videos && videos.length > 0 ? (
                videos.map((video: any) => (
                  <VideoCard key={video.id} video={video} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center border border-dashed border-[#333] rounded-2xl bg-[#111]">
                  <p className="text-gray-500 text-lg">
                    {searchTerm 
                      ? `Nihil bro. Gak nemu film judul "${searchTerm}".` 
                      : "Sumpah ini web masih kosong. Input data di Admin dulu."}
                  </p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalVideos} 
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

// 2. KITA BUNGKUS PAKE SUSPENSE BIAR NEXT.JS GAK NGAMUK PAS DI-BUILD
export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f0f0f] flex justify-center items-center text-orange-500 font-bold">Memuat Teater...</div>}>
      <HomeContent />
    </Suspense>
  );
}