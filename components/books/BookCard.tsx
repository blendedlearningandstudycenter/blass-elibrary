"use client"

import { motion } from "framer-motion"
import { ExternalLink, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Book } from "@/types"
import { ANIMATION_VARIANTS } from "@/constants"
import Image from "next/image"

interface BookCardProps {
  book: Book
  onBookClick?: (book: Book) => void
}

export function BookCard({ book, onBookClick }: BookCardProps) {
  const handleReadBook = () => {
    window.open(book.link, "_blank")
  }

  return (
    <motion.div layout {...ANIMATION_VARIANTS.fadeInUp} {...ANIMATION_VARIANTS.hover}>
      <Card className="h-full hover:shadow-xl transition-shadow duration-300 group cursor-pointer bg-white rounded-2xl border-2 border-[#d2c397]">
        <CardHeader className="pb-3" onClick={() => onBookClick?.(book)}>
          <div className="flex flex-col items-center gap-2">
            <div className="w-[140px] h-[198px] flex items-center justify-center mb-2">
              {book.coverImage ? (
              <img
                src={book.coverImage + '?v=' + new Date().getTime()}
                alt={book.title}
                className="w-[140px] h-[198px] object-cover rounded shadow border border-muted"
                style={{ width: "140px", height: "198px" }}
              />
              ) : (
              <Image
                src="/lib-plc.jpeg"
                alt="placeholder"
                width={140}
                height={198}
                className="w-[140px] h-[198px] object-cover rounded shadow border border-muted"
                placeholder="blur"
                blurDataURL="/lib-plc.jpeg"
                loading="lazy"
                quality={75}
                draggable={false}
                unoptimized
                style={{ width: "140px", height: "198px" }}
              />
              )}
            </div>
            <Badge variant="secondary" className="mb-2 px-3 py-1 text-xs font-semibold tracking-wide">
              {book.category}
            </Badge>
            <CardTitle className="text-xl font-bold text-center capitalize text-[#70992f] line-clamp-2 group-hover:text-[#dbaf2c] transition-colors">
              {book.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 justify-center mt-1 text-sm text-gray-600">
              <User className="h-4 w-4" />
              {book.author}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-0 flex flex-col items-center">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 text-center max-w-xs">{book.description}</p>

          <Button className="w-full bg-[#70992f] hover:bg-[#55731f] text-white font-semibold rounded-lg mt-2" onClick={handleReadBook}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Read Book
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
