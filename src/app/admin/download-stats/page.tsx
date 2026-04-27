'use client';

import { useEffect, useState } from 'react';
import { getTopDownloadedVideos, getRecentDownloadActivity } from '@/lib/downloadStats';
import { Download, TrendingUp, Eye } from 'lucide-react';

interface TopDownloaded {
  id: string;
  title: string;
  download_count: number;
  views: number;
}

interface RecentActivity {
  videoTitle: string;
  downloadCount: number;
  lastDownload: string;
}

export default function DownloadStatsPage() {
  const [topVideos, setTopVideos] = useState<TopDownloaded[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [topData, activityData] = await Promise.all([
          getTopDownloadedVideos(10),
          getRecentDownloadActivity(),
        ]);
        setTopVideos(topData);
        setRecentActivity(activityData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Download className="w-12 h-12 text-orange-500 mx-auto" />
          </div>
          <p className="text-gray-400">Memuat statistik download...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Download className="w-8 h-8 text-orange-500" />
            Download Statistics
          </h1>
          <p className="text-gray-400">Pantau aktivitas dan statistik download video</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Downloaded Videos */}
          <div className="bg-[#222222] rounded-xl border border-[#333333] p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-bold text-white">Video Paling Banyak Di-Download</h2>
            </div>

            <div className="space-y-4">
              {topVideos.length > 0 ? (
                topVideos.map((video, idx) => (
                  <div
                    key={video.id}
                    className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333333] hover:border-orange-500/50 transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded">
                            #{idx + 1}
                          </span>
                          <p className="text-white font-semibold line-clamp-1">{video.title}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-orange-400" />
                        <span className="text-gray-300">
                          {video.download_count?.toLocaleString() || 0} downloads
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300">
                          {video.views?.toLocaleString() || 0} views
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 bg-[#333333] rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-orange-600 h-1.5 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            (video.download_count / (topVideos[0]?.download_count || 1)) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">Belum ada data download</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#222222] rounded-xl border border-[#333333] p-6">
            <div className="flex items-center gap-2 mb-6">
              <Download className="w-5 h-5 text-pink-500" />
              <h2 className="text-xl font-bold text-white">Aktivitas Download 24 Jam</h2>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, idx) => (
                  <div
                    key={idx}
                    className="bg-[#1a1a1a] p-4 rounded-lg border border-[#333333]"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-white font-semibold line-clamp-2">
                        {activity.videoTitle}
                      </p>
                      <span className="text-sm font-bold text-pink-500 bg-pink-500/10 px-2 py-1 rounded whitespace-nowrap ml-2">
                        {activity.downloadCount}x
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Terakhir: {formatDate(activity.lastDownload)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">Tidak ada aktivitas download</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
          <p className="text-orange-300 text-sm">
            ℹ️ Statistik diperbarui secara real-time ketika user mengklik tombol download. 
            Data disimpan dalam tabel <code className="bg-orange-500/20 px-2 py-1 rounded">download_history</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
