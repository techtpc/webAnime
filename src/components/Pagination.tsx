"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, totalItems, onPageChange }: PaginationProps) {
  // Kalau datanya kosong atau cuma 1 halaman, mending sembunyiin aja
  if (totalPages <= 1) return null;

  // LOGIKA MATEMATIKA BUAT NGITUNG TITIK-TITIK (...)
  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const pages = getPages();

  return (
    <div className="mt-12 mb-8 flex flex-col items-center justify-center space-y-4">
      <div className="flex items-center space-x-2">
        {/* TOMBOL PREVIOUS */}
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center space-x-1 rounded bg-[#222222] px-4 py-2 text-sm font-medium text-gray-400 hover:bg-[#2a2a2a] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
          </svg>
          <span>Previous</span>
        </button>

        {/* DERETAN ANGKA HALAMAN */}
        {pages.map((page, idx) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
                ...
              </span>
            );
          }

          const isCurrent = page === currentPage;
          return (
            <button
              key={idx}
              onClick={() => onPageChange(page as number)}
              className={`flex h-9 w-9 items-center justify-center rounded text-sm font-medium transition ${
                isCurrent
                  ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20"
                  : "bg-[#222222] text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* TOMBOL NEXT */}
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center space-x-1 rounded bg-[#222222] px-4 py-2 text-sm font-medium text-gray-400 hover:bg-[#2a2a2a] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <p className="text-xs text-gray-500 tracking-wide font-medium uppercase">
        Page {currentPage} of {totalPages} • {totalItems} Experiences Found
      </p>
    </div>
  );
}