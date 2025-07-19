"use client"

import Link from "next/link"

export function Sidebar() {
  return (
    <aside className="h-full w-64 bg-[#f8f9f4] border-l border-[#dbaf2c] flex flex-col p-6 fixed right-0 top-0 bottom-0 z-40">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#70992f] mb-4">Quick Links</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.nationallibrary.gov" target="_blank" rel="noopener noreferrer" className="text-[#70992f] hover:underline">National Library</a>
          </li>
          <li>
            <a href="https://openlibrary.org" target="_blank" rel="noopener noreferrer" className="text-[#70992f] hover:underline">Open Library</a>
          </li>
          <li>
            <a href="https://www.wdl.org" target="_blank" rel="noopener noreferrer" className="text-[#70992f] hover:underline">World Digital Library</a>
          </li>
        </ul>
      </div>
      <div className="mt-auto">
        <h2 className="text-xl font-bold text-[#70992f] mb-4">Register to Upload Books</h2>
        <div className="flex flex-col gap-2">
          <Link href="/register/individual" className="bg-[#70992f] text-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-[#55731f] transition">Register as Individual</Link>
          <Link href="/register/school" className="bg-[#dbaf2c] text-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-[#b98d1e] transition">Register as School</Link>
        </div>
      </div>
    </aside>
  )
}
