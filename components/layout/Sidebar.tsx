"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export function Sidebar() {
  const [logged, setLogged] = useState<string | null>(null);
  const [admin, setAdmin] = useState<string | null>(null);

  // Safe localStorage access
  useEffect(() => {
    if (typeof window !== "undefined") {
      setLogged(localStorage.getItem('userlogged'));
      setAdmin(localStorage.getItem('isAdmin'));
    }
  }, []);

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
        <h2 className="text-xl font-bold text-[#70992f] mb-4"> {logged? "Register to Upload Books": "" }</h2>
        <div className="flex flex-col gap-2">
          {!logged ? (
            <>
              <Link href={!admin ? "/user-admin" : "/admin"} className="bg-[#70992f] text-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-[#55731f] transition">Dashboard</Link>
              <Link href="/profile" className="bg-[#dbaf2c] text-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-[#b98d1e] transition">Profile</Link>
            </>
          ) : (
            <>
              <Link href="/register/individual" className="bg-[#dbaf2c] text-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-[#b98d1e] transition">Register as Individual</Link>
              <Link href="/register/school" className="bg-[#dbaf2c] text-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-[#b98d1e] transition">Register as School</Link>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}


export function SidebarMobile(){
  const [isOpen, setIsOpen] = useState(false)
    const [logged, setLogged] = useState<string | null>(null);
  const [admin, setAdmin] = useState<string | null>(null);

  // Safe localStorage access
  useEffect(() => {
    if (typeof window !== "undefined") {
      setLogged(localStorage.getItem('userlogged'));
      setAdmin(localStorage.getItem('isAdmin'));
    }
  }, []);

  return (
    <>
      {/* Hamburger button */}
      <button
        className="fixed top-4 right-4 z-50 md:hidden p-2 bg-[#70992f] text-white rounded-md"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={20} className="z-50" /> : <Menu size={18} className="z-50" />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-0 bottom-0 right-0 z-40 h-full w-64 bg-[#f8f9f4] border-l border-[#dbaf2c] flex flex-col p-6 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        md:translate-x-0 md:static md:flex`}
      >
        <div className="mb-8 mt-3 z-10">
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
          {!logged ? (
            <>
              <Link href={!admin ? "/user-admin" : "/admin"} className="bg-[#70992f] text-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-[#55731f] transition">Dashboard</Link>
              <Link href="/profile" className="bg-[#dbaf2c] text-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-[#b98d1e] transition">Profile</Link>
            </>
          ) : (
            <>
              <Link href="/register/individual" className="bg-[#dbaf2c] text-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-[#b98d1e] transition">Register as Individual</Link>
              <Link href="/register/school" className="bg-[#dbaf2c] text-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-[#b98d1e] transition">Register as School</Link>
            </>
          )}
        </div>
        </div>
      </aside>

      {/* Optional: Overlay when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
