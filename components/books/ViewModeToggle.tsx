"use client"

import { Grid, List } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ViewMode } from "@/types"

interface ViewModeToggleProps {
  value: ViewMode
  onChange: (value: ViewMode) => void
}

export function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  return (
    <Tabs value={value} onValueChange={(value) => onChange(value as ViewMode)}>
      <TabsList>
        <TabsTrigger value="grid">
          <Grid className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger value="list">
          <List className="h-4 w-4" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
