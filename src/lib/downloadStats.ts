import { supabase } from "@/lib/supabase";

// Tipe untuk response download
export interface DownloadStats {
  videoId: string;
  title: string;
  downloadCount: number;
  lastDownloaded: string | null;
}

export interface DownloadActivity {
  videoTitle: string;
  downloadCount: number;
  lastDownload: string;
}

/**
 * Dapatkan statistik download untuk single video
 */
export async function getVideoDownloadStats(videoId: string): Promise<DownloadStats | null> {
  try {
    const { data, error } = await supabase
      .from("videos")
      .select("id, title, download_count, last_downloaded")
      .eq("id", videoId)
      .single();

    if (error || !data) {
      console.error("Error fetching download stats:", error);
      return null;
    }

    return {
      videoId: data.id,
      title: data.title,
      downloadCount: data.download_count || 0,
      lastDownloaded: data.last_downloaded,
    };
  } catch (error) {
    console.error("Error getting download stats:", error);
    return null;
  }
}

/**
 * Dapatkan video dengan download count terbanyak
 */
export async function getTopDownloadedVideos(limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from("videos")
      .select("id, title, thumbnail_url, download_count, views")
      .order("download_count", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching top downloaded videos:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error getting top downloaded videos:", error);
    return [];
  }
}

/**
 * Dapatkan aktivitas download dalam 24 jam terakhir
 */
export async function getRecentDownloadActivity(): Promise<DownloadActivity[]> {
  try {
    const { data, error } = await supabase
      .from("download_history")
      .select("video_title, downloaded_at")
      .gte("downloaded_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error("Error fetching download activity:", error);
      return [];
    }

    // Group by video_title dan hitung download
    const grouped: { [key: string]: { count: number; lastDownload: string } } = {};

    data?.forEach((item) => {
      if (!grouped[item.video_title]) {
        grouped[item.video_title] = { count: 0, lastDownload: "" };
      }
      grouped[item.video_title].count += 1;
      grouped[item.video_title].lastDownload = item.downloaded_at;
    });

    return Object.entries(grouped).map(([title, stats]) => ({
      videoTitle: title || "Unknown",
      downloadCount: stats.count,
      lastDownload: stats.lastDownload,
    }));
  } catch (error) {
    console.error("Error getting recent download activity:", error);
    return [];
  }
}

/**
 * Dapatkan total download count untuk video tertentu
 */
export async function getTotalDownloadCount(videoId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("download_history")
      .select("*", { count: "exact", head: true })
      .eq("video_id", videoId);

    if (error) {
      console.error("Error counting downloads:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Error getting total download count:", error);
    return 0;
  }
}

/**
 * Get download history dengan pagination
 */
export async function getDownloadHistory(
  videoId?: string,
  limit: number = 50,
  offset: number = 0
) {
  try {
    let query = supabase
      .from("download_history")
      .select("id, video_title, downloaded_at, user_ip", { count: "exact" });

    if (videoId) {
      query = query.eq("video_id", videoId);
    }

    const { data, error, count } = await query
      .order("downloaded_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching download history:", error);
      return { data: [], total: 0 };
    }

    return {
      data: data || [],
      total: count || 0,
    };
  } catch (error) {
    console.error("Error getting download history:", error);
    return { data: [], total: 0 };
  }
}
