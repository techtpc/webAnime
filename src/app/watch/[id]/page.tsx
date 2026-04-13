import Header from "@/components/Header";
import VideoPlayer, { VideoServer } from "@/components/VideoPlayer";
import WatchActions from "@/components/WatchAction"; // Import komponen baru lu
import { formatViews, formatTimeAgo, formatDuration } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { Film, Calendar, Building2, User, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Studio { name: string; }
interface Artist { name: string; }
interface Category { name: string; slug: string; }
interface TagType { name: string; }

interface VideoData {
  id: string;
  title: string;
  thumbnail_url: string;
  duration_seconds: number;
  views: number;
  likes: number;
  release_year: number;
  created_at: string;
  download_url?: string; // Tambahin ini di interface
  studios: Studio[] | Studio;
  video_artists: Array<{ artists: Artist }>;
  video_categories: Array<{ categories: Category }>;
  video_tags: Array<{ tags: TagType }>;
  video_servers: VideoServer[];
}

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Jalanin increment_views tapi jangan sampai crash halaman kalau fungsinya belum ada di DB
  try {
    await supabase.rpc('increment_views', { video_id: id });
  } catch (e) {
    console.warn('increment_views RPC not found or failed:', e);
  }
  
  // Tambahin download_url di query select
  const querySelect = `
      id, title, thumbnail_url, duration_seconds, views, release_year, created_at, download_url,
      studios (name),
      video_artists ( artists (name) ),
      video_categories ( categories (name, slug) ),
      video_tags ( tags (name) ),
      video_servers ( id, server_name, embed_url ) 
  `;

  const { data: video, error } = await supabase
    .from("videos")
    .select(querySelect)
    .eq("id", id)
    .single();

  const { data: relatedVideos } = await supabase
    .from("videos")
    .select("id, title, thumbnail_url, duration_seconds, views, created_at, studios(name)")
    .neq("id", id)
    .limit(8);

  if (error || !video) {
    console.error("Supabase Error fetching video:", error);
    return notFound();
  }
  
  const videoData = video as unknown as VideoData;
  const studioName = (Array.isArray(videoData.studios) ? videoData.studios[0]?.name : videoData.studios?.name) || "Unknown Studio";
  
  const artists = videoData.video_artists?.map((va) => va.artists?.name).filter(Boolean) || [];
  const categories = videoData.video_categories?.map((vc) => ({ name: vc.categories?.name, slug: vc.categories?.slug })).filter((c) => c.name && c.slug) || [];
  const tags = videoData.video_tags?.map((vt) => vt.tags?.name).filter(Boolean) || [];
  
  // Simulasi jumlah like dari views (sesuai logika lama lu)
  const simulatedLikes = formatViews(videoData.views / 2).replace(' views', '');

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />
      
      <main className="flex-1 px-4 lg:px-8 pt-6 pb-20">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 lg:w-[70%]">
            
            <VideoPlayer servers={videoData.video_servers as VideoServer[]} />

            {/* Video Info */}
            <div className="mt-6 flex flex-col gap-4 border-b border-[#333333] pb-6">
              
              {/* Judul & Views sekarang nyatu rapi */}
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl mb-2">
                  {videoData.title}
                </h1>
                <p className="text-sm font-medium text-gray-400">
                  {formatViews(videoData.views)} • Diupload {formatTimeAgo(videoData.created_at)}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                {/* Bagian Kiri kosongin karena channel udah dihapus, atau kasih spacer */}
                <div className="hidden sm:block"></div>

                {/* INJEKSI TOMBOL INTERAKTIF LU DI SINI */}
               <WatchActions 
                      videoId={videoData.id} 
                      initialLikes={videoData.likes || 0} 
                      downloadUrl={videoData.download_url} 
                    />
              </div>

              {/* Metadata Details Card (Sisa kode ini tetep sama persis kayak punya lu) */}
              <div className="mt-4 rounded-xl bg-[#222222]/60 p-4 border border-[#333333]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-400" />
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Artis / Cast</p>
                      <div className="flex flex-wrap gap-1">
                        {artists.length > 0 ? (
                          artists.map((artist, idx) => (
                            <Link key={idx} href={`/artist/${encodeURIComponent(artist.toLowerCase())}`} className="text-sm font-medium text-orange-400 hover:text-orange-300 transition">
                              {artist}{idx < artists.length - 1 ? ',' : ''}
                            </Link>
                          ))
                        ) : (
                          <p className="text-sm font-medium text-gray-200">Unknown Cast</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-pink-400" />
                    <div>
                         <p className="text-[10px] text-gray-500 uppercase tracking-wider">Kategori</p>
                         <div className="flex flex-wrap gap-1">
                           {categories.length > 0 ? (
                             categories.map((cat, idx) => (
                               <Link key={idx} href={`/category/${cat.slug}`} className="text-sm font-medium text-pink-400 hover:text-pink-300 transition">
                                 {cat.name}{idx < categories.length - 1 ? ',' : ''}
                               </Link>
                             ))
                           ) : (
                             <p className="text-sm font-medium text-gray-200">No Category</p>
                           )}
                         </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <div>
                         <p className="text-[10px] text-gray-500 uppercase tracking-wider">Tahun</p>
                         {videoData.release_year ? (
                           <Link href={`/year/${videoData.release_year}`} className="text-sm font-medium text-blue-400 hover:text-blue-300 transition">
                             {videoData.release_year}
                           </Link>
                         ) : (
                           <p className="text-sm font-medium text-gray-200">Unknown Year</p>
                         )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-green-400" />
                    <div>
                         <p className="text-[10px] text-gray-500 uppercase tracking-wider">Studio</p>
                         {studioName !== "Unknown Studio" ? (
                           <Link href={`/studio/${encodeURIComponent(studioName.toLowerCase())}`} className="text-sm font-medium text-green-400 hover:text-green-300 transition">
                             {studioName}
                           </Link>
                         ) : (
                           <p className="text-sm font-medium text-gray-400">{studioName}</p>
                         )}
                    </div>
                  </div>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-[#333333]">
                    <span className="text-xs font-bold text-gray-500 flex items-center gap-1 uppercase mr-2"><Tag className="w-3 h-3" /> Tags:</span>
                    {tags.map((tag: string, idx: number) => (
                      <Link key={idx} href={`/tag/${encodeURIComponent(tag.toLowerCase())}`} className="text-xs font-medium text-orange-500 hover:text-orange-400 transition">
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Related Videos */}
          <div className="lg:w-[30%]">
             <div className="sticky top-24">
               <h3 className="mb-4 text-lg font-bold text-white border-b border-[#333333] pb-2">
                 Rekomendasi
               </h3>
               
               <div className="flex flex-col gap-4">
                 {relatedVideos?.map((vid) => (
                   <Link href={`/watch/${vid.id}`} key={vid.id}>
                     <div className="group flex gap-3 cursor-pointer items-start rounded-xl p-2 hover:bg-[#222222] transition-colors">
                       <div className="relative w-40 flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-[#222222]">
                         <img src={vid.thumbnail_url} alt={vid.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                         <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-bold text-white">
                           {formatDuration(vid.duration_seconds)}
                         </div>
                       </div>
                       
                       <div className="flex flex-col flex-1 overflow-hidden">
                         <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-orange-400 transition">
                           {vid.title}
                         </h4>
                         <div className="mt-auto">
                           <p className="text-xs text-gray-400">{formatViews(vid.views)}</p>
                           <p className="text-xs text-gray-500">{formatTimeAgo(vid.created_at)}</p>
                         </div>
                       </div>
                     </div>
                   </Link>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}