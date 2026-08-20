import React, { useState, useEffect, useRef } from 'react';
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
  UploadCloud,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import {
  fetchAllAdminProducts,
  createProductInSupabase,
  updateProductInSupabase,
  deleteProductInSupabase,
  uploadProductImage,
  SupabaseProductForm
} from '../services/productService';
import { Product, CATEGORIES } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

interface AdminPanelProps {
  onBackToStore: () => void;
  onProductsUpdated?: () => void;
}

const emptyForm: SupabaseProductForm = {
  name: '',
  price: '',
  original_price: '',
  discount_percent: '',
  category: 'Dupatta',
  color: '',
  fabric: '',
  pattern: '',
  image: '',
  images: '',
  stock: 10,
  rating: 4.8,
  is_new: true,
  is_trending: false,
  description: ''
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Delete Confirmation Dialog state
  const [deleteCandidate, setDeleteCandidate] = useState<{ id: string | number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setFormData(emptyForm);
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsFormOpen(true);
  };

  const openEditModal = (mappedProd: Product) => {
    setIsEditing(true);
    setEditingId(mappedProd.id);

    const rawRow = rawRows.find((r) => String(r.id) === String(mappedProd.id));

    setFormData({
      id: mappedProd.id,
      name: rawRow?.name ?? rawRow?.Name ?? mappedProd.name,
      price: rawRow?.price ?? rawRow?.Price ?? mappedProd.price,
      original_price: rawRow?.original_price ?? rawRow?.originalPrice ?? mappedProd.originalPrice ?? mappedProd.price,
      discount_percent: rawRow?.discount_percent ?? mappedProd.discount_percent ?? '',
      category: rawRow?.category ?? mappedProd.category ?? 'Dupatta',
      color: rawRow?.color ?? mappedProd.color ?? (mappedProd.colors ? mappedProd.colors.map((c) => c.name).join(', ') : ''),
      fabric: rawRow?.fabric ?? mappedProd.fabric ?? '',
      pattern: rawRow?.pattern ?? mappedProd.pattern ?? '',
      image: rawRow?.image ?? rawRow?.Image_URL ?? mappedProd.image ?? '',
      images: Array.isArray(rawRow?.images) ? rawRow.images.join(', ') : (rawRow?.images ?? (mappedProd.images ? mappedProd.images.join(', ') : '')),
      stock: rawRow?.stock ?? rawRow?.Stock ?? mappedProd.stock ?? 10,
      rating: rawRow?.rating ?? mappedProd.rating ?? 4.8,
      is_new: rawRow?.is_new !== undefined ? Boolean(rawRow.is_new) : mappedProd.isNew ?? true,
      is_trending: rawRow?.is_trending !== undefined ? Boolean(rawRow.is_trending) : mappedProd.isTrending ?? false,
      description: rawRow?.description ?? mappedProd.description ?? ''
    });

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsFormOpen(true);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setErrorMsg(null);

    const res = await uploadProductImage(file);
    setIsUploadingImage(false);

    if (res.error) {
      setErrorMsg(`Image upload failed: ${res.error}`);
    } else if (res.url) {
      setFormData((prev) => ({
        ...prev,
        image: res.url!,
        images: prev.images ? `${prev.images}, ${res.url}` : res.url!
      }));
      setSuccessMsg('Image uploaded to Supabase "products" bucket successfully!');
    }
  };

  const handlePriceChange = (field: 'price' | 'original_price', value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      const p = parseFloat(field === 'price' ? value : String(prev.price)) || 0;
      const op = parseFloat(field === 'original_price' ? value : String(prev.original_price)) || 0;
      if (op > p && p > 0) {
        updated.discount_percent = Math.round(((op - p) / op) * 100);
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Product Name is required.');
      return;
    }
    const priceNum = Number(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMsg('Please enter a valid positive price (> 0).');
      return;
    }
    const stockNum = Number(formData.stock);
    if (isNaN(stockNum) || stockNum < 0) {
      setErrorMsg('Please enter a valid stock quantity (0 or greater).');
      return;
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
      setSuccessMsg(isEditing ? 'Product updated successfully!' : 'Product created in Supabase Products table successfully!');
      setIsFormOpen(false);
      await loadProducts();
      if (onProductsUpdated) {
        onProductsUpdated();
      }
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
      setErrorMsg(`Delete failed: ${res.error}`);
    } else {
      setSuccessMsg(`Product "${deleteCandidate.name}" deleted from Supabase Products table.`);
      setDeleteCandidate(null);
      await loadProducts();
      if (onProductsUpdated) {
        onProductsUpdated();
      }
    }
  };

  // Filter products for admin table
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(adminSearch.toLowerCase()) ||
      (p.fabric && p.fabric.toLowerCase().includes(adminSearch.toLowerCase())) ||
      (p.color && p.color.toLowerCase().includes(adminSearch.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToStore}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>
            <div className="h-4 w-px bg-neutral-700 hidden sm:block" />
            <div>
              <h1 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-gold-400">
                Siba Collection <span className="text-neutral-400 text-xs font-sans font-normal ml-1">Live Database Admin</span>
              </h1>
              <p className="text-[11px] text-neutral-500">
                Connected to Supabase <code class="text-neutral-300 font-mono">Products</code> table & <code class="text-neutral-300 font-mono">products</code> bucket
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/admin.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xl text-xs font-medium transition-colors"
              title="Open Standalone admin.html"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden sm:inline">Standalone</span> admin.html
            </a>

            <button
              onClick={loadProducts}
              disabled={isLoading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors cursor-pointer"
              title="Refresh Products from Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-gold-400' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Banner Feedback Alerts */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-start justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-neutral-400 hover:text-white cursor-pointer font-bold">
              &times;
            </button>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-start justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-neutral-400 hover:text-white cursor-pointer font-bold">
              &times;
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">Total Products</p>
            <p className="text-2xl font-serif font-bold text-gold-400 mt-1">{products.length}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">In Stock Items</p>
            <p className="text-2xl font-serif font-bold text-emerald-400 mt-1">
              {products.filter((p) => (p.stock || 0) > 0).length}
            </p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">New Arrivals</p>
            <p className="text-2xl font-serif font-bold text-brand-400 mt-1">
              {products.filter((p) => p.isNew).length}
            </p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">Categories</p>
            <p className="text-2xl font-serif font-bold text-neutral-100 mt-1">
              {new Set(products.map((p) => p.category)).size}
            </p>
          </div>
        </div>

        {/* Controls Bar: Search & Category Filter */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products, category, fabric..."
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-gold-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">Filter:</span>
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-gold-500 text-neutral-950 font-bold'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Catalog Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-neutral-400 font-medium">Fetching products from Supabase "Products" table...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-3 px-4">
              <Package className="w-10 h-10 text-neutral-600 mx-auto" />
              <p className="text-sm font-serif text-neutral-300">No products found in "Products" table</p>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                {adminSearch || categoryFilter !== 'All'
                  ? 'No results match your filters. Try clearing your search.'
                  : 'Click the "Add Product" button above to add your first product to Supabase.'}
              </p>
              <button
                onClick={openAddModal}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product Now</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3.5">Product</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Fabric & Color</th>
                    <th className="px-4 py-3.5">Price / MRP</th>
                    <th className="px-4 py-3.5">Stock</th>
                    <th className="px-4 py-3.5">Tags</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredProducts.map((p) => {
                    const price = p.price;
                    const origPrice = p.originalPrice || price;
                    const discount = p.discount_percent || 0;
                    const stock = p.stock ?? 10;

                    return (
                      <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-12 object-cover rounded-lg bg-neutral-800 border border-neutral-700/60 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80';
                              }}
                            />
                            <div>
                              <p className="font-semibold text-neutral-100 line-clamp-1">{p.name}</p>
                              <p className="text-[10px] text-neutral-500 font-mono">ID: {p.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-neutral-300 font-medium">{p.category}</td>
                        <td className="px-4 py-3 text-neutral-400">
                          <div>{p.fabric || '—'}</div>
                          <div className="text-[10px] text-neutral-500">{p.color || ''}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-gold-400">₹{price.toLocaleString('en-IN')}</div>
                          {origPrice > price && (
                            <div className="text-[10px] text-neutral-500 line-through">₹{origPrice.toLocaleString('en-IN')}</div>
                          )}
                          {discount > 0 && (
                            <span className="text-[9px] font-bold text-red-400 bg-red-950/80 border border-red-800/60 px-1.5 py-0.5 rounded">
                              {discount}% OFF
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`font-semibold ${
                              stock === 0 ? 'text-red-400' : stock < 5 ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                          >
                            {stock} in stock
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {p.isNew && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-brand-950 text-brand-400 border border-brand-800">
                                NEW
                              </span>
                            )}
                            {p.isTrending && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                                TRENDING
                              </span>
                            )}
                            {!p.isNew && !p.isTrending && <span className="text-[10px] text-neutral-500">—</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-gold-400 transition-colors cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteCandidate({ id: p.id, name: p.name })}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950 text-red-400 transition-colors cursor-pointer"
                              title="Delete Product"
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
              <h2 className="font-serif text-lg font-bold text-gold-400">
                {isEditing ? `Edit Product: ${formData.name}` : 'Add New Product to Supabase'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Name & Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                    Product Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Peach Blossom Chanderi Kurti"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-gold-400"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing: Price, Original Price, Discount Percent */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                    Selling Price (₹) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="1899"
                    value={formData.price}
                    onChange={(e) => handlePriceChange('price', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                    Original Price / MRP (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="2499"
                    value={formData.original_price ?? ''}
                    onChange={(e) => handlePriceChange('original_price', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                    Discount Percent (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="24"
                    value={formData.discount_percent ?? ''}
                    onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              {/* Fabric, Pattern, Color */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Fabric</label>
                  <input
                    type="text"
                    placeholder="e.g. Chanderi Silk, Georgette"
                    value={formData.fabric ?? ''}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Pattern</label>
                  <input
                    type="text"
                    placeholder="e.g. Floral Embroidery, Solid"
                    value={formData.pattern ?? ''}
                    onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Color</label>
                  <input
                    type="text"
                    placeholder="e.g. Peach Pink, Soft Cream"
                    value={formData.color ?? ''}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              {/* Image Upload to Supabase Storage "products" Bucket */}
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase text-neutral-300">
                    Product Image <span className="text-gold-400">(Uploads to Supabase "products" bucket)</span>
                  </label>
                  {isUploadingImage && (
                    <span className="text-[11px] text-gold-400 flex items-center gap-1.5 animate-pulse">
                      <div className="w-2.5 h-2.5 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                      Uploading image...
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-gold-400 text-xs font-semibold rounded-xl border border-neutral-700 cursor-pointer transition-colors shrink-0"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Image File</span>
                  </button>
                  <span className="text-xs text-neutral-500">or enter image URL directly below:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">
                      Main Image URL <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-gold-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Additional Image URLs (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="https://..., https://..."
                      value={typeof formData.images === 'string' ? formData.images : (Array.isArray(formData.images) ? formData.images.join(', ') : '')}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                {formData.image && (
                  <div className="flex items-center gap-3 pt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-12 h-14 object-cover rounded-lg border border-neutral-700 bg-neutral-900"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="text-[11px] text-emerald-400 font-semibold">Image Ready</span>
                  </div>
                )}
              </div>

              {/* Stock, Rating, Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">
                    Stock Quantity <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="10"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400 mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    placeholder="4.8"
                    value={formData.rating ?? 4.8}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="pt-4 flex items-center">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.is_new}
                      onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                      className="w-4 h-4 rounded text-gold-500 focus:ring-gold-500 bg-neutral-950 border-neutral-700"
                    />
                    <span className="text-xs font-semibold text-neutral-300">Is New Arrival (is_new)</span>
                  </label>
                </div>

                <div className="pt-4 flex items-center">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.is_trending}
                      onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                      className="w-4 h-4 rounded text-gold-500 focus:ring-gold-500 bg-neutral-950 border-neutral-700"
                    />
                    <span className="text-xs font-semibold text-neutral-300">Is Trending (is_trending)</span>
                  </label>
                </div>
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
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                      <span>Saving to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isEditing ? 'Update in Products Table' : 'Save to Products Table'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-neutral-200">
            <h3 className="font-serif text-lg font-bold text-red-400">Confirm Product Deletion</h3>
            <p className="text-xs text-neutral-400 mt-2">
              Are you sure you want to permanently delete <strong className="text-neutral-100">"{deleteCandidate.name}"</strong> from the Supabase <code className="text-gold-400 font-mono">Products</code> table?
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
