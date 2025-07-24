"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowBigLeft } from "lucide-react"
import Loading from "@/app/loading"
import { signOut } from "firebase/auth"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState<any>({})
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[ProfilePage] onAuthStateChanged:', firebaseUser);
      setUser(firebaseUser)
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
        const data = userDoc.exists() ? userDoc.data() : null
        console.log('[ProfilePage] Firestore userDoc:', data);
        setProfile(data)
        setForm({
          name: data?.name || data?.schoolName || "",
          type: data?.type || "user",
        })
      } else {
        setProfile(null)
        setForm({})
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleSave = async (e: any) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: form.name,
        type: form.type,
      })
      setProfile((prev: any) => ({ ...prev, name: form.name, type: form.type }))
      setEditMode(false)
    } catch (err) {
      // handle error
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    localStorage.getItem("isAdmin") && localStorage.removeItem("isAdmin")
    localStorage.getItem("userEmail") && localStorage.removeItem("userEmail")
    localStorage.getItem("userlogged") && localStorage.removeItem("userlogged")
    router.push("/login")
  }

  if (loading) {
    console.log('[ProfilePage] Loading:', loading, 'User:', user, 'Profile:', profile);
    return <Loading funtion='Loading profile page '/> 
  }

  if (!user) {
    console.log('[ProfilePage] No user detected after loading.');
    return <div className="p-8">You must be logged in to view your profile.</div>
  }

  return (
    <div className="max-w-xl mx-auto my-16 bg-white p-8 rounded-xl shadow border border-[#dbaf2c]">
      <Link href = "/"><ArrowBigLeft className="text-primary "/></Link>
      <h1 className="text-3xl font-bold mb-6 text-[#70992f]">My Profile</h1>
      <button onClick={handleLogout} className="mb-6 bg-red-500 text-white px-4 py-2 rounded float-right">Logout</button>
      {editMode ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="font-semibold">Name:</label>
            <input className="ml-2 p-2 border rounded" value={form.name} onChange={e => setForm((f: any) => ({...f, name: e.target.value}))} />
          </div>
          {/* School-specific fields */}
          {profile?.type === "school" && (
            <>
              <div>
                <label className="font-semibold">School Name:</label>
                <input className="ml-2 p-2 border rounded" value={form.schoolName || ""} onChange={e => setForm((f: any) => ({...f, schoolName: e.target.value}))} />
              </div>
              <div>
                <label className="font-semibold">Contact Email:</label>
                <input className="ml-2 p-2 border rounded" value={form.contactEmail || ""} onChange={e => setForm((f: any) => ({...f, contactEmail: e.target.value}))} />
              </div>
              <div>
                <label className="font-semibold">Address:</label>
                <input className="ml-2 p-2 border rounded" value={form.address || ""} onChange={e => setForm((f: any) => ({...f, address: e.target.value}))} />
              </div>
              <div>
                <label className="font-semibold">Phone:</label>
                <input className="ml-2 p-2 border rounded" value={form.phone || ""} onChange={e => setForm((f: any) => ({...f, phone: e.target.value}))} />
              </div>
            </>
          )}
          <button type="submit" className="bg-[#70992f] text-white px-4 py-2 rounded">Save</button>
          <button type="button" className="ml-2 px-4 py-2 rounded border" onClick={() => setEditMode(false)}>Cancel</button>
        </form>
      ) : (
        <div className="space-y-4">
          <div><span className="font-semibold">Name:</span> {profile?.name || profile?.schoolName || "-"}</div>
          <div><span className="font-semibold">Email:</span> {user.email}</div>
          {profile?.type === "school" && (
            <>
              <div><span className="font-semibold">School Name:</span> {profile?.schoolName || "-"}</div>
              <div><span className="font-semibold">Contact Email:</span> {profile?.contactEmail || "-"}</div>
              <div><span className="font-semibold">Address:</span> {profile?.address || "-"}</div>
              <div><span className="font-semibold">Phone:</span> {profile?.phone || "-"}</div>
            </>
          )}
          <div><span className="font-semibold">Joined:</span> {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "-"}</div>
          <button className="bg-[#70992f] text-white px-4 py-2 rounded" onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  )
}
