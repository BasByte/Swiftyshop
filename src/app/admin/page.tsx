import prisma from '@/src/lib/prisma';
import Link from 'next/link';
import { Package, ShoppingBag, Users, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';
import { formatCurrency } from '@/src/lib/utils';

export default async function AdminDashboard() {
  const [orders, products, orderCount, productCount] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } },
      take: 10,
    }),
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.order.count(),
    prisma.product.count(),
  ]);

  const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);

  return (
    <>
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-12 gap-6">
         <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Dashboard</h1>
            <p className="text-sm text-slate-500 font-medium">Monitoring your performance with Prisma Analytics.</p>
         </div>
         <div className="flex bg-white rounded-xl p-1 border border-slate-200 shadow-sm h-fit self-start">
            <button className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100">Lifetime</button>
            <button className="px-5 py-2 rounded-lg text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">30 Days</button>
         </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-500 transition-all duration-300">
            <div className="relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700 mb-3 block">Total Sales Revenue</span>
              <p className="text-4xl font-black text-slate-900 mb-4">{formatCurrency(totalSales)}</p>
              <div className="flex items-center gap-2 text-green-600 font-black text-xs bg-green-50 w-fit px-2 py-1 rounded-lg">
                 <ArrowUpRight className="w-3.5 h-3.5" /> +12.5%
              </div>
            </div>
            <div className="absolute top-0 inset-e-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShoppingBag className="w-24 h-24 text-slate-900" />
            </div>
         </div>
         
         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm group hover:border-indigo-500 transition-all duration-300">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700 mb-3 block">Volume of Orders</span>
            <p className="text-4xl font-black text-slate-900 mb-4">{orderCount}</p>
            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
               <Clock className="w-3.5 h-3.5 text-indigo-600" /> Pending: {orders.filter(o => o.status === 'New Order' || o.status === 'PENDING').length}
            </div>
         </div>

         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm group hover:border-indigo-500 transition-all duration-300">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700 mb-3 block">Catalog Management</span>
            <p className="text-4xl font-black text-slate-900 mb-4">{productCount}</p>
            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
               <Package className="w-3.5 h-3.5 text-indigo-600" /> In-stock Categories
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* Recent Orders */}
          <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden h-fit">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
               <Link href="/admin/orders" className="text-[10px] font-black tracking-widest text-slate-600 hover:text-indigo-600 transition-colors uppercase">All Orders</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-600">
                       <th className="px-8 py-5 border-b border-slate-100">Reference</th>
                       <th className="px-8 py-5 border-b border-slate-100">Customer</th>
                       <th className="px-8 py-5 border-b border-slate-100 text-right">Amount</th>
                       <th className="px-8 py-5 border-b border-slate-100">Status</th>
                       <th className="px-8 py-5 border-b border-slate-100">Timeline</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                         <td className="px-8 py-6 text-sm font-black text-slate-900">#{order.id.slice(0, 8).toUpperCase()}</td>
                         <td className="px-8 py-6">
                            <div className="text-sm font-bold text-slate-900">{order.customerName}</div>
                            <div className="text-[10px] text-slate-400 font-bold">{order.customerPhone}</div>
                         </td>
                         <td className="px-8 py-6 text-sm font-black text-slate-900 text-right">{formatCurrency(order.totalAmount)}</td>
                         <td className="px-8 py-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                              order.status === 'Confirmed' || order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                              order.status === 'Canceled' ? 'bg-red-100 text-red-700' :
                              'bg-indigo-100 text-indigo-700'
                            }`}>
                              {order.status === 'Confirmed' || order.status === 'COMPLETED' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {order.status}
                            </span>
                         </td>
                         <td className="px-8 py-6 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            {new Date(order.createdAt).toLocaleDateString()}
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
            </div>
          </div>

          {/* Catalog Health */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden h-fit">
             <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <h2 className="text-lg font-bold text-slate-900">Catalog Health</h2>
               {/* <AddProductModal /> */}
             </div>
             <div className="divide-y divide-slate-50">
               {products.map((product) => (
                 <div key={product.id} className="p-6 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="w-16 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                       <img src={product.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <h3 className="text-sm font-black text-slate-900 truncate">{product.name}</h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{product.category}</p>
                       <div className="flex items-center gap-2">
                         <span className="text-sm font-black text-indigo-600">{formatCurrency(product.price)}</span>
                         <span className="w-1 h-1 rounded-full bg-slate-300" />
                         <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock < 10 ? 'text-red-500 bg-red-50' : 'text-green-500 bg-green-50'} px-2 py-0.5 rounded`}>
                           {product.stock} Units
                         </span>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
             <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                <Link href="/admin/products" className="w-full block text-center py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm">
                   Manage All Inventory
                </Link>
             </div>
          </div>
      </div>
      
    </>
  );
}
