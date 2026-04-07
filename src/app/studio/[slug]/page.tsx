import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { supabase } from "@/lib/supabase";
import { Video } from "@/lib/data";

export default async function StudioSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const studioName = decodeURIComponent(slug);
  
  const { data: filteredVideos, error } = await supabase
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
      studios!inner (name)
    `)
    .ilike("studios.name", `%${studioName}%`);

  if (error) {
    console.error("Gagal mengambil video per studio:", error);
  }

  const displayStudioName = (Array.isArray(filteredVideos?.[0]?.studios) ? filteredVideos?.[0]?.studios[0]?.name : (filteredVideos?.[0]?.studios as { name: string } | null | undefined)?.name) || studioName;

  return (
    <>
      <Header />
      <div className="flex-1 px-8 pt-6">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-white capitalize">
          Studio: {displayStudioName}
        </h2>
        
        {filteredVideos && filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video as unknown as Video} />
            ))}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-xl bg-[#222222] text-gray-500 border border-[#333333]">
            Tidak ada video dari studio ini.
          </div>
        )}
      </div>
    </>
  );
}
