"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import Link from "next/link"
import { ArrowBigLeft } from "lucide-react"

export default function RegisterIndividual() {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
    const [user, setUser] = useState<boolean>(false)
  
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
      router.push("/profile")
    } catch (err: any) {
      setError(err.message || "Registration failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

    const handleGoogleSignIn = async () => {
      setError("")
      setLoading(true)
      try {
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        const user = result.user
        const adminDoc = await getDoc(doc(db, "users", user.uid))
        if (adminDoc.exists() && adminDoc.data().role === "admin") {
          localStorage.setItem("isAdmin", "true")
          localStorage.setItem("userEmail", user.email || "")
          router.push("/profile")
        } else {
          localStorage.setItem("isAdmin", "false")
          localStorage.setItem("userEmail", user.email || "")
          router.push("/profile")
        }
        setUser(true);
        if(user){
          localStorage.setItem('userlogged', "true")
        }
      } catch (err: any) {
        setError(err.message || "Google sign-in failed.")
      } finally {
        setLoading(false)
      }
    }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-gradient-to-br from-slate-50 to-slate-100">
   
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-[#dbaf2c]">
        <Link href = "/"><ArrowBigLeft className="text-primary "/></Link>
        <h1 className="text-2xl font-bold mb-6 text-[#70992f]">Register as Individual</h1>
        <input className="w-full mb-4 p-3 border border-[#dbaf2c] rounded" placeholder="Full Name" required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
        <input className="w-full mb-4 p-3 border border-[#dbaf2c] rounded" placeholder="Email" type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
        <input className="w-full mb-4 p-3 border border-[#dbaf2c] rounded" placeholder="Password" type="password" required value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button type="submit" className="w-full bg-[#70992f] text-white py-3 rounded font-semibold hover:bg-[#55731f] transition" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
        <button type="button" onClick={handleGoogleSignIn} className="w-full mt-4 bg-white border border-[#70992f] text-[#70992f] py-3 rounded font-semibold hover:bg-[#f5f5f5] transition flex items-center justify-center gap-2" disabled={loading}>
          <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303C34.73 32.082 29.818 35 24 35c-6.627 0-12-5.373-12-12s5.373-12 12-12c2.761 0 5.292.98 7.292 2.593l6.093-6.093C34.527 5.14 29.508 3 24 3 12.954 3 4 11.954 4 23s8.954 20 20 20c11.045 0 19.799-7.969 19.799-19.799 0-1.326-.138-2.617-.188-3.118z"/><path fill="#34A853" d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 13 24 13c2.761 0 5.292.98 7.292 2.593l6.093-6.093C34.527 5.14 29.508 3 24 3c-7.732 0-14.313 4.41-17.694 10.691z"/><path fill="#FBBC05" d="M24 43c5.798 0 10.627-1.924 14.172-5.234l-6.531-5.357C29.818 35 24 35 24 35c-5.818 0-10.73-2.918-13.303-7.083l-6.571 4.819C9.687 40.59 16.268 45 24 45z"/><path fill="#EA4335" d="M43.611 20.083H42V20H24v8h11.303C34.73 32.082 29.818 35 24 35c-5.818 0-10.73-2.918-13.303-7.083l-6.571 4.819C9.687 40.59 16.268 45 24 45c5.798 0 10.627-1.924 14.172-5.234l-6.531-5.357C29.818 35 24 35 24 35c-5.818 0-10.73-2.918-13.303-7.083l-6.571 4.819C9.687 40.59 16.268 45 24 45c11.045 0 19.799-7.969 19.799-19.799 0-1.326-.138-2.617-.188-3.118z"/></g></svg>
          Sign in with Google
        </button>
      </form>
      
    </div>
  )
}
