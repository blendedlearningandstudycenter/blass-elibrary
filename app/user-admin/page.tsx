"use client"

import { useState, useEffect } from "react"
import { useBooks } from "@/hooks/useBooks"
import { useRouter } from "next/navigation"
import { ArrowBigLeft } from "lucide-react"
import Link from "next/link"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export default function UserAdminDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [form, setForm] = useState<any>({})
  const [showAdd, setShowAdd] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
        const data = userDoc.exists() ? userDoc.data() : {}
        setCurrentUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: data.type || "user"
        })
      } else {
        setCurrentUser(null)
      }
      setLoadingUser(false)
    })
    return () => unsubscribe()
  }, [])

  const { books, addBook, deleteBook, updateBook, loading, error } = useBooks(currentUser)

  if (loadingUser) return <div className="p-8">Loading...</div>
  if (!currentUser) return <div className="p-8">You must be logged in to view this page.</div>

  // Only show books added by this user
  const userBooks = books.filter((b: any) => b.addedBy === currentUser.uid)

  const handleAdd = async (e: any) => {
    e.preventDefault()
    if (!form.title || !form.author || !form.category || !form.link) return
    try {
      const payload = new FormData()
      payload.append('title', form.title)
      payload.append('author', form.author)
      payload.append('category', form.category)
      payload.append('link', form.link)
      payload.append('description', form.description || "")
      payload.append('addedBy', currentUser.uid)
      if (form.coverImage instanceof File) {
        payload.append('coverImage', form.coverImage)
      }
      await addBook(payload)
      setShowAdd(false)
      setForm({})
      router.refresh()
    } catch {}
  }

  return (
    <div className="p-8 max-w-4xl mx-auto my-20 bg-[#f8f9f4] min-h-screen rounded-xl shadow-lg border border-[#dbaf2c]">
      <Link href = "/"><ArrowBigLeft/></Link>
      <h1 className="text-4xl font-extrabold mb-8 text-[#70992f]">My Books</h1>
      <button
        onClick={() => setShowAdd(!showAdd)}
        className={`mb-6 px-6 py-2 rounded-lg font-semibold shadow transition-colors duration-200 ${showAdd ? 'bg-[#dbaf2c] text-white hover:bg-[#b98d1e]' : 'bg-[#70992f] text-white hover:bg-[#55731f]'}`}
      >
        {showAdd ? "Cancel" : "Add Book"}
      </button>
      {showAdd && (
        <form onSubmit={handleAdd} className="mb-8 bg-white p-6 rounded-lg shadow border border-[#dbaf2c] grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="p-3 border border-[#dbaf2c] rounded" placeholder="Title" required value={form.title || ""} onChange={e => setForm((f: any) => ({...f, title: e.target.value}))} />
          <input className="p-3 border border-[#dbaf2c] rounded" placeholder="Author" required value={form.author || ""} onChange={e => setForm((f: any) => ({...f, author: e.target.value}))} />
          <input className="p-3 border border-[#dbaf2c] rounded md:col-span-2" placeholder="Description" value={form.description || ""} onChange={e => setForm((f: any) => ({...f, description: e.target.value}))} />
          <input className="p-3 border border-[#dbaf2c] rounded" placeholder="Category" value={form.category || ""} onChange={e => setForm((f: any) => ({...f, category: e.target.value}))} />
          <input className="p-3 border border-[#dbaf2c] rounded" placeholder="Link" value={form.link || ""} onChange={e => setForm((f: any) => ({...f, link: e.target.value}))} />
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-[#70992f]">Cover Image</label>
            <input type="file" accept="image/*" className="w-full" onChange={e => {
              const file = e.target.files?.[0]
              setForm((f: any) => ({ ...f, coverImage: file }))
            }} />
          </div>
          <button className="md:col-span-2 bg-[#70992f] hover:bg-[#55731f] text-white px-6 py-2 rounded-lg font-semibold shadow transition-colors duration-200">Add</button>
        </form>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border border-[#dbaf2c] rounded-lg bg-white shadow">
          <thead>
            <tr className="bg-[#dbaf2c] text-white">
              <th className="p-3">Title</th>
              <th className="p-3">Author</th>
              <th className="p-3">Category</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userBooks.map((book: any, idx: number) => (
              <tr key={book._id || book.id || idx} className="border-t border-[#dbaf2c] hover:bg-[#f6f2e3] transition">
                <td className="p-3 font-medium">{book.title}</td>
                <td className="p-3">{book.author}</td>
                <td className="p-3">{book.category || '-'}</td>
                <td className="p-3">
                  <button onClick={() => deleteBook(book._id || book.id)} className="text-red-600 hover:text-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
