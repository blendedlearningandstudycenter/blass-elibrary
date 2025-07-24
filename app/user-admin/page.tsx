"use client"

import { useState, useEffect, useRef } from "react"
import { useBooks } from "@/hooks/useBooks"
import { useRouter } from "next/navigation"
import { ArrowBigLeft, Trash, View } from "lucide-react"
import Link from "next/link"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import Loading from "../loading"

export default function UserAdminDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [form, setForm] = useState<any>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bookFileInputRef = useRef<HTMLInputElement>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [submitting, setSubmitting] = useState(false)

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
  const [viewBook, setViewBook] = useState<any | null>(null)
  const [editForm, setEditForm] = useState<any>({})

  if (loadingUser) return <div className="p-8"><Loading funtion='loading dashboard' /></div>
  if (!currentUser) {
    useEffect(() => {
      if (typeof window !== "undefined") {
        const timeout = setTimeout(() => router.push("/login"), 2000)
        return () => clearTimeout(timeout)
      }
    }, [])
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Oops!</h1>
          <p>You must be logged in to view this page</p>
        </div>
      </div>
    )
  }

  const userBooks = books.filter((b: any) => b.addedBy === currentUser.uid)

  const handleAdd = async (e: any) => {
    e.preventDefault()
    console.log("🚀 handleAdd called")

    if (!form.title || !form.author || !form.category || !form.bookFile) {
      console.warn("❌ Missing form fields", form)
      return
    }

    setSubmitting(true)

    try {
      const payload = new FormData()
      payload.append('title', form.title)
      payload.append('author', form.author)
      payload.append('category', form.category)
      payload.append('link', form.link || "")
      payload.append('description', form.description || "")
      payload.append('addedBy', currentUser.uid)

      if (form.coverImage instanceof File) {
        payload.append('coverImage', form.coverImage)
      }

      if (form.bookFile instanceof File) {
        payload.append('bookFile', form.bookFile)
      }

      for (let pair of payload.entries()) {
        console.log('📦 ADD_BOOK_PAYLOAD', pair[0] + ':', pair[1])
      }

      const res = await addBook(payload)
      console.log("✅ Book added", res)

      setShowAdd(false)
      setForm({})
      if (fileInputRef.current) fileInputRef.current.value = ""
      if (bookFileInputRef.current) bookFileInputRef.current.value = ""
      router.refresh()
    } catch (err) {
      console.error('❌ Error adding book:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (e: any) => {
    e.preventDefault()
    if (!viewBook) return
    try {
      console.log('✏️ EDIT_BOOK_PAYLOAD', editForm)
      await updateBook(viewBook._id || viewBook.id, editForm)
      setViewBook(null)
      setEditForm({})
      router.refresh()
    } catch (err) {
      console.error('Error editing book:', err)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto my-20 bg-[#f8f9f4] min-h-screen rounded-xl shadow-lg border border-[#dbaf2c]">
      <Link href="/"><ArrowBigLeft /></Link>
      <h1 className="text-4xl font-extrabold mb-8 text-[#70992f]">My Books</h1>

      <button
        onClick={() => {
          setShowAdd(!showAdd)
          console.log("📌 Toggled showAdd:", !showAdd)
        }}
        className={`mb-6 px-6 py-2 rounded-lg font-semibold shadow transition-colors duration-200 ${showAdd ? 'bg-[#dbaf2c] text-white hover:bg-[#b98d1e]' : 'bg-[#70992f] text-white hover:bg-[#55731f]'}`}
      >
        {showAdd ? "Cancel" : "Add Book"}
      </button>

      {showAdd && (
        <form onSubmit={handleAdd} className="mb-8 bg-white p-6 rounded-lg shadow border border-[#dbaf2c] grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="p-3 border border-[#dbaf2c] rounded" placeholder="Title" required value={form.title || ""} onChange={e => setForm((f: any) => ({ ...f, title: e.target.value }))} />
          <input className="p-3 border border-[#dbaf2c] rounded" placeholder="Author" required value={form.author || ""} onChange={e => setForm((f: any) => ({ ...f, author: e.target.value }))} />
          <input className="p-3 border border-[#dbaf2c] rounded md:col-span-2" placeholder="Description" value={form.description || ""} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} />
          <input className="p-3 border border-[#dbaf2c] rounded" placeholder="Category" value={form.category || ""} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))} />
          <input className="p-3 border border-[#dbaf2c] rounded" placeholder="Link" value={form.link || ""} onChange={e => setForm((f: any) => ({ ...f, link: e.target.value }))} />
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-[#70992f]">Cover Image</label>
            <input ref={fileInputRef} type="file" accept="image/*" className="w-full" onChange={e => {
              const file = e.target.files?.[0]
              setForm((f: any) => ({ ...f, coverImage: file }))
            }} />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-[#70992f]">Book File (PDF, EPUB, etc.)</label>
            <input ref={bookFileInputRef} type="file" accept=".pdf,.epub,.doc,.docx,.txt,.mobi,.azw" className="w-full" onChange={e => {
              const file = e.target.files?.[0]
              setForm((f: any) => ({ ...f, bookFile: file }))
            }} />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="md:col-span-2 bg-[#70992f] hover:bg-[#55731f] disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold shadow transition-colors duration-200"
          >
            {submitting ? "Submitting..." : "Add"}
          </button>
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
                <td className="p-3 items-center justify-center self-center flex gap-2">
                  <button onClick={() => deleteBook(book._id || book.id)} className="text-red-600 hover:text-red-700"><Trash className="text-sm" /></button>
                  <button onClick={() => { setViewBook(book); setEditForm(book); }} className="text-blue-600 hover:text-blue-800"><View className="text-sm" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>



      {/* Modal for viewing and editing book details */}
      {viewBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative m-4">
            <button onClick={() => setViewBook(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4 text-[#70992f]">Edit Book</h2>
            <div className="mb-4 flex flex-col items-center">
              {viewBook.coverImage ? (
                <img src={viewBook.coverImage + '?v=' + new Date().getTime()} alt="Cover" className="w-40 h-56 object-cover rounded mb-2 border border-[#dbaf2c]" />
              ) : (
                <div className="w-40 h-56 bg-gray-200 flex items-center justify-center rounded mb-2 text-gray-400">No Image</div>
              )}
            </div>
            <form onSubmit={handleEdit} className="space-y-2 mb-4">
              <div>
                <label className="font-semibold block mb-1">Title:</label>
                <input className="w-full p-2 border border-[#dbaf2c] rounded" value={editForm.title || ""} onChange={e => setEditForm((f: any) => ({...f, title: e.target.value}))} />
              </div>
              <div>
                <label className="font-semibold block mb-1">Author:</label>
                <input className="w-full p-2 border border-[#dbaf2c] rounded" value={editForm.author || ""} onChange={e => setEditForm((f: any) => ({...f, author: e.target.value}))} />
              </div>
              <div>
                <label className="font-semibold block mb-1">Category:</label>
                <input className="w-full p-2 border border-[#dbaf2c] rounded" value={editForm.category || ""} onChange={e => setEditForm((f: any) => ({...f, category: e.target.value}))} />
              </div>
              <div>
                <label className="font-semibold block mb-1">Description:</label>
                <textarea className="w-full p-2 border border-[#dbaf2c] rounded" value={editForm.description || ""} onChange={e => setEditForm((f: any) => ({...f, description: e.target.value}))} />
              </div>
              <div>
                <label className="font-semibold block mb-1">Link:</label>
                <input className="w-full p-2 border border-[#dbaf2c] rounded" value={editForm.link || ""} onChange={e => setEditForm((f: any) => ({...f, link: e.target.value}))} />
              </div>
              <button type="submit" className="mt-2 bg-[#70992f] hover:bg-[#55731f] text-white px-6 py-2 rounded-lg font-semibold shadow transition-colors duration-200">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
