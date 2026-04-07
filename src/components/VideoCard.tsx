import Link from "next/link";
import { Video, formatViews, formatTimeAgo, formatDuration } from "@/lib/data";

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/watch/${video.id}`} className="group flex cursor-pointer flex-col gap-3 rounded-xl p-2 transition-all hover:bg-[#222222]">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#222222]">
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
          {formatDuration(video.duration_seconds)}
        </div>
      </div>

      {/* Metadata */}
      <div className="flex gap-3">
        {/* Video Info */}
        <div className="flex flex-col">
          <h3 className="line-clamp-2 text-sm font-bold leading-tight text-white group-hover:text-orange-400 transition-colors">
            {video.title}
          </h3>
          <p className="mt-1 text-xs text-gray-400">
            {Array.isArray(video.studios) ? video.studios[0]?.name : video.studios?.name || "Unknown Studio"}
          </p>
          <p className="text-xs text-gray-400">
            {formatViews(video.views)} • {formatTimeAgo(video.created_at)}
          </p>
        </div>
      </div>
    </Link>
  );
}
