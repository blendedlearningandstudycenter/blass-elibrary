"use client"

import { useMemo } from "react"
import type { Book, LibraryFilters } from "@/types"

export function useBookFilters(books: Book[], filters: LibraryFilters) {
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const title = book.title ? book.title.toLowerCase() : ""
      const author = book.author ? book.author.toLowerCase() : ""
      const description = book.description ? book.description.toLowerCase() : ""
      const tags = Array.isArray(book.tags) ? book.tags : []
      const search = filters.searchQuery ? filters.searchQuery.toLowerCase() : ""
      const matchesSearch =
        title.includes(search) ||
        author.includes(search) ||
        description.includes(search) ||
        tags.some((tag) => (tag ? tag.toLowerCase().includes(search) : false))

      // Accept empty string or 'all' as 'view all' for category
      const matchesCategory = !filters.selectedCategory || filters.selectedCategory === "all" || book.category === filters.selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [books, filters.searchQuery, filters.selectedCategory])

  const stats = useMemo(
    () => ({
      totalBooks: books.length,
      filteredCount: filteredBooks.length,
      averageRating:
        books.length > 0 ? (books.reduce((acc, book) => acc + book.rating, 0) / books.length).toFixed(1) : "0.0",
    }),
    [books, filteredBooks],
  )

  return { filteredBooks, stats }
}
