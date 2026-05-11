"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/src/lib/utils";
import { Trash2, CheckCircle, Clock, XCircle, Truck, Package } from "lucide-react";
import { updateOrderStatus, deleteOrder } from "@/src/app/actions";

const STATUS_OPTIONS = [
  "New Order",
  "Confirmed",
  "Not Confirmed",
  "Shipped",
  "Canceled"
];

export default function OrderTable({ initialOrders, role }: { initialOrders: any[], role?: string }) {
  const [orders, setOrders] = useState(initialOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const router = useRouter();

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(id);
        setOrders(orders.filter(o => o.id !== id));
      } catch (err) {
        alert("Not authorized to delete orders.");
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateOrderStatus(id, newStatus);
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "New Order": return <Package className="w-3 h-3" />;
      case "Confirmed": return <CheckCircle className="w-3 h-3" />;
      case "Not Confirmed": return <Clock className="w-3 h-3" />;
      case "Shipped": return <Truck className="w-3 h-3" />;
      case "Canceled": return <XCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
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
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Orders</h1>
           <p className="text-sm text-slate-500 font-medium">Manage your customer orders</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-[12px] font-black uppercase tracking-widest text-slate-700 border-b border-slate-100">
                <th className="px-8 py-5">Reference</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Address</th>
                <th className="px-8 py-5 text-right">Amount</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                >
                  <td className="px-8 py-6 text-sm font-black text-slate-900">
                    <div className="mb-1">#{order.id.slice(0, 8).toUpperCase()}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                       {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-slate-900">{order.customerName}</div>
                    <div className="text-[10px] text-slate-400 font-bold">{order.customerPhone}</div>
                  </td>
                  <td className="px-8 py-6 text-xs text-slate-500 font-medium max-w-[200px] truncate">
                    {order.address}
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-slate-900 text-right">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-8 py-6">
                    <select
                      value={order.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`inline-flex items-center gap-1.5 ps-3 pe-8 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest appearance-none outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow cursor-pointer border-e-8 border-transparent ${getStatusColor(order.status)}`}
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt} value={opt} className="bg-white text-slate-900 font-bold">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                       {role === "admin" && (
                         <button onClick={(e) => handleDelete(e, order.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                         </button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center">
                    <p className="text-slate-500 font-medium">No orders found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs font-medium text-slate-500">
              Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to <span className="font-bold text-slate-900">{Math.min(startIndex + itemsPerPage, orders.length)}</span> of <span className="font-bold text-slate-900">{orders.length}</span> results
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                      currentPage === i + 1 
                        ? "bg-indigo-600 text-white" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
