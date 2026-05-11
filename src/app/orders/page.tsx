import prisma from "@/src/lib/prisma";
import { getSession } from "@/src/lib/auth";
import { formatCurrency } from "@/src/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, Clock, CheckCircle, Truck, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomerOrdersPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: true,
        }
      }
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "New Order": return <Package className="w-4 h-4" />;
      case "Confirmed": return <CheckCircle className="w-4 h-4" />;
      case "Not Confirmed": return <Clock className="w-4 h-4" />;
      case "Shipped": return <Truck className="w-4 h-4" />;
      case "Canceled": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New Order": return "bg-blue-100 text-blue-700";
      case "Confirmed": return "bg-green-100 text-green-700";
      case "Not Confirmed": return "bg-yellow-100 text-yellow-700";
      case "Shipped": return "bg-indigo-100 text-indigo-700";
      case "Canceled": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">My Orders</h1>
          <p className="text-sm text-slate-500 font-medium">Track your recent orders and current status.</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-200">
             <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
             <h2 className="text-xl font-bold text-slate-900 mb-2">No orders yet</h2>
             <p className="text-slate-500 mb-6 font-medium">You haven't placed any orders.</p>
             <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">
               Start Shopping
             </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 sm:px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">
                      Order Placed
                    </div>
                    <div className="text-sm font-black text-slate-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">
                      Total
                    </div>
                    <div className="text-sm font-black text-slate-900">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </div>
                  <div>
                     <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">
                      Order #
                    </div>
                    <div className="text-sm font-black text-slate-900">
                      {order.id.slice(0,8).toUpperCase()}
                    </div>
                  </div>
                  <div className="sm:ms-auto">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 divide-y divide-slate-50">
                  {order.items.map(item => (
                    <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex items-center gap-6">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 fill-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.product.id}`} className="text-base sm:text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
                          {item.product.name}
                        </Link>
                        <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">
                          {item.product.category}
                        </p>
                        <div className="flex items-center gap-2 sm:gap-4">
                          <span className="text-sm font-black text-slate-900">{formatCurrency(item.price)}</span>
                          <span className="text-xs text-slate-400 font-medium">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="hidden sm:block text-right self-start mt-1">
                        <Link href={`/product/${item.product.id}`} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">
                          Buy Again
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
