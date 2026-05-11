"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, ShoppingBag, Users, LayoutDashboard, LogOut } from "lucide-react";
import { logoutUser } from "@/src/app/actions";

export default function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  ];

  if (role === "admin") {
     links.push({ name: "Users", href: "/admin/users", icon: Users });
  }

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-white p-8 flex flex-col gap-12 shrink-0 md:min-h-[calc(100vh-64px)] md:sticky md:top-16 flex-none max-h-[calc(100vh-64px)] overflow-y-auto">
      <div>
        <p className="text-2xl uppercase tracking-widest text-slate-200 text-center mt-2 font-black">Admin Management</p>
      </div>

      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          if (isActive) {
            return (
              <Link key={link.href} href={link.href} className="flex items-center gap-3 text-white font-bold text-sm bg-indigo-600 p-4 rounded-xl shadow-lg shadow-indigo-500/20">
                <Icon className="w-4 h-4" /> {link.name}
              </Link>
            );
          }

          return (
            <Link key={link.href} href={link.href} className="flex items-center gap-3 text-slate-400 hover:text-white transition-all text-sm p-4 hover:translate-x-1">
              <Icon className="w-4 h-4" /> {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Live Status</h4>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold">Systems Normal</span>
          </div>
        </div>
        <button onClick={() => logoutUser()} className="flex items-center justify-center gap-2 w-full py-3.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
