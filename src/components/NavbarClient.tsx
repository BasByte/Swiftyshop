"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import LanguageToggle from "./LanguageToggle";
import { useState } from "react";
import { logoutUser } from "@/src/app/actions";

export default function NavbarClient({ 
  session, 
  lang, 
  dict 
}: { 
  session: any; 
  lang: string; 
  dict: any; 
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-s-0 flex w-full z-50 bg-slate-900 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight  hover:opacity-80 transition-opacity">
            SWIFTY<span className="text-indigo-600">SHOP</span>
          </Link>
          
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form action="/products" className="relative w-full">
              <input
                type="text"
                name="q"
                placeholder={dict.nav.search}
                className="w-full bg-slate-100 border-none rounded-lg px-10 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-neutral-900"
              />
              <Search className="absolute inset-s-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </form>
          </div>

          {/* Desktop Right Nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/products" className="text-xs uppercase tracking-widest font-bold text-white hover:text-indigo-600 transition-colors me-2">
              {dict.nav.store}
            </Link>
            {session ? (
              <>
                {(session.role === "admin" || session.role === "manager") && (
                  <Link href="/admin" className="text-xs uppercase tracking-widest font-bold  hover:text-indigo-600 transition-colors">
                    {dict.nav.admin}
                  </Link>
                )}
                
                <Link href="/orders" className="text-xs uppercase tracking-widest font-bold text-white hover:text-indigo-600 transition-colors ms-4 me-2">
                  {dict.nav.orders}
                </Link>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center transition-colors">
                    <User className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="me-2 border-e border-slate-200 pe-4">
                    <div className="text-xs font-bold text-white-900 leading-tight">{session.name}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-pink-400 leading-tight">{session.role}</div>
                  </div>
                </div>
                
                <form action={logoutUser}>
                  <button title="Logout" className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-full transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <Link href="/login" className="text-xs font-bold px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest shadow-lg shadow-slate-900/20">
                {dict.nav.login}
              </Link>
            )}

            <Link href="/cart" className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors ms-2">
              <ShoppingCart className="w-6 h-6" />
            </Link>

            <div className="ps-2 border-s border-slate-200 ms-2">
              <LanguageToggle currentLang={lang} />
            </div>
          </div>

          {/* Mobile Right Nav */}
          <div className="flex items-center md:hidden gap-2">
            <Link href="/cart" className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <div className="ps-2 border-s border-slate-200 ms-2">
              <LanguageToggle currentLang={lang} />
            </div>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <form action="/products" className="relative w-full mb-4">
              <input
                type="text"
                name="q"
                placeholder={dict.nav.search}
                className="w-full bg-slate-100 border-none rounded-lg px-10 py-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              />
              <Search className="absolute inset-s-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </form>
            
            <div className="flex flex-col gap-4">
              <Link 
                href="/products" 
                onClick={() => setIsMenuOpen(false)}
                className="text-xs uppercase tracking-widest font-bold text-slate-600 hover:text-indigo-600"
              >
                {dict.nav.store}
              </Link>
              
              {session ? (
                <>
                  {(session.role === "admin" || session.role === "manager") && (
                    <Link 
                      href="/admin" 
                      onClick={() => setIsMenuOpen(false)}
                      className="text-xs uppercase tracking-widest font-bold text-slate-600 hover:text-indigo-600"
                    >
                      {dict.nav.admin}
                    </Link>
                  )}
                  <Link 
                    href="/orders" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xs uppercase tracking-widest font-bold text-slate-600 hover:text-indigo-600"
                  >
                    {dict.nav.orders}
                  </Link>
                  <form action={logoutUser} className="mt-2 text-left">
                    <button 
                      type="submit" 
                      className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-red-600 hover:text-red-700 w-full"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </form>
                </>
              ) : (
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-xs uppercase tracking-widest font-bold text-slate-600 hover:text-indigo-600"
                >
                  {dict.nav.login}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
