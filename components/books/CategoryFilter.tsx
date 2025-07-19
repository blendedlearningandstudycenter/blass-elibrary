"use client"

import { Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CategoryFilterProps {
  value: string
  onChange: (value: string) => void
  categories: string[]
}

export function CategoryFilter({ value, onChange, categories }: CategoryFilterProps) {
  return (
    <Select value={value === "" ? "all" : value} onValueChange={val => onChange(val === "all" ? "" : val)}>
      <SelectTrigger className="w-[180px]">
        <Filter className="h-4 w-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">View All</SelectItem>
        {categories.length === 0 ? (
          <SelectItem value="none" disabled>No categories</SelectItem>
        ) : (
          categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
