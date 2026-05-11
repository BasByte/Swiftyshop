import prisma from '@/src/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Share2, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';
import CheckoutForm from '@/src/components/CheckoutForm';
import { formatCurrency } from '@/src/lib/utils';
import { getSession } from '@/src/lib/auth';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) notFound();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image Gallery */}
          <div className="space-y-8">
            <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 ring-1 ring-black/5">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-indigo-200 transition-colors">
                  <Truck className="w-6 h-6 text-slate-300 mb-3 group-hover:text-indigo-600 transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-1">Fast Shipping</span>
                  <span className="text-[10px] text-slate-400 font-medium">2-4 Business Days</span>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-indigo-200 transition-colors">
                  <ShieldCheck className="w-6 h-6 text-slate-300 mb-3 group-hover:text-indigo-600 transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-1">Authentic</span>
                  <span className="text-[10px] text-slate-400 font-medium">100% Guaranteed</span>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-indigo-200 transition-colors">
                  <RefreshCcw className="w-6 h-6 text-slate-300 mb-3 group-hover:text-indigo-600 transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-1">Easy Returns</span>
                  <span className="text-[10px] text-slate-400 font-medium">30-Day Window</span>
               </div>
            </div>
          </div>

          {/* Product Info & Form */}
          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-indigo-100">
                  {product.category}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  SKU: {product.id.slice(-6).toUpperCase()}
                </span>
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border ${product.stock > 0 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-black text-indigo-600 mb-8">
                {formatCurrency(product.price)}
              </p>
              <div className="max-w-none text-slate-500 text-sm leading-relaxed mb-8">
                {product.description}
              </div>
            </div>

            <CheckoutForm 
              productId={product.id} 
              productName={product.name} 
              productPrice={product.price}
              isLoggedIn={!!session}
              userName={session?.name}
            />
            
            <div className="pt-8 border-t border-slate-100">
               <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Sharing is Caring</h4>
               <div className="flex items-center gap-3">
                  <button className="bg-[#1877F2] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md shadow-blue-500/20">
                     Facebook
                  </button>
                  <button className="bg-[#1DA1F2] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md shadow-cyan-500/20">
                     Twitter
                  </button>
                  <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-black active:scale-95 transition-all shadow-md shadow-slate-900/10">
                     Copy Link
                  </button>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
