import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Offers from './components/Offers';
import ProductCard from './components/ProductCard';
import QuickViewModal from './components/QuickViewModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CheckoutModal from './components/CheckoutModal';
import Features from './components/Features';
import Footer from './components/Footer';
import {
  fetchLiveProductsFromGoogleSheet,
  matchesCategoryFilter,
  GOOGLE_SHEET_CSV_URL
} from './services/googleSheetService';
import { Product, CartItem, CATEGORIES } from './types';
import { Sparkles, RefreshCw, MessageCircle, AlertCircle, ShoppingBag, Layers } from 'lucide-react';

export default function App() {
  // Store products from Google Sheets CSV (100% live database)
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(true);
  const [productsFetchError, setProductsFetchError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Persistence using local storage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('siba_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlistItems, setWishlistItems] = useState<Product[]>(() => {
    const saved = localStorage.getItem('siba_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeSection, setActiveSection] = useState('home');

  // UI Control states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutPromoCode, setCheckoutPromoCode] = useState('');
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);

  // Function to load live products dynamically from Google Sheet CSV
  const loadLiveSheetProducts = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setIsProductsLoading(true);
    setProductsFetchError(null);

    const res = await fetchLiveProductsFromGoogleSheet();
    if (res.error) {
      console.error('Failed to fetch from Google Sheet:', res.error);
      setProductsFetchError(res.error);
    } else {
      setProducts(res.products || []);
      setLastSyncTime(res.lastUpdated);
    }
    setIsProductsLoading(false);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    loadLiveSheetProducts();
  }, [loadLiveSheetProducts]);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('siba_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('siba_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Set page title & Favicon
  useEffect(() => {
    const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" fill="none">
  <rect width="500" height="500" rx="100" fill="#111827" />
  <circle cx="250" cy="250" r="210" fill="none" stroke="#e84167" stroke-width="12" />
  <text x="250" y="270" font-family="serif" font-size="240" font-weight="900" fill="#ffffff" text-anchor="middle">S</text>
  <text x="250" y="380" font-family="sans-serif" font-size="44" font-weight="800" fill="#e84167" text-anchor="middle" letter-spacing="8">SIBA</text>
</svg>
`.trim();
    const link = (document.querySelector("link[rel~='icon']") || document.createElement('link')) as HTMLLinkElement;
    link.type = 'image/svg+xml';
    link.rel = 'icon';
    link.href = 'data:image/svg+xml;utf8,' + encodeURIComponent(faviconSvg);
    document.getElementsByTagName('head')[0].appendChild(link);
    document.title = "Siba Collection, Road No. 5 Mahesh Babu Chowk Muzaffarpur - Best Dupatta 99, Stoll, Hijab, Kurti Shop";
  }, []);

  // Compute category counts for Meesho / Flipkart style (12) badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      if (cat === 'All') {
        counts[cat] = products.length;
      } else {
        counts[cat] = products.filter((p) => matchesCategoryFilter(p.category, cat)).length;
      }
    }
    return counts;
  }, [products]);

  // Navigate actions with smooth scrolling support
  const handleNavigate = (section: string) => {
    setActiveSection(section);
    
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveCategory('All');
    } else if (section === 'shop') {
      const element = document.getElementById('shop-product-grid');
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveCategory('All');
    } else if (section === 'dupatta') {
      const element = document.getElementById('shop-product-grid');
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveCategory('Dupatta Banarasi & Fancy');
    } else if (section === 'hijab-naqab') {
      const element = document.getElementById('shop-product-grid');
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveCategory('Hijab');
    } else if (section === 'kids-wear') {
      const element = document.getElementById('shop-product-grid');
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveCategory('Bache Ka Kapra');
    } else if (section === 'new-arrivals') {
      const element = document.getElementById('shop-product-grid');
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveCategory('All');
    } else if (section === 'sale') {
      const element = document.getElementById('shop-product-grid');
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveCategory('All');
    } else if (section === 'about-us' || section === 'contact-us') {
      const element = document.getElementById('brand-footer');
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Add to Cart helper
  const handleAddToCart = (
    product: Product,
    qty: number = 1,
    size?: string,
    color?: string
  ) => {
    const finalSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size');
    const finalColor = color || product.color || 'Standard';

    const existingIndex = cartItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === finalSize &&
        item.selectedColor?.name === finalColor
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += qty;
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          product,
          quantity: qty,
          selectedSize: finalSize,
          selectedColor: { name: finalColor, hex: '#e84167' }
        }
      ]);
    }
  };

  const handleDirectAddToCart = (product: Product) => {
    handleAddToCart(product, 1);
  };

  const handleUpdateCartQty = (index: number, newQty: number) => {
    const updated = [...cartItems];
    updated[index].quantity = newQty;
    setCartItems(updated);
  };

  const handleRemoveCartItem = (index: number) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
  };

  const handleWishlistToggle = (product: Product) => {
    const isAlreadyWishlisted = wishlistItems.some((item) => item.id === product.id);
    if (isAlreadyWishlisted) {
      setWishlistItems(wishlistItems.filter((item) => item.id !== product.id));
    } else {
      setWishlistItems([...wishlistItems, product]);
    }
  };

  const handleRemoveWishlistItem = (id: string) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  // Cart proceeds to checkout
  const handleCheckoutInitiate = (discount: number, code: string) => {
    setCheckoutDiscount(discount);
    setCheckoutPromoCode(code);
    setCheckoutItems(cartItems);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    if (checkoutItems === cartItems) {
      setCartItems([]);
    }
    setCheckoutItems([]);
  };

  // Filter logic with robust subcategory support
  const filteredProducts = products.filter((product) => {
    const matchesCategory = matchesCategoryFilter(product.category, activeCategory);

    // Search query check
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (product.title || product.name || '').toLowerCase().includes(query) ||
      (product.category || '').toLowerCase().includes(query) ||
      (product.fabric || '').toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-950 flex justify-center items-start">
      {/* Strictly mobile-first max-w-[480px] centered view */}
      <div className="w-full max-w-[480px] min-h-screen bg-white text-gray-900 font-sans flex flex-col justify-between shadow-2xl relative overflow-x-hidden border-x border-neutral-800/40">
        
        {/* Dynamic Header & Promo Area */}
        <Navbar
          cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          wishlistCount={wishlistItems.length}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
          onNavigate={handleNavigate}
          activeSection={activeSection}
        />

        {/* Live Google Sheet Sync Bar */}
        <div className="bg-neutral-900 text-white px-3 py-1.5 flex items-center justify-between text-[10px] border-b border-neutral-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-gray-200">Google Sheet Live DB:</span>
            <span className="text-brand-300 font-semibold">{products.length} Products</span>
          </div>
          <button
            onClick={() => loadLiveSheetProducts(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1 text-[9px] bg-neutral-800 hover:bg-neutral-700 text-gray-200 px-2 py-0.5 rounded border border-neutral-700 active:scale-95 transition-all cursor-pointer"
            title="Fetch latest prices and products from Google Sheets"
          >
            <RefreshCw className={`w-2.5 h-2.5 ${isRefreshing ? 'animate-spin text-brand-400' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Sheet'}</span>
          </button>
        </div>

        {/* Hero Banner Section */}
        <Hero
          onShopClick={() => handleNavigate('shop')}
          onContactClick={() => handleNavigate('contact-us')}
        />

        {/* Categories Panel Section with 12 clean circle categories and real-time item counts */}
        <Categories
          activeCategory={activeCategory}
          categoryCounts={categoryCounts}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            const element = document.getElementById('shop-product-grid');
            element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />

        {/* Offers Section */}
        <Offers
          onPromoClick={(categoryFilter) => {
            setActiveCategory(categoryFilter);
            const element = document.getElementById('shop-product-grid');
            element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />

        {/* Primary Products Grid Section */}
        <main id="shop-product-grid" className="py-6 bg-white border-t border-brand-100/40">
          <div className="w-full px-3 sm:px-4">
            
            {/* Shop Header */}
            <div className="border-b border-brand-100 pb-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-500" />
                  SIBA COLLECTION • LIVE INVENTORY
                </span>
                {lastSyncTime && (
                  <span className="text-[9px] text-gray-400 font-mono">
                    Updated {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <h2 className="font-serif text-lg sm:text-xl font-black text-gray-950 tracking-tight leading-tight">
                  {activeCategory === 'All' ? 'All Modest Collection' : activeCategory}
                </h2>
                <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200/60">
                  {filteredProducts.length} Items
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5 font-normal">
                Explore authentic modest wear from Siba Collection.
              </p>

              {/* Exact 14 Category Filter Buttons with Flipkart/Meesho item count - Highlights for Dupatta */}
              <div className="flex flex-wrap items-center gap-1.5 pt-3.5">
                {CATEGORIES.map((tab) => {
                  const isActive = activeCategory === tab;
                  const count = categoryCounts[tab] ?? 0;
                  const isDupatta = tab.toLowerCase().includes('dupatta');

                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveCategory(tab)}
                      className={`text-[11px] px-3 py-1.5 rounded-full font-bold transition-all border whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-neutral-950 border-neutral-950 text-white shadow-xs'
                          : isDupatta
                          ? 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100 hover:border-amber-400'
                          : 'bg-brand-50/70 border-brand-200/80 text-gray-800 hover:border-brand-400 hover:bg-brand-100/50'
                      }`}
                    >
                      <span>{tab}</span>
                      <span
                        className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-extrabold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : isDupatta
                            ? 'bg-amber-200/80 text-amber-950'
                            : 'bg-brand-100 text-brand-800'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Banner if Google Sheet fetch failed */}
            {productsFetchError && (
              <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-[11px]">{productsFetchError}</span>
                </div>
                <button
                  onClick={() => loadLiveSheetProducts(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] cursor-pointer shrink-0"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {/* Grid Layout or Loading Spinner */}
            {isProductsLoading ? (
              <div className="py-16 text-center space-y-2">
                <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-brand-700">Connecting to Google Sheet...</p>
                <p className="text-[10px] text-gray-500 font-mono">Fetching live pricing & stock</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              /* Empty Grid Results */
              <div className="text-center py-12 bg-brand-50/20 rounded-2xl border border-dashed border-brand-200 px-4">
                <p className="text-sm font-serif italic text-gray-700">
                  {products.length === 0
                    ? 'No products found in Google Sheet.'
                    : `No products found in category "${activeCategory}"${searchQuery ? ` matching "${searchQuery}"` : ''}.`}
                </p>
                <div className="mt-3 flex flex-col items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('All');
                    }}
                    className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-full shadow cursor-pointer"
                  >
                    View All Collection ({products.length})
                  </button>
                </div>
              </div>
            ) : (
              /* Product cards grid - Strictly 2 products per row */
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistItems.some((item) => item.id === product.id)}
                    onWishlistToggle={() => handleWishlistToggle(product)}
                    onAddToCart={() => handleDirectAddToCart(product)}
                    onQuickView={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            )}

          </div>
        </main>

        {/* Brand Features bar */}
        <Features />

        {/* Dynamic Siba Footer */}
        <Footer onNavigate={handleNavigate} />

        {/* Modals & Slide-over Drawers */}
        
        {/* Product Quick View Modal */}
        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(qty, size, color) => {
            if (selectedProduct) {
              handleAddToCart(selectedProduct, qty, size, color);
            }
          }}
          onWishlistToggle={() => selectedProduct && handleWishlistToggle(selectedProduct)}
          isWishlisted={selectedProduct ? wishlistItems.some((item) => item.id === selectedProduct.id) : false}
        />

        {/* Shopping Bag sliding drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQty={handleUpdateCartQty}
          onRemoveItem={handleRemoveCartItem}
          onCheckout={handleCheckoutInitiate}
        />

        {/* Wishlist sliding drawer */}
        <WishlistDrawer
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          wishlistItems={wishlistItems}
          onRemoveItem={handleRemoveWishlistItem}
          onAddToCart={handleDirectAddToCart}
        />

        {/* Checkout Form & Order Success Modal */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cartItems={checkoutItems.length > 0 ? checkoutItems : cartItems}
          discountAmount={checkoutDiscount}
          promoApplied={checkoutPromoCode}
          onOrderSuccess={handleOrderSuccess}
        />

        {/* Floating WhatsApp Quick Order Button */}
        <a
          href="https://wa.me/918210941262?text=Assalamu%20Alaikum%20Siba%20Collection!%20I%20want%20to%20enquire%20about%20your%20products."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-4 z-40 bg-[#25D366] text-white p-3 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center border-2 border-white"
          aria-label="Order on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
        </a>

      </div>
    </div>
  );
}
