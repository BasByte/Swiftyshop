import AdminSidebar from "@/src/components/AdminSidebar";
import { getSession } from "@/src/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col md:flex-row">
      <AdminSidebar role={session?.role || "manager"} />
      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}
