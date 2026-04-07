import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { supabase } from "@/lib/supabase";
import { Video } from "@/lib/data";

export default async function CategorySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch videos through the junction table video_categories
  const { data: video_categories, error } = await supabase
    .from("video_categories")
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
      categories!inner (name, slug)
    `)
    .eq("categories.slug", slug);

  if (error) {
    console.error("Gagal mengambil video per kategori:", error);
  }

  const filteredVideos = (video_categories as unknown as { videos: Video }[] | null)?.map((vc) => vc.videos).filter(Boolean) || [];
  const categoryName = (video_categories as unknown as { categories: { name: string } }[] | null)?.[0]?.categories?.name || slug;

  return (
    <>
      <Header />
      <div className="flex-1 px-8 pt-6">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-white capitalize">
          Kategori: {categoryName}
        </h2>
        
        {filteredVideos && filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredVideos.map((video: Video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-xl bg-[#222222] text-gray-500">
            Konten tidak tersedia untuk kategori ini.
          </div>
        )}
      </div>
    </>
  );
}
