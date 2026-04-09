"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Munculin loading toast
    const toastId = toast.loading("Membuat akun baru...");

    // Nyelundupin NAMA ke metadata Supabase
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { data: { name } } 
    });

    if (error) {
      // Jika gagal, ubah toast jadi error
      toast.error(error.message, { id: toastId });
      setLoading(false);
    } else {
      // Jika sukses, ubah toast jadi sukses
      toast.success("Akun berhasil dibuat! Silakan Login.", { id: toastId });
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Header />
      <div className="flex justify-center items-center h-[80vh]">
        <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl border border-[#333] shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-2 text-white">Bikin Akun</h1>
          <p className="text-center text-gray-400 mb-8 text-sm">Gabung buat nonton tanpa batas</p>
          
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-2">NAMA PANGGILAN</label>
              <input type="text" className="w-full bg-[#222] border border-[#333] p-3 rounded-lg outline-none focus:border-orange-500 transition" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-2">EMAIL</label>
              <input type="email" className="w-full bg-[#222] border border-[#333] p-3 rounded-lg outline-none focus:border-orange-500 transition" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-2">PASSWORD</label>
              <input type="password" minLength={6} className="w-full bg-[#222] border border-[#333] p-3 rounded-lg outline-none focus:border-orange-500 transition" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <button disabled={loading} type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-3.5 rounded-xl transition disabled:opacity-50 mt-4">
              {loading ? "MEMPROSES..." : "DAFTAR SEKARANG"}
            </button>
            
            <p className="text-center text-sm text-gray-500 mt-6">
              Udah punya akun? <Link href="/login" className="text-orange-500 hover:underline font-bold">Login di sini</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}