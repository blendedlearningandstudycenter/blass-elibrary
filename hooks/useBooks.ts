"use client"

import { useState, useEffect } from "react"
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db, storage } from "@/lib/firebase"
import type { Book, AddBookFormData } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export function useBooks(currentUser?: { uid: string, email: string, role: string }) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch books from Firestore
  const fetchBooks = async () => {
    try {
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, "books"))
      let booksData: Book[] = []
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data()
        booksData.push({
          id: docSnap.id,
          ...data,
          tags: Array.isArray(data.tags) ? data.tags : (data.tags ? data.tags.split(",").map((t: string) => t.trim()) : []),
          bookFileUrl: data.bookFileUrl || ""
        } as Book)
      })
      // Filter by role
      if (currentUser && currentUser.role !== "admin") {
        booksData = booksData.filter(
          (b) => b.addedBy === currentUser.uid || b.addedBy === currentUser.email
        )
      }
      setBooks(booksData)
    } catch (err) {
      setError("Failed to fetch books")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  // Add book to Firestore
  const addBook = async (bookData: AddBookFormData | FormData): Promise<void> => {
    try {
      let formData: FormData
      if (bookData instanceof FormData) {
        formData = bookData
      } else {
        formData = new FormData();
        Object.entries(bookData).forEach(([key, value]) => {
          if (key === "coverImage" && value) {
            formData.append("coverImage", value as any)
          } else if (key === "tags") {
            // skip tags
          } else if (typeof value === "string" || typeof value === "number") {
            formData.append(key, value.toString());
          }
        });
      }

      let coverImageUrl = ""
      let bookFileUrl = ""
      const coverImageFile = formData.get("coverImage") as File | null
      if (coverImageFile && coverImageFile.size > 0) {
        const storageRef = ref(storage, `book-covers/${Date.now()}-${coverImageFile.name}`)
        await uploadBytes(storageRef, coverImageFile)
        coverImageUrl = await getDownloadURL(storageRef)
      }
      const bookFile = formData.get("bookFile") as File | null
      if (bookFile && bookFile.size > 0) {
        const fileRef = ref(storage, `book-files/${Date.now()}-${bookFile.name}`)
        await uploadBytes(fileRef, bookFile)
        bookFileUrl = await getDownloadURL(fileRef)
      }
      const payload = {
        title: formData.get("title") as string,
        author: formData.get("author") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        tags: formData.get("tags") ? (formData.get("tags") as string).split(",").map((t) => t.trim()) : [],
        addedDate: new Date().toISOString(),
        rating: 0,
        coverImage: coverImageUrl,
        bookFileUrl,
        addedBy: formData.get("addedBy") || "", // ensure addedBy is set from FormData
      }
      await addDoc(collection(db, "books"), payload)
      await fetchBooks()
      toast({ title: "Book added!", description: `"${payload.title}" was added successfully.` })
    } catch (err: any) {
      let message = err.message || "Failed to add book"
      toast({ title: "Error", description: message, variant: "destructive" })
      throw new Error(message)
    }
  }

  // Delete book from Firestore
  const deleteBook = async (bookId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, "books", bookId))
      await fetchBooks()
      toast({ title: "Book deleted!", description: "Book was deleted successfully." })
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete book", variant: "destructive" })
    }
  }

  // Update book in Firestore
  const updateBook = async (bookId: string, updates: Partial<Book>): Promise<void> => {
    try {
      // If updates contain a File for coverImage or bookFile, upload and update URLs
      let updatePayload = { ...updates }
      if (updates.coverImage instanceof File) {
        const storageRef = ref(storage, `book-covers/${Date.now()}-${updates.coverImage.name}`)
        await uploadBytes(storageRef, updates.coverImage)
        updatePayload.coverImage = await getDownloadURL(storageRef)
      }
      if (updates.bookFile instanceof File) {
        const fileRef = ref(storage, `book-files/${Date.now()}-${updates.bookFile.name}`)
        await uploadBytes(fileRef, updates.bookFile)
        updatePayload.bookFileUrl = await getDownloadURL(fileRef)
        delete updatePayload.bookFile // Remove raw file from payload
      }
      await updateDoc(doc(db, "books", bookId), updatePayload)
      await fetchBooks()
      toast({ title: "Book updated!", description: `Book was updated successfully.` })
    } catch (err) {
      toast({ title: "Error", description: "Failed to update book", variant: "destructive" })
      throw new Error("Failed to update book")
    }
  }

  return {
    books,
    loading,
    error,
    addBook,
    deleteBook,
    updateBook,
  }
}
