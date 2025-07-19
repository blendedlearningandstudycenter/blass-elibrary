"use client"

import { motion, AnimatePresence } from "framer-motion"
import { BookCard } from "./BookCard"
import { BookListItem } from "./BookListItem"
import type { Book, ViewMode } from "@/types"

interface BookGridProps {
  books: Book[]
  viewMode: ViewMode
  onBookClick?: (book: Book) => void
}

export function BookGrid({ books, viewMode, onBookClick }: BookGridProps) {
  return (
    <AnimatePresence mode="wait">
      {viewMode === "grid" ? (
        <motion.div
          key="grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {books.map((book, idx) => (
              <BookCard key={book.id || idx} book={book} onBookClick={onBookClick} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          key="list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {books.map((book, idx) => (
              <BookListItem key={book.id || idx} book={book} onBookClick={onBookClick} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
