"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import { Pencil, Trash2, X, Database, PlusCircle, RefreshCw } from "lucide-react";

export default function AdminManagePage() {
  // Data Master
  const [videos, setVideos] = useState<any[]>([]);
  const [studios, setStudios] = useState<any[]>([]);
  const [allArtists, setAllArtists] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<any[]>([]);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const initialForm = {
    title: "",
    thumbnail_url: "",
    duration_seconds: "",
    release_year: currentYear.toString(),
    studio_id: "",
    artists_raw: "", 
    categories_raw: "", 
    tags_raw: "", 
    filedon_url: "",
    turbovip_url: "",
  };
  const [formData, setFormData] = useState(initialForm);

  // 1. FETCH SEMUA DATA (Paralel)
  const fetchAllData = async () => {
    setFetchLoading(true);
    
    const [vRes, sRes, aRes, cRes, tRes] = await Promise.all([
      supabase.from("videos").select(`*, studios(id, name), video_servers(*), video_artists(artists(name)), video_categories(categories(name)), video_tags(tags(name))`).order("created_at", { ascending: false }),
      supabase.from("studios").select("id, name").order("name"),
      supabase.from("artists").select("name").order("name"),
      supabase.from("categories").select("name").order("name"),
      supabase.from("tags").select("name").order("name"),
    ]);

    if (vRes.data) setVideos(vRes.data);
    if (sRes.data) setStudios(sRes.data);
    if (aRes.data) setAllArtists(aRes.data);
    if (cRes.data) setAllCategories(cRes.data);
    if (tRes.data) setAllTags(tRes.data);
    
    setFetchLoading(false);
  };

  useEffect(() => { fetchAllData(); }, []);

  // 2. FUNGSI SUGGESTION PILLS
  const appendToInput = (field: 'artists_raw' | 'categories_raw' | 'tags_raw', value: string) => {
    setFormData(prev => {
      const current = prev[field].trim();
      if (current.length === 0) return { ...prev, [field]: value };
      
      const items = current.split(',').map(i => i.trim());
      if (items.includes(value)) return prev; 
      
      const cleanedCurrent = current.endsWith(',') ? current.slice(0, -1) : current;
      return { ...prev, [field]: `${cleanedCurrent}, ${value}` };
    });
  };

  // 3. FUNGSI RELASI MANY-TO-MANY
  const handleManyToMany = async (videoId: string, rawData: string, tableName: string, junctionTable: string, columnId: string) => {
    if (!rawData) return;
    const items = rawData.split(",").map(i => i.trim()).filter(Boolean);
    for (const item of items) {
      const { data: masterItem, error: mError } = await supabase.from(tableName).upsert({ name: item }, { onConflict: 'name' }).select().single();
      if (!mError && masterItem) {
        await supabase.from(junctionTable).insert([{ video_id: videoId, [columnId]: masterItem.id }]);
      }
    }
  };

  // 4. SUBMIT FORM (CREATE / UPDATE)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Sedang mengeksekusi ke database...");

    try {
      let currentId = editingId;
      const videoPayload = {
        title: formData.title,
        thumbnail_url: formData.thumbnail_url,
        duration_seconds: parseInt(formData.duration_seconds),
        release_year: parseInt(formData.release_year),
        studio_id: formData.studio_id || null,
        video_url: formData.filedon_url || formData.turbovip_url || "",
      };

      if (editingId) {
        // UPDATE
        await supabase.from("videos").update(videoPayload).eq("id", editingId);
        await Promise.all([
          supabase.from("video_servers").delete().eq("video_id", editingId),
          supabase.from("video_artists").delete().eq("video_id", editingId),
          supabase.from("video_categories").delete().eq("video_id", editingId),
          supabase.from("video_tags").delete().eq("video_id", editingId),
        ]);
      } else {
        // CREATE
        const { data: v, error } = await supabase.from("videos").insert([videoPayload]).select().single();
        if (error) throw error;
        currentId = v.id;
      }

      if (currentId) {
        const servers = [];
        if (formData.filedon_url) servers.push({ video_id: currentId, server_name: "Filedon", embed_url: formData.filedon_url });
        if (formData.turbovip_url) servers.push({ video_id: currentId, server_name: "Turbovip", embed_url: formData.turbovip_url });
        if (servers.length > 0) await supabase.from("video_servers").insert(servers);

        await Promise.all([
          handleManyToMany(currentId, formData.artists_raw, "artists", "video_artists", "artist_id"),
          handleManyToMany(currentId, formData.categories_raw, "categories", "video_categories", "category_id"),
          handleManyToMany(currentId, formData.tags_raw, "tags", "video_tags", "tag_id"),
        ]);
      }

      setStatus(editingId ? "Sukses Update Data!" : "Sukses Bikin Film Baru!");
      setEditingId(null);
      setFormData(initialForm);
      fetchAllData();
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 5000); // Hilangin pesan setelah 5 detik
    }
  };

  // 5. EDIT & DELETE BUTTON HANDLERS
  const handleEdit = (v: any) => {
    setEditingId(v.id);
    setFormData({
      title: v.title,
      thumbnail_url: v.thumbnail_url,
      duration_seconds: v.duration_seconds.toString(),
      release_year: v.release_year.toString(),
      studio_id: v.studio_id || "",
      artists_raw: v.video_artists?.map((a: any) => a.artists.name).join(", ") || "",
      categories_raw: v.video_categories?.map((c: any) => c.categories.name).join(", ") || "",
      tags_raw: v.video_tags?.map((t: any) => t.tags.name).join(", ") || "",
      filedon_url: v.video_servers?.find((s: any) => s.server_name === "Filedon")?.embed_url || "",
      turbovip_url: v.video_servers?.find((s: any) => s.server_name === "Turbovip")?.embed_url || "",
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Yakin mau menghapus film "${title}" permanen?`)) return;
    try {
      const { error } = await supabase.from("videos").delete().eq("id", id);
      if (error) throw error;
      fetchAllData();
    } catch (err: any) {
      alert(`Gagal hapus: ${err.message}`);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(initialForm);
    setStatus("");
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white pb-20">
      <Header />
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        
        {/* ================= FORM SECTION ================= */}
        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#333] mb-12 shadow-2xl relative overflow-hidden">
          {/* Aksen Garis Atas */}
          <div className={`absolute top-0 left-0 w-full h-1 ${editingId ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <PlusCircle className={`${editingId ? 'text-blue-500' : 'text-orange-500'} w-8 h-8`} />
              <h1 className="text-2xl font-bold">{editingId ? "Mode Edit Film" : "Mode Tambah Film"}</h1>
            </div>
            {editingId && (
              <button onClick={cancelEdit} className="text-gray-400 hover:text-white flex items-center gap-2 bg-[#222] px-3 py-1.5 rounded-lg border border-[#333]">
                <X className="w-4 h-4"/> Batal Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Kolom Kiri: Metadata Dasar */}
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 font-bold">JUDUL FILM</label>
                <input className="w-full bg-[#222] border border-[#333] p-3 rounded-lg mt-1 outline-none focus:border-orange-500" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold">URL THUMBNAIL</label>
                <input className="w-full bg-[#222] border border-[#333] p-3 rounded-lg mt-1 outline-none focus:border-orange-500" value={formData.thumbnail_url} onChange={e => setFormData({...formData, thumbnail_url: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-bold">DURASI (DETIK)</label>
                  <input type="number" className="w-full bg-[#222] border border-[#333] p-3 rounded-lg mt-1 outline-none focus:border-orange-500" value={formData.duration_seconds} onChange={e => setFormData({...formData, duration_seconds: e.target.value})} required />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-bold">TAHUN RILIS</label>
                  <select className="w-full bg-[#222] border border-[#333] p-3 rounded-lg mt-1 outline-none focus:border-orange-500" value={formData.release_year} onChange={e => setFormData({...formData, release_year: e.target.value})} required>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold">STUDIO</label>
                <select className="w-full bg-[#222] border border-[#333] p-3 rounded-lg mt-1 outline-none focus:border-orange-500" value={formData.studio_id} onChange={e => setFormData({...formData, studio_id: e.target.value})}>
                  <option value="">Pilih Studio (Opsional)</option>
                  {studios.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            {/* Kolom Kanan: Relasi & Server */}
            <div className="space-y-5">
              <div>
                <label className="text-xs text-gray-500 font-bold">ARTIS / CAST</label>
                <input placeholder="Ketik manual pakai koma..." className="w-full bg-[#222] border border-[#333] p-3 rounded-lg mt-1 outline-none focus:border-orange-500" value={formData.artists_raw} onChange={e => setFormData({...formData, artists_raw: e.target.value})} />
                <div className="flex flex-wrap gap-1 mt-2 max-h-24 overflow-y-auto p-2 border border-[#333] rounded bg-[#111]">
                  {allArtists.map((a, i) => (
                    <button type="button" key={i} onClick={() => appendToInput('artists_raw', a.name)} className="text-[10px] font-medium bg-zinc-800 px-2 py-1 rounded hover:bg-orange-500 hover:text-black transition">
                      + {a.name}
                    </button>
                  ))}
                  {allArtists.length === 0 && <span className="text-[10px] text-gray-500">Belum ada artis.</span>}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-bold">KATEGORI</label>
                <input placeholder="Ketik manual pakai koma..." className="w-full bg-[#222] border border-[#333] p-3 rounded-lg mt-1 outline-none focus:border-orange-500" value={formData.categories_raw} onChange={e => setFormData({...formData, categories_raw: e.target.value})} />
                <div className="flex flex-wrap gap-1 mt-2 max-h-24 overflow-y-auto p-2 border border-[#333] rounded bg-[#111]">
                  {allCategories.map((c, i) => (
                    <button type="button" key={i} onClick={() => appendToInput('categories_raw', c.name)} className="text-[10px] font-medium bg-zinc-800 px-2 py-1 rounded hover:bg-pink-500 hover:text-black transition">
                      + {c.name}
                    </button>
                  ))}
                  {allCategories.length === 0 && <span className="text-[10px] text-gray-500">Belum ada kategori.</span>}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-bold">TAGS KHUSUS</label>
                <input placeholder="Ketik manual pakai koma..." className="w-full bg-[#222] border border-[#333] p-3 rounded-lg mt-1 outline-none focus:border-orange-500" value={formData.tags_raw} onChange={e => setFormData({...formData, tags_raw: e.target.value})} />
                <div className="flex flex-wrap gap-1 mt-2 max-h-20 overflow-y-auto p-2 border border-[#333] rounded bg-[#111]">
                  {allTags.map((t, i) => (
                    <button type="button" key={i} onClick={() => appendToInput('tags_raw', t.name)} className="text-[10px] font-medium bg-zinc-800 px-2 py-1 rounded hover:bg-blue-500 hover:text-black transition">
                      + {t.name}
                    </button>
                  ))}
                  {allTags.length === 0 && <span className="text-[10px] text-gray-500">Belum ada tags.</span>}
                </div>
              </div>

              <div className="pt-2 border-t border-[#333]">
                <label className="text-xs text-gray-500 font-bold block mb-2">LINK SERVER IFRAME</label>
                <input placeholder="URL Embed Filedon" className="w-full bg-[#222] border border-[#333] p-2.5 rounded-lg mb-2 text-sm outline-none focus:border-orange-500" value={formData.filedon_url} onChange={e => setFormData({...formData, filedon_url: e.target.value})} />
                <input placeholder="URL Embed Turbovip" className="w-full bg-[#222] border border-[#333] p-2.5 rounded-lg text-sm outline-none focus:border-orange-500" value={formData.turbovip_url} onChange={e => setFormData({...formData, turbovip_url: e.target.value})} />
              </div>
            </div>

            <div className="md:col-span-2 mt-4">
              <button disabled={loading} className={`w-full font-black py-4 rounded-xl transition shadow-lg ${editingId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 text-white' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20 text-black'}`}>
                {loading ? "MENGEKSEKUSI DATA..." : (editingId ? "SIMPAN PERUBAHAN" : "SUNTIK DATA SEKARANG")}
              </button>
              {status && <p className={`mt-4 text-center font-bold bg-[#222] p-3 rounded-lg border ${status.includes('Error') ? 'text-red-400 border-red-500/30' : 'text-green-400 border-green-500/30'}`}>{status}</p>}
            </div>
          </form>
        </div>

        {/* ================= LIST SECTION ================= */}
        <div>
          <div className="flex items-center justify-between mb-6 border-b border-[#333] pb-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><Database className="w-5 h-5 text-gray-400"/> Inventory Database Film</h2>
            <button onClick={fetchAllData} className="text-sm bg-[#222] hover:bg-[#333] px-3 py-1.5 rounded flex items-center gap-2 transition border border-[#444]">
              <RefreshCw className={`w-4 h-4 ${fetchLoading ? 'animate-spin text-orange-500' : 'text-gray-300'}`} /> Refresh
            </button>
          </div>

          {fetchLoading ? (
             <div className="flex justify-center p-10"><p className="text-gray-500 font-medium animate-pulse">Menarik data dari Supabase...</p></div>
          ) : (
            <div className="space-y-3">
              {videos.map((vid) => (
                <div key={vid.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#111] border border-[#333] p-4 rounded-xl hover:border-orange-500/50 transition group gap-4">
                  <div className="flex items-center gap-4 flex-1 overflow-hidden">
                    <img src={vid.thumbnail_url} className="w-24 h-14 object-cover rounded-lg shadow-lg flex-shrink-0" alt="thumbnail" />
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-orange-50 truncate group-hover:text-orange-500 transition">{vid.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-[10px] bg-[#222] px-2 py-0.5 rounded text-gray-400">{vid.release_year}</span>
                        <span className="text-[10px] bg-[#222] px-2 py-0.5 rounded text-gray-400">{vid.studios?.name || "No Studio"}</span>
                        <span className="text-[10px] bg-[#222] px-2 py-0.5 rounded text-blue-400 border border-blue-500/20">{vid.video_servers?.length || 0} Servers</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:ml-auto">
                    <button onClick={() => handleEdit(vid)} className="px-4 py-2 bg-blue-500/10 text-blue-400 font-bold text-sm rounded-lg hover:bg-blue-500/20 transition flex items-center gap-2">
                      <Pencil className="w-4 h-4"/> Edit
                    </button>
                    <button onClick={() => handleDelete(vid.id, vid.title)} className="px-4 py-2 bg-red-500/10 text-red-400 font-bold text-sm rounded-lg hover:bg-red-500/20 transition flex items-center gap-2">
                      <Trash2 className="w-4 h-4"/> Hapus
                    </button>
                  </div>
                </div>
              ))}
              {videos.length === 0 && (
                <div className="text-center p-12 border border-dashed border-[#444] rounded-2xl bg-[#111]">
                  <p className="text-gray-500">Database lu masih kosong bro. Input data di atas sekarang.</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}