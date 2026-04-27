// components/WatchActions.tsx
"use client";

import { useState } from "react";
import { ThumbsUp, Share2, Download } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase"; // <--- INI WAJIB DI-IMPORT

interface WatchActionsProps {
  videoId: string;       // <--- WAJIB ADA BIAR TAU VIDEO MANA YANG DI-LIKE
  initialLikes: number;  // <--- Ganti jadi number biar gampang dihitung
  downloadUrl?: string;
}

export default function WatchActions({ videoId, initialLikes, downloadUrl }: WatchActionsProps) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  
  // Kita simpan angka likes di state biar layarnya langsung update pas diklik
  const [likesCount, setLikesCount] = useState(initialLikes);

  const handleLike = async () => {
    if (!liked) {
      // 1. Update layar duluan biar user gak kerasa lag (Optimistic Update)
      setLiked(true);
      setDisliked(false);
      setLikesCount(prev => prev + 1);
      toast.success("Masuk daftar disukai!", { icon: '🔥' });

      // 2. Tembak update ke Supabase di latar belakang
      await supabase.from('videos')
        .update({ likes: initialLikes + 1 }) 
        .eq('id', videoId);
        
    } else {
      // Kalau user ngeklik lagi (Batal Like)
      setLiked(false);
      setLikesCount(prev => prev - 1);
      
      await supabase.from('videos')
        .update({ likes: initialLikes }) 
        .eq('id', videoId);
    }
  };

  const handleDislike = () => {
    if (!disliked) {
      setDisliked(true);
      if (liked) {
        setLiked(false);
        setLikesCount(prev => prev - 1);
        // Batalin like di database juga
        supabase.from('videos').update({ likes: initialLikes }).eq('id', videoId);
      }
      toast("Batal disukai.", { icon: '👎' });
    } else {
      setDisliked(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link berhasil dicopy! Tinggal paste ke sirkel lu.");
    } catch (err) {
      toast.error("Gagal copy link.");
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) {
      return;
    }
    window.open(downloadUrl, "_blank");
  };

  // Fungsi buat ngubah angka "1500" jadi "1.5K" 
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="flex items-center space-x-2 sm:space-x-3 mt-4 sm:mt-0">
      {/* Tombol Like/Dislike */}
      <div className="flex items-center rounded-full bg-[#222222] text-sm font-medium text-white border border-[#333]">
        <button 
          onClick={handleLike} 
          className={`flex items-center space-x-2 rounded-l-full px-4 py-2 hover:bg-[#2a2a2a] border-r border-[#333] transition ${liked ? 'text-orange-500' : ''}`}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{formatNumber(likesCount)}</span>
        </button>
        <button 
          onClick={handleDislike} 
          className={`flex items-center px-4 py-2 rounded-r-full hover:bg-[#2a2a2a] transition ${disliked ? 'text-blue-500' : ''}`}
        >
          <ThumbsUp className="h-4 w-4 rotate-180" />
        </button>
      </div>

      {/* Tombol Share */}
      <button 
        onClick={handleShare} 
        className="flex items-center space-x-2 rounded-full bg-[#222222] border border-[#333] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a2a2a] hover:text-orange-500 transition"
      >
        <Share2 className="h-4 w-4" />
      </button>

      {/* Tombol Download */}
      <button 
        onClick={handleDownload}
        disabled={!downloadUrl}
        className={`flex items-center space-x-2 rounded-full px-4 sm:px-5 py-2 text-sm font-bold transition shadow-lg ${
          !downloadUrl
            ? "bg-gray-600 text-gray-300 cursor-not-allowed shadow-gray-600/20 opacity-50"
            : "bg-orange-500 text-black hover:bg-orange-600 shadow-orange-500/20"
        }`}
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Download</span>
      </button>
    </div>
  );
}