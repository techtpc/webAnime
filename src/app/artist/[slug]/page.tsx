import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { supabase } from "@/lib/supabase";
import { Video } from "@/lib/data";

export default async function ArtistSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  const { data: video_artists, error } = await supabase
    .from("video_artists")
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
      artists!inner (name)
    `)
    .ilike("artists.name", `%${decodedSlug}%`);

  if (error) {
    console.error("Gagal mengambil video per artis:", error);
  }

  const filteredVideos = (video_artists as unknown as { videos: Video }[] | null)?.map((va) => va.videos).filter(Boolean) || [];
  const artistName = (video_artists as unknown as { artists: { name: string } }[] | null)?.[0]?.artists?.name || decodedSlug;

  return (
    <>
      <Header />
      <div className="flex-1 px-8 pt-6">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-white capitalize">
          Artis: {artistName}
        </h2>
        
        {filteredVideos && filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredVideos.map((video: Video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-xl bg-[#222222] text-gray-500 border border-[#333333]">
            Tidak ada video dari artis ini.
          </div>
        )}
      </div>
    </>
  );
}
