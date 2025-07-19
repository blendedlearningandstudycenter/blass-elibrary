"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import Link from "next/link"
import { ArrowBigLeft } from "lucide-react"

export default function RegisterIndividual() {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password)
      const user = userCredential.user
      // Store user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: form.name,
        email: form.email,
        createdAt: new Date().toISOString(),
        type: "user" // assign role
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
        <h1 className="text-2xl font-bold mb-6 text-[#70992f]">Register as Individual</h1>
        <input className="w-full mb-4 p-3 border border-[#dbaf2c] rounded" placeholder="Full Name" required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
        <input className="w-full mb-4 p-3 border border-[#dbaf2c] rounded" placeholder="Email" type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
        <input className="w-full mb-4 p-3 border border-[#dbaf2c] rounded" placeholder="Password" type="password" required value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button type="submit" className="w-full bg-[#70992f] text-white py-3 rounded font-semibold hover:bg-[#55731f] transition" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
      </form>
    </div>
  )
}
