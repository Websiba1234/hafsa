import React, { useState, useEffect } from 'react';
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
import AdminPanel from './components/AdminPanel';
import { fetchVisitorProducts } from './services/productService';
import { Product, CartItem, PRODUCTS } from './types';
import { Heart, Sparkles, Filter, ChevronRight, MessageCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Store products from Supabase
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(true);
  const [productsFetchError, setProductsFetchError] = useState<string | null>(null);

  // URL Path & Section state
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);

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
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSection, setActiveSection] = useState(() => (window.location.pathname === '/admin' ? 'admin' : 'home'));

  // UI Control states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutPromoCode, setCheckoutPromoCode] = useState('');
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);

  // Function to load visitor products from Supabase
  const loadVisitorProducts = async () => {
    setIsProductsLoading(true);
    setProductsFetchError(null);
    const res = await fetchVisitorProducts();
    if (res.error && res.error !== 'SUPABASE_NOT_CONFIGURED') {
      console.error('Failed to fetch visitor products from Supabase:', res.error);
      setProductsFetchError(`Could not load live products from Supabase (${res.error}).`);
    } else if (res.products && res.products.length > 0) {
      setProducts(res.products);
    } else {
      // If table is empty or Supabase isn't configured yet, fallback to default mock products
      setProducts(PRODUCTS);
    }
    setIsProductsLoading(false);
  };

  useEffect(() => {
    loadVisitorProducts();

    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      if (path === '/admin') {
        setActiveSection('admin');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('siba_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('siba_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Dynamically set premium gold-and-black favicon and page title
  useEffect(() => {
    const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" fill="none">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3D6" />
      <stop offset="50%" stop-color="#DFAC6C" />
      <stop offset="100%" stop-color="#8A5A1C" />
    </linearGradient>
    <linearGradient id="s" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8A5A1C" />
      <stop offset="50%" stop-color="#FFF3D6" />
      <stop offset="100%" stop-color="#A8742A" />
    </linearGradient>
  </defs>
  <circle cx="250" cy="250" r="235" fill="#0c0a09" />
  <circle cx="250" cy="250" r="225" fill="none" stroke="url(#g)" stroke-width="12" />
  <circle cx="250" cy="250" r="210" fill="none" stroke="url(#g)" stroke-width="3" opacity="0.8" />
  <text x="250" y="240" font-family="'Cinzel', serif" font-size="220" font-weight="700" fill="url(#s)" text-anchor="middle">S</text>
  <line x1="120" y1="285" x2="380" y2="285" stroke="url(#g)" stroke-width="5" />
  <text x="250" y="345" dx="6" font-family="'Cinzel', serif" font-size="44" font-weight="700" fill="url(#s)" text-anchor="middle" letter-spacing="14">COLLECTION</text>
</svg>
`.trim();
    const link = (document.querySelector("link[rel~='icon']") || document.createElement('link')) as HTMLLinkElement;
    link.type = 'image/svg+xml';
    link.rel = 'icon';
    link.href = 'data:image/svg+xml;utf8,' + encodeURIComponent(faviconSvg);
    document.getElementsByTagName('head')[0].appendChild(link);
    
    // Set page title
    document.title = "Siba Collection | Premium Women's Fashion Store";
  }, []);

  // Navigate actions with smooth scrolling support
  const handleNavigate = (section: string) => {
    setActiveSection(section);
    
    if (section === 'admin') {
      window.history.pushState({}, '', '/admin');
      setCurrentPath('/admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentPath === '/admin') {
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
    }

    // Smooth scroll for anchors
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveCategory('All');
    } else if (section === 'shop') {
      const element = document.getElementById('shop-product-grid');
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveCategory('All');
    } else if (section === 'clothing') {
      const element = document.getElementById('shop-product-grid');
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveCategory('Kurtis');
    } else if (section === 'accessories') {
      const element = document.getElementById('shop-product-grid');
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveCategory('Accessories');
    } else if (section === 'new-arrivals') {
      const element = document.getElementById('shop-product-grid');
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveCategory('New Arrivals');
    } else if (section === 'sale') {
      const element = document.getElementById('shop-product-grid');
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveCategory('Sale');
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
    color?: { name: string; hex: string }
  ) => {
    // Default size selection if not provided
    const finalSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
    // Default color selection if not provided
    const finalColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);

    const existingIndex = cartItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === finalSize &&
        item.selectedColor?.name === finalColor?.name
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
          selectedColor: finalColor
        }
      ]);
    }
  };

  // Direct quick add-to-cart from product cards or wishlist
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

  // Direct Buy Now handler for single product checkout
  const handleBuyNow = (
    product: Product,
    qty: number = 1,
    size?: string,
    color?: { name: string; hex: string }
  ) => {
    const finalSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
    const finalColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);

    const buyNowItem: CartItem = {
      product,
      quantity: qty,
      selectedSize: finalSize,
      selectedColor: finalColor
    };

    setCheckoutItems([buyNowItem]);
    setCheckoutDiscount(0);
    setCheckoutPromoCode('');
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    // Clear cart if checkout originated from cart
    if (checkoutItems === cartItems) {
      setCartItems([]);
    }
    setCheckoutItems([]);
  };

  // Filter logic for grid using live Supabase products
  const filteredProducts = products.filter((product) => {
    // Category check
    let matchesCategory = true;
    if (activeCategory === 'New Arrivals') {
      matchesCategory = !!product.isNew;
    } else if (activeCategory === 'Sale') {
      matchesCategory = !!product.discountBadge;
    } else if (activeCategory !== 'All') {
      matchesCategory = product.category === activeCategory;
    }

    // Search query check
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Render Admin Panel route
  if (currentPath === '/admin' || activeSection === 'admin') {
    return (
      <AdminPanel
        onBackToStore={() => handleNavigate('home')}
        onProductsUpdated={loadVisitorProducts}
      />
    );
  }

  return (
    <div className="min-h-screen bg-brand-50/15 text-gray-900 font-sans flex flex-col justify-between">
      
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

      {/* Hero Banner Section (Completely model-free, human-free abstract luxury fabric bg) */}
      <Hero
        onShopClick={() => handleNavigate('shop')}
        onContactClick={() => handleNavigate('contact-us')}
      />

      {/* Categories Panel Section */}
      <Categories
        activeCategory={activeCategory}
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
      <main id="shop-product-grid" className="py-10 sm:py-16 bg-white border-t border-brand-100/40">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          
          {/* Shop Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-brand-100 pb-6 mb-8 sm:mb-10 gap-6">
            <div>
              <span className="text-xs font-bold text-brand-500 uppercase tracking-widest inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                SIBA COLLECTION EXCLUSIVE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mt-1">
                {activeCategory === 'All' ? 'Latest Fashion Collection' : `${activeCategory}`}
              </h2>
              <p className="text-xs text-gray-500 mt-2 font-light">
                Showing {filteredProducts.length} premium model-free product displays.
              </p>
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mr-2 hidden sm:inline flex items-center gap-1">
                <Filter className="w-3 h-3 text-brand-500" />
                Filter by:
              </span>
              {['All', 'Kurtis', 'Dresses', 'Tops', 'Bottom Wear', 'Bags', 'Jewellery', 'Accessories'].map((tab) => {
                const isActive = activeCategory === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveCategory(tab)}
                    className={`text-xs px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full font-semibold transition-all border cursor-pointer ${
                      isActive
                        ? 'bg-brand-600 border-brand-600 text-white shadow-md shadow-brand-100'
                        : 'bg-brand-50/50 border-brand-100 text-gray-600 hover:border-brand-300'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Banner if Supabase fetch failed */}
          {productsFetchError && (
            <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{productsFetchError}</span>
              </div>
              <button
                onClick={loadVisitorProducts}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Grid Layout or Loading Spinner */}
          {isProductsLoading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-medium text-brand-700">Loading products from Supabase...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Empty Grid Results */
            <div className="text-center py-20 bg-brand-50/20 rounded-3xl border border-dashed border-brand-200">
              <p className="text-base font-serif italic text-gray-500">
                No products found matching "{searchQuery}".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="mt-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full shadow cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (

            /* Product cards grid */
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistItems.some((item) => item.id === product.id)}
                  onWishlistToggle={() => handleWishlistToggle(product)}
                  onAddToCart={() => handleDirectAddToCart(product)}
                  onBuyNow={() => handleBuyNow(product, 1)}
                  onQuickView={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Brand Features bar */}
      <Features />

      {/* Dynamic Siba Footer (Includes Maps and write to us) */}
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
        onBuyNow={(qty, size, color) => {
          if (selectedProduct) {
            handleBuyNow(selectedProduct, qty, size, color);
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

    </div>
  );
}
