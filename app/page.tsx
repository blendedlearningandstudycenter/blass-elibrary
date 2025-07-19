"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/Header"
import { FilterControls } from "@/components/books/FilterControls"
//import { StatsCards } from "@/components/books/StatsCards"
import { BookGrid } from "@/components/books/BookGrid"
import { EmptyState } from "@/components/books/EmptyState"
import { AddBookDialog } from "@/components/books/AddBookDialog"
import { useBooks } from "@/hooks/useBooks"
import { useBookFilters } from "@/hooks/useBookFilters"
import type { LibraryFilters, Book } from "@/types"
import { INITIAL_FILTERS } from "@/constants"
import { Sidebar, SidebarMobile } from "@/components/layout/Sidebar"

export default function ELibrary() {
  const { books, loading, error, addBook } = useBooks()
  const [filters, setFilters] = useState<LibraryFilters>(INITIAL_FILTERS)
  const [isAddBookOpen, setIsAddBookOpen] = useState(false)
  const { filteredBooks, stats } = useBookFilters(books, filters)

  // Compute unique categories from books
  const categories = Array.from(new Set(books.map((b) => b.category).filter(Boolean)))

  const handleFiltersChange = (newFilters: Partial<LibraryFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const handleBookClick = (book: Book) => {
    // Handle book click - could open a detailed view modal
    console.log("Book clicked:", book)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your library...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Desktop/Tablet View */}
      <div className="hidden md:flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex-1 mr-64">
        <Header onAddBook={() => setIsAddBookOpen(true)} />
        <div className="container mx-auto px-4 py-8">
        <FilterControls filters={filters} onFiltersChange={handleFiltersChange} categories={categories} />

        {/* <StatsCards
        totalBooks={stats.totalBooks}
        filteredCount={stats.filteredCount}
        averageRating={stats.averageRating}
        /> */}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          {error ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="text-primary hover:underline">
              Try again
            </button>
            </div>
          </div>
          ) : filteredBooks.length === 0 ? (
          <EmptyState onAddBook={() => setIsAddBookOpen(true)} />
          ) : (
          <BookGrid books={filteredBooks} viewMode={filters.viewMode} onBookClick={handleBookClick} />
          )}
        </motion.div>
        </div>

        {/* <AddBookDialog open={isAddBookOpen} onOpenChange={setIsAddBookOpen} onAddBook={addBook} /> */}
      </div>
      <Sidebar />
      </div>

      {/* Mobile View */}
      <div className="flex flex-col md:hidden min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header onAddBook={() => setIsAddBookOpen(true)} />
      <div className="container mx-auto px-2 py-4">
        <FilterControls filters={filters} onFiltersChange={handleFiltersChange} categories={categories} />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        {error ? (
          <div className="min-h-[200px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="text-primary hover:underline">
            Try again
            </button>
          </div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <EmptyState onAddBook={() => setIsAddBookOpen(true)} />
        ) : (
          <BookGrid books={filteredBooks} viewMode="list" onBookClick={handleBookClick} />
        )}
        </motion.div>
      </div>
     <SidebarMobile />
      </div>
    </>
  )
}
