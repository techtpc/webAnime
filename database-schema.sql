-- 1. Buat Tabel
CREATE TABLE videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  title text NOT NULL,
  thumbnail text NOT NULL,
  duration text NOT NULL,
  views bigint DEFAULT 0 NOT NULL,
  studio text,
  genre text,
  artist text,
  year text
);

-- 2. Tiga baris data uji coba (Dummy Data) agar tidak kosong
INSERT INTO videos (title, thumbnail, duration, views, studio, genre, artist, year)
VALUES 
  ('The Art of Minimalist Cinematography in 2024', 'https://picsum.photos/seed/vid1/400/225', '12:45', 1200000, 'Auteur Studios', 'Cinematography', 'John Doe', '2024'),
  ('Why Every Frame Matters: Scorsese Perspective', 'https://picsum.photos/seed/vid2/400/225', '04:20', 850000, 'Film Theory Pro', 'Documentary', 'Jane Smith', '2023'),
  ('Symmetry and Chaos: Designing the Perfect', 'https://picsum.photos/seed/vid3/400/225', '18:10', 3600000, 'Visual Storyteller', 'Art', 'Alex Johnson', '2024');

-- 3. Matikan Keamanan Baris Sementara agar data bisa dibaca oleh Front End Web Anda tanpa harus Login
ALTER TABLE videos DISABLE ROW LEVEL SECURITY;
