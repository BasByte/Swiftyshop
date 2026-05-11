import prisma from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/src/lib/utils";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, User, Package, Calendar } from "lucide-react";
import OrderActionButtons from "@/src/components/OrderActionButtons";
import { getSession } from "@/src/lib/auth";

export default async function OrderDetailsPage(props: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  const params = await props.params;
  const { id } = params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        }
      }
    }
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="w-full">
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 text-[10px] font-black uppercase tracking-widest">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
           <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xl">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
           <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
             <Calendar className="w-4 h-4" /> {new Date(order.createdAt).toLocaleString()}
           </div>
        </div>
        <OrderActionButtons orderId={order.id} initialStatus={order.status} role={session?.role} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Order Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" /> Order Items
              </h2>
            </div>
            <div className="divide-y divide-slate-50">
              {order.items.map((item) => (
                <div key={item.id} className="p-8 flex items-center gap-6">
                  <div className="w-20 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                     <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <h3 className="text-base font-black text-slate-900 truncate mb-1">{item.product.name}</h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">{item.product.category}</p>
                     <div className="flex items-center gap-4">
                       <span className="text-sm font-black text-slate-900">{formatCurrency(item.price)}</span>
                       <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                       <span className="text-xs font-bold text-slate-500">Qty: {item.quantity}</span>
                     </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Total</span>
                    <span className="text-lg font-black text-indigo-600">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Customer Details & Summary */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" /> Customer Information
              </h2>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Name</span>
                <p className="text-sm font-black text-slate-900">{order.customerName}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Contact</span>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Phone className="w-4 h-4 text-slate-400" /> {order.customerPhone}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Shipping Address</span>
                <div className="flex items-start gap-2 text-sm font-medium text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /> 
                  <span className="leading-relaxed">{order.address}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl">
             <h2 className="text-[10px] font-black uppercase tracking-widest mb-6 text-slate-400">Order Summary</h2>
             
             <div className="space-y-4 mb-6">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-400 font-bold">Subtotal</span>
                 <span className="font-bold">{formatCurrency(order.totalAmount)}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-400 font-bold">Shipping</span>
                 <span className="font-bold text-green-400">Free</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-400 font-bold">Tax</span>
                 <span className="font-bold">{formatCurrency(0)}</span>
               </div>
             </div>
             
             <div className="pt-6 border-t border-slate-700/50 flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Total Paid</span>
                  <span className="text-3xl font-black text-white">{formatCurrency(order.totalAmount)}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
