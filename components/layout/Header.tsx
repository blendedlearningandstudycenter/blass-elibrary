"use client"

import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"
import LoginButton from "./AdminButton"

interface HeaderProps {
  onAddBook: () => void
}

export function Header({ onAddBook }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b sticky top-0 z-30"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">BLASS LIBRARY</h1>
              <p className="text-sm text-muted-foreground">Discover knowledge, one book at a time</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LoginButton />
          </div>
        </div>
      </div>
    </motion.header>
  )
}
