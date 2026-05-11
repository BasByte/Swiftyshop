"use client";

import { useState } from "react";
import { formatCurrency } from "@/src/lib/utils";
import { Edit2, Trash2, Plus, X, Upload, MoreVertical } from "lucide-react";
import { updateProduct, deleteProduct, createProduct } from "@/src/app/actions";

export default function ProductTable({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const imageFile = formData.get("imageFile") as File | null;
      const imageUrl = (imageFile && imageFile.size > 0) ? URL.createObjectURL(imageFile) : formData.get("image");
      
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        
        // Optimistic update
        setProducts(products.map(p => p.id === editingProduct.id ? {
          ...p,
          name: formData.get("name"),
          description: formData.get("description"),
          price: parseFloat(formData.get("price") as string),
          category: formData.get("category"),
          image: imageUrl,
          stock: parseInt(formData.get("stock") as string)
        } : p));
      } else {
        const result = await createProduct(formData);
        if (result.success) {
          // Just reload the page or add optimistically
          window.location.reload();
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Products</h1>
           <p className="text-sm text-slate-500 font-medium">Manage your store catalog</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="px-5 py-2.5 flex items-center gap-2 rounded-lg bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[12px] font-black uppercase tracking-widest text-slate-700 border-b border-slate-100">
                <th className="px-8 py-5">Product</th>
                <th className="px-8 py-5 text-right">Price</th>
                <th className="px-8 py-5 text-right">Stock</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg border border-slate-200 overflow-hidden shrink-0 bg-slate-100">
                       <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{product.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{product.category}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-slate-900 text-right">{formatCurrency(product.price)}</td>
                  <td className="px-8 py-6 text-right">
                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${product.stock < 10 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                      {product.stock} Units
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => handleOpenEdit(product)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs font-medium text-slate-500">
              Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to <span className="font-bold text-slate-900">{Math.min(startIndex + itemsPerPage, products.length)}</span> of <span className="font-bold text-slate-900">{products.length}</span> results
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Product Name</label>
                    <input 
                      required 
                      type="text" 
                      name="name"
                      defaultValue={editingProduct?.name}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium" 
                      placeholder="e.g. Wireless Headphones"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                    <input 
                      required 
                      type="text" 
                      name="category"
                      defaultValue={editingProduct?.category}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium" 
                      placeholder="e.g. Electronics"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    required 
                    name="description"
                    defaultValue={editingProduct?.description}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium resize-none" 
                    placeholder="Describe your product..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Price (DA)</label>
                    <input 
                      required 
                      type="number" 
                      step="0.01"
                      min="0"
                      name="price"
                      defaultValue={editingProduct?.price}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium" 
                      placeholder="299.99"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Stock Quantity</label>
                    <input 
                      required 
                      type="number" 
                      min="0"
                      name="stock"
                      defaultValue={editingProduct?.stock}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium" 
                      placeholder="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Image Source</label>
                  <div className="space-y-3">
                    <div className="relative">
                      <input 
                        type="url" 
                        name="image"
                        defaultValue={editingProduct?.image}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-12 pe-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium" 
                        placeholder="Image URL (e.g., https://...)"
                      />
                      <Upload className="absolute inset-s-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="h-px bg-slate-200 flex-1"></div>
                       <span className="text-[12px] uppercase font-bold text-slate-400">OR UPLOAD</span>
                       <div className="h-px bg-slate-200 flex-1"></div>
                    </div>
                    <div>
                      <input 
                        type="file" 
                        name="imageFile"
                        accept="image/*"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:uppercase file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all font-medium text-slate-600"
                      />
                    </div>
                  </div>
                  <p className="text-[12px] text-slate-400 mt-2 font-medium">Provide either an image URL or upload a file.</p>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 rounded-xl text-sm font-bold uppercase tracking-widest  transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg shadow-indigo-500/30 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
