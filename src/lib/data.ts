export interface Video {
  id: string;
  created_at: string;
  title: string;
  thumbnail_url: string;
  video_url: string;
  duration_seconds: number;
  views: number;
  release_year: number;
  studios: { name: string } | { name: string }[] | null;
  video_artists?: { artists: { name: string } }[] | null;
  video_categories?: { categories: { name: string, slug: string } }[] | null;
  video_tags?: { tags: { name: string } }[] | null;
}

export function formatViews(views: number): string {
  if (!views) return "0 views";
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1).replace(/\.0$/, "") + "M views";
  }
  if (views >= 1000) {
    return (views / 1000).toFixed(1).replace(/\.0$/, "") + "K views";
  }
  return views + " views";
}

export function formatTimeAgo(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} detik yang lalu`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} hari yang lalu`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} bulan yang lalu`;
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} tahun yang lalu`;
}

export function formatDuration(seconds: number): string {
  if (!seconds) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const navItems = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Kategori", href: "/category", icon: "genre" },
  { label: "Artist", href: "/artist", icon: "artist" },
  { label: "Tags", href: "/tag", icon: "tag" },
  { label: "Studio", href: "/studio", icon: "studio" },
  { label: "Year", href: "/year", icon: "year" },
];

export const filterTabs = ["Terbaru", "minggu ini", "bulan ini", "tahun ini"];
