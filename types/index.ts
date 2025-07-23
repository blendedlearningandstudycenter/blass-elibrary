import { FirebaseStorage } from "firebase/storage"

export interface Book {
  filePath(storage: FirebaseStorage, filePath: any): unknown
/*   filePath: any
 */  id: string
  title: string
  author: string
  description: string
  category: string
  link: string
  coverImage: string
  bookFileUrl?: string
  addedBy: string
  addedDate: string
  rating: number
  tags: string[]
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
}

export interface AddBookFormData {
  title: string
  author: string
  description: string
  category: string
  link: string
  tags: string
}

export type ViewMode = "grid" | "list"

export interface LibraryFilters {
  searchQuery: string
  selectedCategory: string
  viewMode: ViewMode
}
