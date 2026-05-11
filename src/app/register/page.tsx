"use client";

import { useState } from "react";
import { registerUser } from "@/src/app/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      const res = await registerUser(formData);
      if (res.success) {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="flex items-center gap-2 mb-8 justify-center">
            <ShoppingBag className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900">SWIFTYSHOP</h1>
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Create Account</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
            <input 
              type="text" 
              name="name" 
              required
              className="w-full bg-slate-50 border text-black border-slate-200 rounded-xl px-4 py-3 text-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email" 
              name="email" 
              required
              className="w-full bg-slate-50 border text-black border-slate-200 rounded-xl px-4 py-3 text-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              name="password" 
              required
              className="w-full bg-slate-50 border text-black border-slate-200 rounded-xl px-4 py-3 text-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase tracking-widest text-sm shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          Already have an account? <Link href="/login" className="text-indigo-600 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
