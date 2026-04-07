import Header from "@/components/Header";
import VideoPlayer, { VideoServer } from "@/components/VideoPlayer";
import { formatViews, formatTimeAgo, formatDuration } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { ThumbsUp, Clock, Share2, Film, Calendar, Building2, User, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // QUERY KELAS BERAT: Mengambil semua relasi, termasuk SERVER VIDEO
  const querySelect = `
      id, title, thumbnail_url, duration_seconds, views, release_year, created_at,
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
    return notFound();
  }

  // --- LOGIKA MAPPING DATA YANG BERSIH (Tanpa casting asal-asalan) ---
  const studioName = video.studios?.name || "Unknown Studio";
  
  const castNames = video.video_artists
    ?.map((va: any) => va.artists?.name)
    .filter(Boolean).join(", ") || "Unknown Cast";
    
  const categoryNames = video.video_categories
    ?.map((vc: any) => vc.categories?.name)
    .filter(Boolean).join(", ") || "No Category";
    
  const tags = video.video_tags
    ?.map((vt: any) => vt.tags?.name)
    .filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />
      
      <main className="flex-1 px-4 lg:px-8 pt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 lg:w-[70%]">
            
            {/* INJEKSI DATA KE KOMPONEN PLAYER */}
            <VideoPlayer servers={video.video_servers as VideoServer[]} />

            {/* Video Info */}
            <div className="mt-6 flex flex-col gap-4 border-b border-[#333333] pb-6">
              <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                {video.title}
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Studio & Metrics */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-lg font-bold text-black shadow-inner uppercase">
                    {studioName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{studioName}</h3>
                    <p className="text-xs text-gray-400">{formatViews(video.views)} • {formatTimeAgo(video.created_at)}</p>
                  </div>
                  <button className="ml-4 rounded-full bg-white px-5 py-2 text-sm font-bold text-black hover:bg-gray-200 transition">
                    Ikuti
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center rounded-full bg-[#222222] text-sm font-medium text-white">
                    <button className="flex items-center space-x-2 rounded-l-full px-4 py-2 hover:bg-[#2a2a2a] border-r border-[#333333] transition">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{formatViews(video.views / 2).replace(' views', '')}</span>
                    </button>
                    <button className="flex items-center px-4 py-2 rounded-r-full hover:bg-[#2a2a2a] transition">
                       <ThumbsUp className="h-4 w-4 rotate-180" />
                    </button>
                  </div>
                  <button className="flex items-center space-x-2 rounded-full bg-[#222222] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a2a2a] transition">
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button className="flex items-center space-x-2 rounded-full bg-[#222222] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a2a2a] transition">
                    <Clock className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Metadata Details Card */}
              <div className="mt-4 rounded-xl bg-[#222222]/60 p-4 border border-[#333333]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-400" />
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Artis / Cast</p>
                      <p className="text-sm font-medium text-gray-200 line-clamp-1">{castNames}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-pink-400" />
                    <div>
                         <p className="text-[10px] text-gray-500 uppercase tracking-wider">Kategori</p>
                         <p className="text-sm font-medium text-gray-200 line-clamp-1">{categoryNames}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <div>
                         <p className="text-[10px] text-gray-500 uppercase tracking-wider">Tahun</p>
                         <p className="text-sm font-medium text-gray-200">{video.release_year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-green-400" />
                    <div>
                         <p className="text-[10px] text-gray-500 uppercase tracking-wider">Studio</p>
                         <p className="text-sm font-medium text-gray-200 line-clamp-1">{studioName}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm leading-relaxed text-gray-300 mb-6">
                  Tonton seri terbaru dari {studioName}. Video ini menampilkan performa luar biasa dari {castNames} dalam genre {categoryNames} yang dirilis pada tahun {video.release_year}.
                </p>

                {/* Tags Section */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-[#333333]">
                    <span className="text-xs font-bold text-gray-500 flex items-center gap-1 uppercase mr-2"><Tag className="w-3 h-3" /> Tags:</span>
                    {tags.map((tag: string, idx: number) => (
                      <Link 
                        key={idx} 
                        href={`/tag/${encodeURIComponent(tag.toLowerCase())}`}
                        className="text-xs font-medium text-orange-500 hover:text-orange-400 transition"
                      >
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
                 {relatedVideos?.map((vid: any) => (
                   <Link href={`/watch/${vid.id}`} key={vid.id}>
                     <div className="group flex gap-3 cursor-pointer items-start rounded-xl p-2 hover:bg-[#222222] transition-colors">
                       <div className="relative w-40 flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-[#222222]">
                         <img 
                           src={vid.thumbnail_url} 
                           alt={vid.title}
                           className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                         />
                         <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-bold text-white">
                           {formatDuration(vid.duration_seconds)}
                         </div>
                       </div>
                       
                       <div className="flex flex-col flex-1 overflow-hidden