"use client"

import { useBooks } from "@/hooks/useBooks"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowBigLeft, DeleteIcon, Edit, SaveIcon, Trash, View, X} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function AdminDashboard() {
  const { books, addBook, deleteBook, updateBook, loading, error } = useBooks()
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<any>({})
  const bookFileInputRef = useRef<HTMLInputElement>(null)
  const [viewBook, setViewBook] = useState<any | null>(null)
  const [uploaderMap, setUploaderMap] = useState<Record<string, { name?: string; email?: string }>>({})
  const [submitting, setSubmitting] = useState(false);
  
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Fetch uploader info for all unique uploader IDs
  useEffect(() => {
    async function fetchUploaders() {
      if (!books || books.length === 0) return;
      const uniqueUploaderIds = Array.from(new Set(books.map((b: any) => b.addedBy).filter(Boolean)));
      const newMap: Record<string, { name?: string; email?: string }> = {};
      await Promise.all(
        uniqueUploaderIds.map(async (uid) => {
          try {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              newMap[uid] = { name: data.schoolName || data.name, email: data.email };
            } else {
              newMap[uid] = { email: uid };
            }
          } catch {
            newMap[uid] = { email: uid };
          }
        })
      );
      setUploaderMap(newMap);
    }
    fetchUploaders();
  }, [books]);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("isAdmin") !== "true") {
      router.replace("/admin/login")
    }
  }, [router])

  if (loading) return (
     
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin portal </p>
        </div>
      </div>
    )


  if (error) return <div className="p-8 text-red-500">{error}</div>

  const handleAdd = async (e: any) => {
    e.preventDefault()
    // Frontend validation for required fields
    if (!form.title || !form.author || !form.category || !form.bookFile) {
      toast({
        title: "Missing Fields",
        description: "Title, Author, Category, and Link are required.",
        variant: "destructive",
        duration: 3000,
      })
      alert("Title, Author, Category, and Link are required.")
      return
    }
      setSubmitting(true); // ✅ Start submitting
    try {
      const payload = new FormData()
      payload.append('title', form.title || '')
      payload.append('author', form.author || '')
      payload.append('category', form.category || '')
      payload.append('link', form.link || '')
      payload.append('description', form.description || '')
      if (form.coverImage instanceof File) {
        payload.append('coverImage', form.coverImage)
      }
      if (form.bookFile instanceof File) {
        payload.append('bookFile', form.bookFile)
      }
      // Debug: log FormData
      for (let pair of payload.entries()) {
        console.log(pair[0]+ ':', pair[1])
      }
      await addBook(payload)
      setShowAdd(false)
      setForm({})
      if (fileInputRef.current) fileInputRef.current.value = ""
      if (bookFileInputRef.current) bookFileInputRef.current.value = ""
      router.refresh()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to add book.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleEdit = async (e: any) => {
    e.preventDefault()
    if (editId) {
      try {
        await updateBook(editId, form)
        setEditId(null)
        setForm({})
      } catch (err: any) {
        // Optionally, you can show a toast here as well if not handled in useBooks
        // toast({ title: "Error", description: err.message, variant: "destructive" })
      }
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto my-20 bg-[#f8f9f4] min-h-screen rounded-xl shadow-lg border border-[#dbaf2c]">
      <h1 className="text-4xl font-extrabold mb-8 text-[#70992f] flex items-center gap-2">
        <Link href = "/"><ArrowBigLeft/></Link>
        <svg width="32" height="32" fill="#70992f" viewBox="0 0 24 24"><path d="M19 2H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H8V4h11v16zM6 6H4v16c0 1.1.9 2 2 2h12v-2H6V6z"/></svg>
        Admin Dashboard
      </h1>
      <button
        onClick={() => setShowAdd(!showAdd)}
        className={`mb-6 px-6 py-2 rounded-lg font-semibold shadow transition-colors duration-200 ${showAdd ? 'bg-[#dbaf2c] text-white hover:bg-[#b98d1e]' : 'bg-[#70992f] text-white hover:bg-[#55731f]'}`}
      >
        {showAdd ? "Cancel" : "Add Book"}
      </button>
      {showAdd && (
        <form onSubmit={handleAdd} className="mb-8 bg-white p-6 rounded-lg shadow border border-[#dbaf2c] grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="p-3 border border-[#dbaf2c] rounded focus:outline-none focus:ring-2 focus:ring-[#70992f]" placeholder="Title" required value={form.title || ""} onChange={e => setForm((f: any) => ({...f, title: e.target.value}))} />
          <input className="p-3 border border-[#dbaf2c] rounded focus:outline-none focus:ring-2 focus:ring-[#70992f]" placeholder="Author" required value={form.author || ""} onChange={e => setForm((f: any) => ({...f, author: e.target.value}))} />
          <input className="p-3 border border-[#dbaf2c] rounded focus:outline-none focus:ring-2 focus:ring-[#70992f] md:col-span-2" placeholder="Description" value={form.description || ""} onChange={e => setForm((f: any) => ({...f, description: e.target.value}))} />
          <input className="p-3 border border-[#dbaf2c] rounded focus:outline-none focus:ring-2 focus:ring-[#70992f]" placeholder="Category" value={form.category || ""} onChange={e => setForm((f: any) => ({...f, category: e.target.value}))} />
          <input className="p-3 border border-[#dbaf2c] rounded focus:outline-none focus:ring-2 focus:ring-[#70992f]" placeholder="Link" value={form.link || ""} onChange={e => setForm((f: any) => ({...f, link: e.target.value}))} />
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
         <button  type="submit" disabled={submitting} className="md:col-span-2 bg-[#70992f] hover:bg-[#55731f] text-white px-6 py-2 rounded-lg font-semibold shadow transition-colors duration-200">{submitting ? "Submitting..." : "Add"}</button>
        </form>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border border-[#dbaf2c] rounded-lg bg-white shadow">
          <thead>
            <tr className="bg-[#dbaf2c] text-white">
              <th className="p-3">Title</th>
              <th className="p-3">Author</th>
              <th className="p-3">Category</th>
              <th className="p-3">Date Added</th>
              <th className="p-3">Uploader</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book: any, idx: number) => (
              <tr key={book._id || book.id || idx} className="border-t border-[#dbaf2c] hover:bg-[#f6f2e3] transition">
                <td className="p-3 font-medium">{editId === (book._id || book.id) ? <input defaultValue={book.title} onChange={e => setForm((f: any) => ({...f, title: e.target.value}))} className="p-2 border border-[#dbaf2c] rounded" /> : book.title}</td>
                <td className="p-3">{editId === (book._id || book.id) ? <input defaultValue={book.author} onChange={e => setForm((f: any) => ({...f, author: e.target.value}))} className="p-2 border border-[#dbaf2c] rounded" /> : book.author}</td>
                <td className="p-3">{book.category || '-'}</td>
                <td className="p-3">{book.addedDate ? new Date(book.addedDate).toLocaleDateString() : '-'}</td>
                <td className="p-3">
                  {book.addedBy ? (
                    <Link href={`/profile/${book.addedBy}`} className="text-blue-600 underline hover:text-blue-800">
                      {uploaderMap[book.addedBy]?.name || uploaderMap[book.addedBy]?.email || book.addedBy}
                    </Link>
                  ) : '-'}
                </td>
                <td className="p-3 flex flex-wrap ">
                  {editId === (book._id || book.id) ? (
                    <>
                      <button type="button" onClick={handleEdit} className="flex items-center  text-primary px-3 py-1 rounded-lg font-semibold hover:bg-[#e0ebca] transition">
                        <SaveIcon className="w-5 h-5 mr-1" />
                        
                      </button>
                      <button type="button" onClick={() => { setEditId(null); setForm({}) }} className="flex items-center  text-red-700 px-3 py-1 rounded-lg font-semibold  transition">
                        <X className="w-5 h-5 mr-1" />
                        
                      </button>
                    </>
                  ) : (
                    <>
                     
                      <button type="button" onClick={() => deleteBook(book._id || book.id)} className="flex items-center text-red-600 px-3 py-1 rounded-lg font-semibold hover:text-red-700 transition">
                        <Trash className="w-5 h-5 mr-1" />
                        
                      </button>
                      <button type="button" onClick={() => setViewBook(book)} className="flex items-center text-gray-400 px-3 py-1 rounded-lg font-semibold hover:text-black transition">
                        <View className="w-5 h-5 mr-1" />
                        
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal for viewing book details */}
      {viewBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative m-4">
            <button onClick={() => setViewBook(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4 text-[#70992f]">Book Details</h2>
            <div className="mb-4 flex flex-col items-center">
              {viewBook.coverImage ? (
                viewBook.coverImage instanceof File ? (
                  <img src={URL.createObjectURL(viewBook.coverImage)} alt="Cover" className="w-40 h-56 object-cover rounded mb-2 border border-[#dbaf2c]" />
                ) : typeof viewBook.coverImage === 'string' && (viewBook.coverImage.startsWith('http') || viewBook.coverImage.startsWith('data:')) ? (
                  <img src={viewBook.coverImage} alt="Cover" className="w-40 h-56 object-cover rounded mb-2 border border-[#dbaf2c]" />
                ) : (
                  <div className="w-40 h-56 bg-gray-200 flex items-center justify-center rounded mb-2 text-gray-400">No Image</div>
                )
              ) : (
                <div className="w-40 h-56 bg-gray-200 flex items-center justify-center rounded mb-2 text-gray-400">No Image</div>
              )}
            </div>
            {/* Edit Book Form inside Modal */}
            
            <div className="space-y-2">
              <div><span className="font-semibold">Title:</span> {viewBook.title}</div>
              <div><span className="font-semibold">Author:</span> {viewBook.author}</div>
              <div><span className="font-semibold">Category:</span> {viewBook.category || '-'}</div>
              <div><span className="font-semibold">Description:</span> {viewBook.description || '-'}</div>
              <div><span className="font-semibold">Link:</span> <a href={viewBook.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{viewBook.link}</a></div>
              <div><span className="font-semibold">Date Added:</span> {viewBook.addedDate ? new Date(viewBook.addedDate).toLocaleString() : '-'}</div>
              <div><span className="font-semibold">ID:</span> {viewBook.id || '-'}</div>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await updateBook(viewBook._id || viewBook.id, form)
                setEditId(null)
                setForm({})
                setViewBook(null)
                toast({ title: "Book updated!", description: "Book was updated successfully." })
                router.refresh()
              } catch (err: any) {
                toast({ title: "Error", description: err?.message || "Failed to update book.", variant: "destructive", duration: 3000 })
              }
            }} className="space-y-2 mb-4">
              <div>
                <label className="font-semibold block mb-1">Title:</label>
                <input className="w-full p-2 border border-[#dbaf2c] rounded" defaultValue={viewBook.title} onChange={e => setForm((f: any) => ({...f, title: e.target.value}))} />
              </div>
              <div>
                <label className="font-semibold block mb-1">Author:</label>
                <input className="w-full p-2 border border-[#dbaf2c] rounded" defaultValue={viewBook.author} onChange={e => setForm((f: any) => ({...f, author: e.target.value}))} />
              </div>
              <div>
                <label className="font-semibold block mb-1">Category:</label>
                <input className="w-full p-2 border border-[#dbaf2c] rounded" defaultValue={viewBook.category} onChange={e => setForm((f: any) => ({...f, category: e.target.value}))} />
              </div>
              <div>
                <label className="font-semibold block mb-1">Description:</label>
                <textarea className="w-full p-2 border border-[#dbaf2c] rounded" defaultValue={viewBook.description} onChange={e => setForm((f: any) => ({...f, description: e.target.value}))} />
              </div>
              <div>
                <label className="font-semibold block mb-1">Link:</label>
                <input className="w-full p-2 border border-[#dbaf2c] rounded" defaultValue={viewBook.link} onChange={e => setForm((f: any) => ({...f, link: e.target.value}))} />
              </div>
              <button type="submit" className="mt-2 bg-[#70992f] hover:bg-[#55731f] text-white px-6 py-2 rounded-lg font-semibold shadow transition-colors duration-200">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
