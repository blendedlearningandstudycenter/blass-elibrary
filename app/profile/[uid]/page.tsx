"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import { ArrowBigLeft } from "lucide-react"
import Loading from "@/app/loading"

export default function UserProfilePage() {
  const params = useParams()
  const uid = params?.uid as string
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!uid) return
    getDoc(doc(db, "users", uid)).then((userDoc) => {
      setProfile(userDoc.exists() ? userDoc.data() : null)
      setLoading(false)
    })
  }, [uid])

  if (loading) return <Loading funtion="Loading profile..." />
  if (!profile) return <div className="p-8">User not found.</div>

  return (
    <div className="max-w-xl mx-auto my-16 bg-white p-8 rounded-xl shadow border border-[#dbaf2c]">
      <Link href="/admin"><ArrowBigLeft className="text-primary "/></Link>
      <h1 className="text-3xl font-bold mb-6 text-[#70992f]">User Profile</h1>
      <div className="space-y-4">
        <div><span className="font-semibold">Name:</span> {profile?.name || profile?.schoolName || "-"}</div>
        <div><span className="font-semibold">Email:</span> {profile?.email || "-"}</div>
        <div><span className="font-semibold">Role:</span> {profile?.type || "-"}</div>
        <div><span className="font-semibold">Joined:</span> {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "-"}</div>
      </div>
    </div>
  )
}
