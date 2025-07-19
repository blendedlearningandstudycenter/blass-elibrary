export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function generateBookId(): string {
  return `book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function validateBookForm(data: any): string[] {
  const errors: string[] = []

  if (!data.title?.trim()) errors.push("Title is required")
  if (!data.author?.trim()) errors.push("Author is required")
  if (!data.link?.trim()) errors.push("Book link is required")
  if (!data.category?.trim()) errors.push("Category is required")

  if (data.link && !isValidUrl(data.link)) {
    errors.push("Please enter a valid URL")
  }

  return errors
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}
