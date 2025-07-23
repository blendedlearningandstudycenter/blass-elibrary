"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AddBookFormData } from "@/types"
import { CATEGORIES } from "@/constants"
import { validateBookForm } from "@/utils"

interface AddBookDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddBook: (book: AddBookFormData) => Promise<void>
}

export function AddBookDialog({ open, onOpenChange, onAddBook }: AddBookDialogProps) {
  const [formData, setFormData] = useState<AddBookFormData & { coverImage?: File }>({
    title: "",
    author: "",
    description: "",
    category: "",
    link: "",
    tags: "",
    coverImage: undefined,
  })
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    const validationErrors = validateBookForm(formData)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      setIsSubmitting(true)
      // Pass coverImage as part of the payload
      await onAddBook(formData)
      setFormData({
        title: "",
        author: "",
        description: "",
        category: "",
        link: "",
        tags: "",
        coverImage: undefined,
      })
      setErrors([])
      onOpenChange(false)
    } catch (error) {
      setErrors(["Failed to add book. Please try again."])
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: keyof AddBookFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFormData((prev) => ({ ...prev, coverImage: file }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>Add a new book to the library by providing the book details and link.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {errors.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <ul className="text-sm text-destructive space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateFormData("title", e.target.value)}
              placeholder="Enter book title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => updateFormData("author", e.target.value)}
              placeholder="Enter author name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.slice(1).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="link">Book Link *</Label>
            <Input
              id="link"
              value={formData.link}
              onChange={(e) => updateFormData("link", e.target.value)}
              placeholder="https://example.com/book-link"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              placeholder="Brief description of the book"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => updateFormData("tags", e.target.value)}
              placeholder="JavaScript, Programming, Web Development"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="coverImage">Book Cover Image</Label>
            <Input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Book"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
