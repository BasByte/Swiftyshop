"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, CheckCircle2 } from "lucide-react";
import { createOrder } from "@/src/app/actions";
import { formatCurrency } from "@/src/lib/utils";

interface CheckoutFormProps {
  productId: string;
  productName: string;
  productPrice: number;
  isLoggedIn?: boolean;
  userName?: string;
}

export default function CheckoutForm({ productId, productName, productPrice, isLoggedIn, userName }: CheckoutFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalPrice = productPrice * quantity;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("productId", productId);
    formData.append("quantity", quantity.toString());

    try {
      await createOrder(formData);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 inset-s-0 w-full h-1 bg-linear-to-r from-indigo-500 to-cyan-500" />
        <div className="inline-flex items-center justify-center p-4 bg-green-500/10 rounded-full mb-6 ring-1 ring-green-500/30">
          <CheckCircle2 className="w-12 h-12 text-green-400" />
        </div>
        <h2 className="text-3xl font-black mb-4">Order Placed!</h2>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
          Thank you for shopping with us. Your order for <span className="text-white font-bold">{productName}</span> is being processed with priority.
        </p>
        <button
          onClick={() => window.location.href = "/"}
          className="w-full bg-white text-slate-900 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 active:scale-95 transition-all shadow-xl shadow-white/5"
        >
          Back to Store
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-indigo-600 rounded-3xl p-8 shadow-2xl shadow-indigo-100 flex flex-col relative overflow-hidden">
      <div className="mb-8 text-center">
        <h2 className="text-xl font-bold text-slate-900">Instant Purchase</h2>
        <p className="text-sm text-slate-500 font-medium">Ships within 24 hours.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
        <div className="space-y-5">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Select Quantity</span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-600 hover:text-indigo-600 transition-colors shadow-sm"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-black w-6 text-center text-slate-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-600 hover:text-indigo-600 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ms-1">Full Name</label>
              <input
                required
                name="name"
                defaultValue={userName}
                type="text"
                placeholder="Nom Prenom"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ms-1">Phone Number</label>
              <input
                required
                name="phone"
                type="tel"
                placeholder="+213 0000000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ms-1">Delivery Address</label>
            <textarea
              required
              name="address"
              rows={2}
              placeholder="Cité 20 Août 1955, Alger"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none text-sm font-medium"
            />
          </div>
        </div>

        <div className="pt-8 mt-auto">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 mb-8">
            <div className="flex justify-between text-xs mb-3 text-slate-500 font-bold uppercase tracking-widest">
              <span>Order Summary</span>
              <span>Subtotal: {formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between items-end pt-3 border-t border-slate-200">
              <span className="text-sm font-bold text-slate-900 uppercase">Total Payable</span>
              <span className="text-3xl font-black text-indigo-600">{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          <button
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-indigo-100"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Place Order Now <ShoppingBag className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
      
      <p className="mt-8 text-center text-[10px] text-slate-400 font-black uppercase tracking-widest">
        Secure Checkout • Prisma ORM Verified
      </p>
    </div>
  );
}
