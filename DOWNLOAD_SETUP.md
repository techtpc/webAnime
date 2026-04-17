# Setup Fitur Download - Supabase Schema

## Langkah 1: Update Tabel `videos`

Jalankan SQL query berikut di Supabase SQL Editor:

```sql
-- Tambahkan kolom-kolom baru untuk tracking download
ALTER TABLE videos 
ADD COLUMN IF NOT EXISTS download_url TEXT,
ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_downloaded TIMESTAMP;

-- Buat index untuk performa query
CREATE INDEX IF NOT EXISTS idx_videos_download_count 
ON videos(download_count DESC);
```

## Langkah 2: Buat Tabel `download_history`

Jalankan SQL query berikut untuk membuat tabel tracking download:

```sql
-- Buat tabel untuk mencatat riwayat download
CREATE TABLE download_history (
  id BIGSERIAL PRIMARY KEY,
  video_id UUID NOT NULL,
  video_title VARCHAR(255),
  downloaded_at TIMESTAMP DEFAULT NOW(),
  user_ip VARCHAR(45), -- Support IPv4 dan IPv6
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign key constraint
ALTER TABLE download_history 
ADD CONSTRAINT fk_download_history_videos
FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE;

-- Create index untuk query cepat berdasarkan video
CREATE INDEX idx_download_history_video_id 
ON download_history(video_id);

CREATE INDEX idx_download_history_downloaded_at 
ON download_history(downloaded_at DESC);
```

## Langkah 3: Setup Row Level Security (RLS)

Jalankan SQL query berikut untuk mengamankan akses:

```sql
-- Enable RLS
ALTER TABLE download_history ENABLE ROW LEVEL SECURITY;

-- Create policy untuk SELECT (public dapat melihat, tapi limited info)
CREATE POLICY "public_can_download_track" ON download_history
FOR SELECT USING (true);

-- Create policy untuk INSERT (anyone dapat insert)
CREATE POLICY "anyone_can_insert_download" ON download_history
FOR INSERT WITH CHECK (true);
```

## Langkah 4: Iisi Data Download URL

Update video dengan download URL di Supabase Dashboard:

```sql
-- Contoh: Update video dengan ID tertentu
UPDATE videos 
SET download_url = 'https://your-download-server.com/video/file.mp4'
WHERE id = 'your-video-id';

-- Atau update beberapa video sekaligus
UPDATE videos 
SET download_url = concat('https://your-download-server.com/videos/', id, '.mp4')
WHERE download_url IS NULL;
```

## Langkah 5: Konfigurasi Environment Variables

Pastikan `.env.local` sudah berisi:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Fitur yang Sudah Diimplementasikan

✅ **Tombol Download** - Tombol download yang terintegrasi dengan UI
✅ **Tracking Downloads** - Mencatat setiap download ke tabel `download_history`
✅ **Download Counter** - Menghitung total download per video di kolom `download_count`
✅ **Last Downloaded** - Mencatat waktu terakhir video didownload
✅ **User IP Logging** - Mencatat IP pengguna yang download
✅ **Loading State** - Tombol loading saat proses download

## API Endpoint

**POST** `/api/videos/[id]/download`

request:
```json
{}
```

Response sukses (200):
```json
{
  "success": true,
  "downloadUrl": "https://...",
  "newDownloadCount": 42
}
```

Response error:
```json
{
  "error": "Video tidak ditemukan"
}
```

## Cara Menggunakan di Frontend

1. **Otomatis** - Tombol download sudah aktif ketika `download_url` tersedia di data video
2. **User Experience** - Clicking tombol akan:
   - Mencatat download ke database
   - Menampilkan jumlah download yang diupdate
   - Membuka link download di tab baru
   - Menampilkan toast success

## Query untuk Monitor Downloads

```sql
-- Lihat statistik download per video
SELECT 
  v.id,
  v.title,
  v.download_count,
  COUNT(dh.id) as total_downloads,
  MAX(dh.downloaded_at) as last_downloaded
FROM videos v
LEFT JOIN download_history dh ON v.id = dh.video_id
GROUP BY v.id, v.title, v.download_count
ORDER BY v.download_count DESC;

-- Lihat aktivitas download terakhir 24 jam
SELECT 
  dh.video_title,
  COUNT(*) as downloads_count,
  MAX(dh.downloaded_at) as last_download
FROM download_history dh
WHERE dh.downloaded_at >= NOW() - INTERVAL '24 hours'
GROUP BY dh.video_title
ORDER BY downloads_count DESC;
```

## Troubleshooting

**Q: Download button tidak muncul**
- Pastikan `download_url` sudah diisi di database untuk video tersebut
- Check console browser untuk error messages

**Q: Download tidak tercatat di database**
- Verify RLS policies sudah di-enable dengan benar
- Check network tab di browser DevTools untuk melihat response API

**Q: Error "Video tidak ditemukan"**
- Pastikan video ID yang dikirim benar
- Check bahwa video sudah ada di database `videos` table
