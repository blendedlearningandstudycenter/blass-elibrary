"use client"

import { motion } from "framer-motion"
import { SearchBar } from "./SearchBar"
import { CategoryFilter } from "./CategoryFilter"
import { ViewModeToggle } from "./ViewModeToggle"
import type { LibraryFilters } from "@/types"

interface FilterControlsProps {
  filters: LibraryFilters
  onFiltersChange: (filters: Partial<LibraryFilters>) => void
  categories: string[]
}

export function FilterControls({ filters, onFiltersChange, categories }: FilterControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8"
    >
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <SearchBar value={filters.searchQuery} onChange={(searchQuery) => onFiltersChange({ searchQuery })} />

        <div className="flex items-center gap-4">
          <CategoryFilter
            value={filters.selectedCategory}
            onChange={(selectedCategory) => onFiltersChange({ selectedCategory })}
            categories={categories}
          />

          <ViewModeToggle value={filters.viewMode} onChange={(viewMode) => onFiltersChange({ viewMode })} />
        </div>
      </div>
    </motion.div>
  )
}
