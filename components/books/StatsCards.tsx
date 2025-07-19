"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { CATEGORIES } from "@/constants"

interface StatsCardsProps {
  totalBooks: number
  filteredCount: number
  averageRating: string
}

export function StatsCards({ totalBooks, filteredCount, averageRating }: StatsCardsProps) {
  const stats = [
    { label: "Total Books", value: totalBooks },
    { label: "Categories", value: CATEGORIES.length - 1 },
    { label: "Search Results", value: filteredCount },
    { label: "Avg Rating", value: averageRating },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}
