import Header from "@/components/Header";
import { History } from "lucide-react";

export default function HistoryPage() {
  return (
    <>
      <Header />
      <div className="flex-1 px-8 pt-6 flex flex-col items-center justify-center min-h-[70vh]">
        <History className="w-24 h-24 text-gray-600 mb-6" />
        <h2 className="text-3xl font-bold text-white mb-2">Riwayat Pemutaran</h2>
        <p className="text-gray-400 max-w-md text-center">
          Anda belum memutar video apapun baru-baru ini. Fitur ini masih dalam tahap pengembangan.
        </p>
      </div>
    </>
  );
}
