import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

interface DownloadRequest {
  videoId: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Dapatkan data video dari Supabase
    const { data: video, error: videoError } = await supabase
      .from("videos")
      .select("id, title, download_url, download_count")
      .eq("id", id)
      .single();

    if (videoError || !video) {
      return NextResponse.json(
        { error: "Video tidak ditemukan" },
        { status: 404 }
      );
    }

    // Jika tidak ada download_url, kembalikan error
    if (!video.download_url) {
      return NextResponse.json(
        { error: "Download tidak tersedia untuk video ini" },
        { status: 400 }
      );
    }

    // Update download count di database
    const newDownloadCount = (video.download_count || 0) + 1;
    
    const { error: updateError } = await supabase
      .from("videos")
      .update({ 
        download_count: newDownloadCount,
        last_downloaded: new Date().toISOString()
      })
      .eq("id", id);

    // Catat detail download di tabel download_history
    await supabase.from("download_history").insert({
      video_id: id,
      video_title: video.title,
      downloaded_at: new Date().toISOString(),
      user_ip: request.headers.get("x-forwarded-for") || "unknown",
    });

    return NextResponse.json({
      success: true,
      downloadUrl: video.download_url,
      newDownloadCount: newDownloadCount,
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses download" },
      { status: 500 }
    );
  }
}
