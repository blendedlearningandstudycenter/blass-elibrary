"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function LoginButton() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
    })
    return () => unsubscribe()
  }, [])

  // Hide on login/admin pages
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) return null

  // Prevent hydration mismatch
  if (!mounted) return null

  if (user) {
    return (
      <>
        <Link href="/user-admin">
          <span className="ml-4 px-2 py-0.5 border-b border-primary text-primary transition-transform duration-150 hover:-translate-y-0.5 hover:border-b-2">
            Dashboard
          </span>
        </Link>
        <Link href="/profile">
          <span className="ml-4 px-2 py-0.5 border-b border-primary text-primary transition-transform duration-150 hover:-translate-y-0.5 hover:border-b-2">
            Profile
          </span>
        </Link>
      </>
    )
  }

  return (
    <Link href="/login">
      <span className="ml-4 px-2 py-0.5 border-b border-primary text-primary transition-transform duration-150 hover:-translate-y-0.5 hover:border-b-2">
        Login
      </span>
    </Link>
  )
}
