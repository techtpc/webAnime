export default function Pagination() {
  const pages = [1, 2, 3, 4, 5, "...", 10];

  return (
    <div className="mt-12 mb-8 flex flex-col items-center justify-center space-y-4">
      <div className="flex items-center space-x-2">
        <button className="flex items-center space-x-1 rounded bg-[#222222] px-4 py-2 text-sm font-medium text-gray-400 hover:bg-[#2a2a2a] hover:text-white transition">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
          </svg>
          <span>Previous</span>
        </button>

        {pages.map((page, idx) => {
          const isCurrent = page === 1;
          const isEllipsis = page === "...";

          if (isEllipsis) {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
                {page}
              </span>
            );
          }

          return (
            <button
              key={page}
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

        <button className="flex items-center space-x-1 rounded bg-[#222222] px-4 py-2 text-sm font-medium text-gray-400 hover:bg-[#2a2a2a] hover:text-white transition">
          <span>Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <p className="text-xs text-gray-500 tracking-wide font-medium uppercase">
        Page 1 of 10 • 80 Experiences Found
      </p>
    </div>
  );
}
