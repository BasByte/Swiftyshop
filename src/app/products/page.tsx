import prisma from '@/src/lib/prisma';
import Link from 'next/link';
import { Search, ShoppingCart, Filter, ArrowRight, Star } from 'lucide-react';
import ProductFilters from '@/src/components/ProductFilters';
import { Suspense } from 'react';
import { getLanguage } from '@/src/lib/getLanguage';
import { dictionaries } from '@/src/lib/dictionaries';
import { formatCurrency } from '@/src/lib/utils';
import Footer from '@/src/components/Footer';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; minPrice?: string; maxPrice?: string; inStock?: string; minRating?: string }>;
}) {
  const { q = '', category = 'All', minPrice, maxPrice, inStock, minRating } = await searchParams;
  const lang = await getLanguage();
  const dict = dictionaries[lang];

  const products = await prisma.product.findMany({
    where: {
      AND: [
        {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
          ],
        },
        category !== 'All' ? { category } : {},
        minPrice ? { price: { gte: parseFloat(minPrice) } } : {},
        maxPrice ? { price: { lte: parseFloat(maxPrice) } } : {},
        inStock === 'true' ? { stock: { gt: 0 } } : {},
        inStock === 'false' ? { stock: { equals: 0 } } : {},
        minRating ? { rating: { gte: parseFloat(minRating) } } : {},
      ],
    },
  });

  const categories = ['All', ...new Set((await prisma.product.findMany()).map(p => p.category))];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero Section */}
        {!q && category === 'All' && (
          <div className="relative h-[400px] rounded-3xl overflow-hidden mb-12 group">
            <img
              src="/background/listing1.png"
              alt="E-commerce Hero"
              className="absolute inset-0 w-full h-full object-fill transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row gap-8">
          <Suspense fallback={<div className="w-full md:w-64 shrink-0 p-6 bg-slate-50 animate-pulse rounded-3xl" />}>
            <ProductFilters categories={categories} dict={dict} />
          </Suspense>

          <div className="flex-1">
            {/* Results Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <p className="text-sm text-slate-500 font-medium">
                {dict.products.showing} <span className="text-slate-900 font-bold">{products.length}</span> {dict.products.productsText}
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`} className="group flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300">
                  <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 end-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                      <button className="bg-white p-2.5 rounded-xl shadow-xl hover:scale-110 transition-transform">
                        <ShoppingCart className="w-5 h-5 text-indigo-600" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="font-black text-slate-900 whitespace-nowrap ms-2">
                    {formatCurrency(product.price)}
                      </p>
                    </div>
                    {product.rating > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-700">{product.rating.toFixed(1)}</span>
                        <span className="text-[10px] text-slate-400 font-medium">({product.numReviews})</span>
                      </div>
                    )}
                    <p className="text-sm text-slate-500 line-clamp-2 mb-6">
                      {product.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                       <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          {product.category}
                        </span>
                       </div>
                       <span className={`text-[10px] font-bold uppercase tracking-widest py-1 px-2 rounded-lg ${product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {product.stock > 0 ? dict.products.inStock : dict.products.outOfStock}
                        </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {products.length === 0 && (
              <div className="py-24 text-center">
                <div className="inline-flex items-center justify-center p-6 bg-slate-100 rounded-full mb-6">
                  <Filter className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{dict.products.noProducts}</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                  {dict.products.noProductsDesc}
                </p>
                <Link href="/" className="inline-flex items-center justify-center px-6 py-3 mt-8 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">
                  {dict.products.clearFilters}
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
