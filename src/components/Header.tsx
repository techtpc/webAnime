import { filterTabs } from "@/lib/data";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between bg-[#0f0f0f]/90 px-6 backdrop-blur-md">
      {/* Search Bar Group */}
      <div className="flex flex-1 items-center max-w-2xl ml-60">
        <div className="flex bg-transparent">
           {filterTabs.map((tab, idx) => (
             <button
               key={idx}
               className={`mr-6 pb-2 text-sm font-medium border-b-2 transition-colors ${
                 idx === 0
                   ? "border-orange-500 text-orange-500"
                   : "border-transparent text-gray-400 hover:text-white"
               }`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>
      
      <div className="flex-1 flex max-w-xl justify-center ml-10">
         <div className="flex w-full items-center rounded-full bg-[#222222] px-4 py-2 border border-[#333333] focus-within:border-[#555555]">
           <input
             type="text"
             placeholder="Search cinematic experiences..."
             className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none"
           />
           <button className="ml-2 text-gray-500 hover:text-white">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
               <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
             </svg>
           </button>
         </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-6">
        <button className="text-gray-400 hover:text-white relative">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-orange-500 border border-[#0f0f0f]"></span>
        </button>
        <button className="flex items-center space-x-2 rounded-full border border-[#333333] bg-[#222222] px-3 py-1.5 hover:bg-[#2a2a2a] transition">
          <span className="text-sm font-medium text-gray-300">GUEST</span>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-black">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
            </svg>
          </div>
        </button>
      </div>
    </header>
  );
}
