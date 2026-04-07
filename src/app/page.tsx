import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import Pagination from "@/components/Pagination";
import { supabase } from "@/lib/supabase";
import { Video } from "@/lib/data";

export default async function Home() {
  const { data: videos, error } = await supabase
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
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil data dari Supabase:", error);
  }

  return (
    <>
      <Header />
      
      <div className="flex-1 px-8 pt-6">
        {/* Section Title */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Terbaru
          </h2>
          
          {/* Section Navigation */}
          <div className="flex space-x-2">
            <button className="flex h-8 w-8 items-center justify-center rounded bg-[#222222] text-gray-400 hover:bg-[#2a2a2a] hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded bg-[#222222] text-gray-400 hover:bg-[#2a2a2a] hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {videos?.map((video: Video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        <Pagination />
      </div>
    </>
  );
}
