"use client";

import { useState } from "react";
import { PlayCircle } from "lucide-react";

// Tipe data yang ngikutin database Supabase lu
export type VideoServer = {
  id: string;
  server_name: string;
  embed_url: string;
};

export default function VideoPlayer({ servers }: { servers: VideoServer[] }) {
  // Kalau database belum diisi, tampilin layar hitam elegan
  if (!servers || servers.length === 0) {
    return (
      <div className="relative aspect-video w-full rounded-2xl bg-[#111] flex items-center justify-center border border-[#333333]">
        <p className="text-zinc-500 font-medium">Belum ada server video tersedia untuk film ini.</p>
      </div>
    );
  }

  // State: Default aktif di server urutan pertama
  const [activeServer, setActiveServer] = useState<VideoServer>(servers[0]);

  return (
    <>
      <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden shadow-2xl group border border-[#333333]">
        {/* Iframe Polosan buat ngadepin Turbovip/Filedon */}
        <iframe 
          key={activeServer.id} 
          src={activeServer.embed_url} 
          className="absolute top-0 left-0 w-full h-full border-0"
          allowFullScreen
          allow="autoplay"
        ></iframe>
      </div>

      {/* Tombol Pilihan Server Dinamis */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-gray-400 mr-2 flex items-center gap-1.5">
          <PlayCircle className="w-4 h-4" /> Server Pemutaran:
        </span>
        
        {servers.map((server) => {
          const isActive = activeServer.id === server.id;
          return (
            <button
              key={server.id}
              onClick={() => setActiveServer(server)}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                isActive
                  ? "bg-orange-500 font-bold text-black border border-orange-500 shadow-lg shadow-orange-500/20"
                  : "bg-[#222222] font-medium text-white border border-[#333333] hover:bg-[#2a2a2a] hover:border-[#555]"
              }`}
            >
              {server.server_name}
            </button>
          );
        })}
      </div>
    </>
  );
}