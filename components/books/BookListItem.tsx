"use client"

import { motion } from "framer-motion"
import { BookOpen, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Book } from "@/types"
import { ANIMATION_VARIANTS } from "@/constants"
import Image from "next/image"

interface BookListItemProps {
  book: Book
  onBookClick?: (book: Book) => void
}

export function BookListItem({ book, onBookClick }: BookListItemProps) {
  const handleReadBook = () => {
    window.open(book.link, "_blank")
  }

  return (
    <motion.div layout {...ANIMATION_VARIANTS.fadeInLeft}>
      <Card className="hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 bg-muted rounded flex-shrink-0 flex items-center justify-center">
              <div className="w-32 h-30 flex items-center justify-center mb-2">
                            {book.coverImage ? (
                              <img
                                src={book.coverImage + '?v=' + new Date().getTime()}
                                alt={book.title}
                                className="w-full h-full object-cover rounded shadow border border-muted"
                              />
                            ) : (
                              <Image
                                src="/lib-plc.jpeg"
                                alt="placeholder"
                                width={100}
                                height={148}
                                className="w-full h-full object-cover rounded shadow border border-muted"
                                placeholder="blur"
                                blurDataURL="/lib-plc.jpeg"
                                loading="lazy"
                                quality={75}
                                draggable={false}
                                unoptimized
                              />
                            )}
                          </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="cursor-pointer" onClick={() => onBookClick?.(book)}>
                  <h3 className="font-semibold text-lg truncate hover:text-primary transition-colors">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">by {book.author}</p>
                </div>
                <Badge variant="secondary">{book.category}</Badge>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{book.description}</p>

              <div className="flex items-center justify-between">
                <Button size="sm" onClick={handleReadBook}>
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Read
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
