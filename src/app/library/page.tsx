import Header from "@/components/Header";
import { Library } from "lucide-react";

export default function LibraryPage() {
  return (
    <>
      <Header />
      <div className="flex-1 px-8 pt-6 flex flex-col items-center justify-center min-h-[70vh]">
        <Library className="w-24 h-24 text-gray-600 mb-6" />
        <h2 className="text-3xl font-bold text-white mb-2">Libary Anda</h2>
        <p className="text-gray-400 max-w-md text-center">
          Simpan daftar video favorit Anda di sini. Fitur ini masih dalam tahap pengembangan.
        </p>
      </div>
    </>
  );
}
