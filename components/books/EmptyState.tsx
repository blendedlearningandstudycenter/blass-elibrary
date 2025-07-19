"use client"

import { motion } from "framer-motion"
import { BookOpen, Plus } from "lucide-react"

interface EmptyStateProps {
  onAddBook: () => void
}

export function EmptyState({ onAddBook }: EmptyStateProps) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
      <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">No books found</h3>
      <p className="text-muted-foreground mb-4">Try adjusting your search criteria or add a new book to get started.</p>
      
    </motion.div>
  )
}
