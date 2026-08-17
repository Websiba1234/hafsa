import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Search,
  Package,
  Layers,
  Check,
  X,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import {
  fetchAllAdminProducts,
  createProductInSupabase,
  updateProductInSupabase,
  deleteProductInSupabase,
  SupabaseProductForm
} from '../services/productService';
import { Product, CATEGORIES } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

interface AdminPanelProps {
  onBackToStore: () => void;
  onProductsUpdated?: () => void;
}

const emptyForm: SupabaseProductForm = {
  Name: '',
  Price: '',
  Description: '',
  Image_URL: '',
  Stock: 10,
  Sku: '',
  category: 'Kurtis',
  color: '',
  discount_price: '',
  is_available: true,
  size: 'S, M, L, XL'
};

export default function AdminPanel({ onBackToStore, onProductsUpdated }: AdminPanelProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [rawRows, setRawRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Search & Filter in Admin
  const [adminSearch, setAdminSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Form Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState<SupabaseProductForm>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation Dialog state
  const [deleteCandidate, setDeleteCandidate] = useState<{ id: string | number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProducts = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    const result = await fetchAllAdminProducts();
    if (result.error) {
      setErrorMsg(`Error loading products: ${result.error}`);
    } else {
      setRawRows(result.rawRows);
      setProducts(result.mappedProducts);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      ...emptyForm,
      Sku: `SIBA-${Math.floor(1000 + Math.random() * 9000)}`
    });
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsFormOpen(true);
  };

  const openEditModal = (mappedProd: Product) => {
    setIsEditing(true);
    setEditingId(mappedProd.id);

    // Find original raw row if available for exact DB fields
    const rawRow = rawRows.find((r) => String(r.id) === String(mappedProd.id));

    setFormData({
      id: mappedProd.id,
      Name: rawRow?.Name ?? mappedProd.name,
      Price: rawRow?.Price ?? mappedProd.originalPrice ?? mappedProd.price,
      Description: rawRow?.Description ?? mappedProd.description ?? '',
      Image_URL: rawRow?.Image_URL ?? mappedProd.image ?? '',
      Stock: rawRow?.Stock ?? mappedProd.stock ?? 10,
      Sku: rawRow?.Sku ?? mappedProd.sku ?? '',
      category: rawRow?.category ?? mappedProd.category ?? 'Kurtis',
      color: rawRow?.color ?? (mappedProd.colors ? mappedProd.colors.map((c) => c.name).join(', ') : ''),
      discount_price: rawRow?.discount_price ?? (mappedProd.price < mappedProd.originalPrice ? mappedProd.price : ''),
      is_available: rawRow?.is_available !== undefined ? Boolean(rawRow.is_available) : mappedProd.isAvailable ?? true,
      size: rawRow?.size ?? (mappedProd.sizes ? mappedProd.sizes.join(', ') : 'S, M, L, XL')
    });

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Name.trim()) {
      setErrorMsg('Product Name is required.');
      return;
    }
    const priceNum = Number(formData.Price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMsg('Please enter a valid positive price (> 0).');
      return;
    }
    const stockNum = Number(formData.Stock);
    if (isNaN(stockNum) || stockNum < 0) {
      setErrorMsg('Please enter a valid stock quantity (0 or greater).');
      return;
    }
    if (formData.discount_price !== '' && formData.discount_price !== null && formData.discount_price !== undefined) {
      const discountNum = Number(formData.discount_price);
      if (isNaN(discountNum) || discountNum < 0) {
        setErrorMsg('Please enter a valid non-negative discount price.');
        return;
      }
      if (discountNum >= priceNum) {
        setErrorMsg('Discount price must be less than regular price.');
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    let res;
    if (isEditing && editingId !== null) {
      res = await updateProductInSupabase(editingId, formData);
    } else {
      res = await createProductInSupabase(formData);
    }

    setIsSubmitting(false);

    if (res.error) {
      setErrorMsg(`Operation failed: ${res.error}`);
    } else {
      setSuccessMsg(isEditing ? 'Product updated successfully!' : 'Product created successfully!');
      setIsFormOpen(false);
      await loadProducts();
      if (onProductsUpdated) onProductsUpdated();
    }
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await deleteProductInSupabase(deleteCandidate.id);
    setIsDeleting(false);

    if (res.error) {
      setErrorMsg(`Failed to delete product: ${res.error}`);
    } else {
      setSuccessMsg(`Product "${deleteCandidate.name}" deleted successfully.`);
      setDeleteCandidate(null);
      await loadProducts();
      if (onProductsUpdated) onProductsUpdated();
    }
  };

  // Filtered list for search in admin table
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(adminSearch.toLowerCase())) ||
      p.category.toLowerCase().includes(adminSearch.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans antialiased pb-20">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={onBackToStore}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 hover:text-amber-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-amber-200">
                Siba Collection Admin Panel
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={loadProducts}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* Supabase Status Banner if missing */}
        {!isSupabaseConfigured && (
          <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-800/80 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-300">Supabase Credentials Not Configured in Environment</p>
              <p className="mt-1 text-amber-200/80">
                Please set <code className="bg-neutral-900 px-1.5 py-0.5 rounded text-amber-400 font-mono">VITE_SUPABASE_URL</code> and{' '}
                <code className="bg-neutral-900 px-1.5 py-0.5 rounded text-amber-400 font-mono">VITE_SUPABASE_ANON_KEY</code> in AI Studio settings or .env file to enable live database writes.
              </p>
            </div>
          </div>
        )}

        {/* Global Notifications */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/70 border border-red-800/80 text-red-200 text-xs sm:text-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800/80 text-emerald-200 text-xs sm:text-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search & Stats Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search product name, category, SKU..."
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500/80"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500/80"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400" />
              <span className="text-neutral-400">Total Products:</span>
            </div>
            <span className="font-bold text-amber-300">{products.length}</span>
          </div>
        </div>

        {/* Table / List View */}
        <div className="bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-neutral-400">Fetching products from Supabase...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3 px-4">
              <Layers className="w-10 h-10 text-neutral-600 mx-auto" />
              <p className="text-sm font-medium text-neutral-300">No products found</p>
              <p className="text-xs text-neutral-500">
                {products.length === 0
                  ? 'Your Supabase "Product" table is currently empty. Click "Add New Product" to add your first item.'
                  : 'No products match your search filters.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3.5">Product</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Price (₹)</th>
                    <th className="px-4 py-3.5">Stock</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredProducts.map((product) => {
                    const isAvailable = product.isAvailable ?? true;
                    const stock = product.stock ?? 0;

                    return (
                      <tr key={product.id} className="hover:bg-neutral-900/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-12 object-cover rounded-lg bg-neutral-800 border border-neutral-700/60 shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-neutral-100 line-clamp-1">{product.name}</p>
                              <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                                SKU: {product.sku || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-neutral-400">{product.category}</td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-amber-300">
                            ₹{product.price.toLocaleString('en-IN')}
                          </div>
                          {product.originalPrice > product.price && (
                            <div className="text-[10px] text-neutral-500 line-through">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`font-semibold ${
                              stock === 0
                                ? 'text-red-400'
                                : stock < 5
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {stock} pcs
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {isAvailable ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-400 border border-neutral-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
                              Hidden / Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(product)}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteCandidate({ id: product.id, name: product.name })}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950/80 text-red-400 transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-neutral-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h2 className="font-serif text-lg font-bold text-amber-200">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Silk Chanderi Anarkali"
                  value={formData.Name}
                  onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Price & Discount Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                    Regular Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 2499"
                    value={formData.Price}
                    onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                    Discount Price (₹) <span className="text-neutral-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1899"
                    value={formData.discount_price ?? ''}
                    onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Category & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="e.g. 15"
                    value={formData.Stock}
                    onChange={(e) => setFormData({ ...formData, Stock: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.Image_URL}
                  onChange={(e) => setFormData({ ...formData, Image_URL: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
                {formData.Image_URL && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={formData.Image_URL}
                      alt="Preview"
                      className="w-12 h-14 object-cover rounded-lg border border-neutral-800"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="text-[10px] text-neutral-400">Image preview</span>
                  </div>
                )}
              </div>

              {/* SKU & Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SIBA-KRT-101"
                    value={formData.Sku}
                    onChange={(e) => setFormData({ ...formData, Sku: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                    Colors <span className="text-neutral-500 font-normal">(Comma separated)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Peach Pink, Soft Cream"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Sizes & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                    Sizes <span className="text-neutral-500 font-normal">(Comma separated)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. S, M, L, XL, XXL"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.is_available}
                      onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-neutral-950 border-neutral-800"
                    />
                    <div>
                      <span className="text-xs font-semibold text-neutral-200">Is Available / Visible</span>
                      <p className="text-[10px] text-neutral-400">Checked = Show on website storefront</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter details about fabric, embroidery, occasion..."
                  value={formData.Description}
                  onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isEditing ? 'Update Product' : 'Save Product'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 text-neutral-200 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <Trash2 className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-bold text-neutral-100">Confirm Product Deletion</h3>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Kya aap sach mein <span className="font-bold text-amber-300">"{deleteCandidate.name}"</span> ko delete karna chahte hain? Ye action undo nahi kiya ja sakta.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
              <button
                disabled={isDeleting}
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={confirmDelete}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
