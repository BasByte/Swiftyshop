"use client";

import { useState } from "react";
import { loginUser } from "@/src/app/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginUser(formData);
      if (res.success) {
        if (res.role === "admin" || res.role === "manager") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="flex items-center gap-2 mb-8 justify-center">
            <ShoppingBag className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900">SWIFTSHOP</h1>
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Welcome Back</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold mb-6">
            {error}
          </div>
        )}

        <div className="mb-6 p-4 bg-indigo-50 rounded-xl text-sm border border-indigo-100">
          <p className="font-bold text-indigo-900 mb-2">Demo Credentials:</p>
          <ul className="text-indigo-800 space-y-1 text-xs">
            <li><strong>Admin:</strong> admin@example.com / admin</li>
            <li><strong>Manager:</strong> manager@example.com / manager</li>
            <li><strong>Customer:</strong> customer@example.com / customer</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          Don't have an account? <Link href="/register" className="text-indigo-600 font-bold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
