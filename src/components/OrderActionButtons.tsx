"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { updateOrderStatus, deleteOrder } from "@/src/app/actions";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS = [
  "New Order",
  "Confirmed",
  "Not Confirmed",
  "Shipped",
  "Canceled"
];

const getStatusColor = (status: string) => {
    switch (status) {
      case "New Order": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Confirmed": return "bg-green-100 text-green-700 border-green-200";
      case "Not Confirmed": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Shipped": return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "Canceled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

export default function OrderActionButtons({ orderId, initialStatus, role }: { orderId: string, initialStatus: string, role?: string }) {
  const [status, setStatus] = useState(initialStatus);
  const router = useRouter();

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    await updateOrderStatus(orderId, newStatus);
    router.refresh();
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(orderId);
        router.push("/admin/orders");
        router.refresh();
      } catch (err) {
        alert("Not authorized to delete orders.");
      }
    }
  };

  return (
    <div className="flex items-center gap-4">
      <select
        value={status}
        onChange={handleStatusChange}
        className={`inline-flex items-center gap-1.5 ps-4 pe-10 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest appearance-none outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow cursor-pointer border border-e-8 border-transparent ${getStatusColor(status)}`}
      >
        {STATUS_OPTIONS.map(opt => (
          <option key={opt} value={opt} className="bg-white text-slate-900 font-bold">
            {opt}
          </option>
        ))}
      </select>
      
      {role === "admin" && (
        <button 
          onClick={handleDelete}
          className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl transition-all shadow-sm"
          title="Delete Order"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
