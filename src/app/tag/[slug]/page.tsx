import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { supabase } from "@/lib/supabase";
import { Video } from "@/lib/data";

export default async function TagSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tagName = decodeURIComponent(slug);
  
  // Fetch videos through the junction table video_tags
  const { data: video_tags, error } = await supabase
    .from("video_tags")
    .select(`
      videos (
        id, 
        title, 
        thumbnail_url, 
        video_url,
        duration_seconds, 
        views, 
        release_year,
        created_at,
        studios (name)
      ),
      tags!inner (name)
    `)
    .ilike("tags.name", `%${tagName}%`);

  if (error) {
    console.error("Gagal mengambil video per tag:", error);
  }

  const filteredVideos = (video_tags as unknown as { videos: Video }[] | null)?.map((vt) => vt.videos).filter(Boolean) || [];
  const displayTagName = (video_tags as unknown as { tags: { name: string } }[] | null)?.[0]?.tags?.name || tagName;

  return (
    <>
      <Header />
      <div className="flex-1 px-8 pt-6">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Tag: <span className="text-orange-500 italic">#{displayTagName}</span>
        </h2>
        
        {filteredVideos && filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredVideos.map((video: Video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-xl bg-[#222222] text-gray-500 border border-[#333333]">
            Tidak ada video dengan tag ini.
          </div>
        )}
      </div>
    </>
  );
}
