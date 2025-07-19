"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import Link from "next/link"
import { ArrowBigLeft } from "lucide-react"

export default function RegisterSchool() {
  const [form, setForm] = useState({ schoolName: "", contactEmail: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.contactEmail, form.password)
      const user = userCredential.user
      // Store school details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        schoolName: form.schoolName,
        email: form.contactEmail,
        createdAt: new Date().toISOString(),
        type: "school" // assign role
      })
      router.push("/user-admin")
    } catch (err: any) {
      setError(err.message || "Registration failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
       <Link href = "/"><ArrowBigLeft className="text-primary "/></Link>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-[#dbaf2c]">
        <h1 className="text-2xl font-bold mb-6 text-[#70992f]">Register as School</h1>
        <input className="w-full mb-4 p-3 border border-[#dbaf2c] rounded" placeholder="School Name" required value={form.schoolName} onChange={e => setForm(f => ({...f, schoolName: e.target.value}))} />
        <input className="w-full mb-4 p-3 border border-[#dbaf2c] rounded" placeholder="Contact Email" type="email" required value={form.contactEmail} onChange={e => setForm(f => ({...f, contactEmail: e.target.value}))} />
        <input className="w-full mb-4 p-3 border border-[#dbaf2c] rounded" placeholder="Password" type="password" required value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button type="submit" className="w-full bg-[#dbaf2c] text-white py-3 rounded font-semibold hover:bg-[#b98d1e] transition" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
      </form>
    </div>
  )
}
