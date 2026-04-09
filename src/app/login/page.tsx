"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // FUNGSI LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/"); // Kalau sukses, lempar ke Homepage
      router.refresh();
    }
  };

  // FUNGSI REGISTER
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      alert("Cek email lu buat verifikasi (kalau email confirm nyala), atau langsung login aja.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Header />
      <div className="flex justify-center items-center h-[80vh]">
        <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl border border-[#333] shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-8 text-orange-500">Akses Masuk</h1>
          
          <form className="space-y-6">
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-2">EMAIL</label>
              <input 
                type="email" 
                className="w-full bg-[#222] border border-[#333] p-3 rounded-lg outline-none focus:border-orange-500 transition"
                value={email} onChange={e => setEmail(e.target.value)} required 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-2">PASSWORD</label>
              <input 
                type="password" 
                className="w-full bg-[#222] border border-[#333] p-3 rounded-lg outline-none focus:border-orange-500 transition"
                value={password} onChange={e => setPassword(e.target.value)} required 
              />
            </div>

            {error && <p className="text-red-400 text-sm font-bold text-center bg-red-500/10 p-3 rounded">{error}</p>}

            <div className="flex gap-4 pt-2">
              <button 
                onClick={handleLogin} disabled={loading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 rounded-xl transition disabled:opacity-50"
              >
                {loading ? "Loading..." : "LOGIN"}
              </button>
              <button 
                onClick={handleRegister} disabled={loading}
                className="flex-1 bg-[#222] border border-[#444] hover:bg-[#333] text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
              >
                REGISTER
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}