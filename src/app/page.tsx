import prisma from "@/src/lib/prisma";
import Link from "next/link";
import {
  ShoppingCart,
  ArrowRight,
  Star,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react";
import { getLanguage } from "@/src/lib/getLanguage";
import { dictionaries } from "@/src/lib/dictionaries";
import { formatCurrency } from "../lib/utils";
import Footer from "../components/Footer";

export default async function HomePage() {
  const lang = await getLanguage();
  const dict = dictionaries[lang];

  const recentProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const trendingProducts = await prisma.product.findMany({
    orderBy: { rating: "desc" },
    take: 4,
  });

  const mostSellingProducts = await prisma.product.findMany({
    orderBy: { numReviews: "desc" },
    take: 4,
  });

  const featuredProduct = recentProducts[0];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col font-sans">
      <main className="flex-1">
        {/* Modern Hero Section */}
        <section className="flex flex-col relative w-full h-screen text-center justify-end">
          <div className="absolute inset-0 z-20">
            <img
              src="/background/header_sm.png"
              alt="E-commerce Hero"
              className="w-full h-full object-cover block md:hidden"
              referrerPolicy="no-referrer"
            />
            <img
              src="/background/header_md.png"
              alt="E-commerce Hero"
              className="w-full h-full object-fill hidden md:block"
              referrerPolicy="no-referrer"
            />
            {/* Dark Overlay for text readability */}
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 py-10 sm:py-10 lg:py-10 w-full">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/products"
                className="inline-flex justify-center items-center px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-lg shadow-indigo-500/20 w-fit"
              >
                {dict.home.shopNow}
                <ArrowRight className="ms-2 w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex justify-center items-center px-8 py-4 bg-black hover:bg-black/60 text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-all backdrop-blur-sm w-fit border border-white/10"
              >
                {dict.home.login}
              </Link>
            </div>
          </div>
        </section>

        {/* Home Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
          {/* Trending Now */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {dict.home.trendingNow}
                  </h2>
                  <p className="text-sm font-medium text-slate-500">
                    {dict.home.highestRated}
                  </p>
                </div>
              </div>
              <Link
                href="/products"
                className="hidden sm:flex text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest items-center gap-1"
              >
                {dict.home.viewAll} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} dict={dict} />
              ))}
            </div>
          </section>

          {/* Featured Product Banner */}
          {featuredProduct && (
            <section className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col md:flex-row">
              <div className="md:w-1/2 p-12 lg:p-16 flex flex-col justify-center">
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-6">
                  {dict.home.staffPick}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
                  {featuredProduct.name}
                </h2>
                <div className="flex items-center gap-1 mb-6">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-700">
                    {featuredProduct.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-slate-400 font-medium">
                    ({featuredProduct.numReviews} {dict.home.reviews})
                  </span>
                </div>
                <p className="text-slate-500 mb-8 font-medium leading-relaxed">
                  {featuredProduct.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-slate-900">
                    {formatCurrency(featuredProduct.price)}
                  </span>
                  <Link
                    href={`/product/${featuredProduct.id}`}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-colors"
                  >
                    {dict.home.viewDetails}
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 relative bg-slate-100 min-h-75 md:min-h-full">
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </section>
          )}

          {/* Most Selling */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {dict.home.bestSellers}
                  </h2>
                  <p className="text-sm font-medium text-slate-500">
                    {dict.home.mostPopular}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mostSellingProducts.map((product) => (
                <ProductCard key={product.id} product={product} dict={dict} />
              ))}
            </div>
          </section>

          {/* New Arrivals */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {dict.home.newArrivalsTitle}
                  </h2>
                  <p className="text-sm font-medium text-slate-500">
                    {dict.home.freshOffLine}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProducts.map((product) => (
                <ProductCard key={product.id} product={product} dict={dict} />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Product Card Component for Reuse
function ProductCard({ product, dict }: { product: any; dict: any }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 inset-e-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
          <button className="bg-white p-2.5 rounded-xl shadow-xl hover:scale-110 transition-transform text-indigo-600">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg">
              {dict.home.outOfStock}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <p className="font-black text-slate-900 whitespace-nowrap ms-2">
            {formatCurrency(product.price.toFixed(2))}
          </p>
        </div>
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-slate-700">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              ({product.numReviews})
            </span>
          </div>
        )}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {product.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
