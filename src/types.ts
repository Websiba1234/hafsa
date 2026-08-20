export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  original_price?: number;
  discount_percent?: number;
  rating: number;
  reviewCount?: number;
  image: string;
  images?: string[];
  hoverImage?: string;
  description?: string;
  details?: string[];
  fabric?: string;
  pattern?: string;
  color?: string;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  isNew?: boolean;
  is_new?: boolean;
  isTrending?: boolean;
  is_trending?: boolean;
  isBestSeller?: boolean;
  discountBadge?: string;
  stock?: number;
  sku?: string;
  isAvailable?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: { name: string; hex: string };
}

export const CATEGORIES = [
  'Dupatta',
  'Hijab',
  'Naqab',
  'Dastarkhan',
  'Trouser',
  'Nicker / Underwear',
  'Sando / Ganji',
  'Stoll / Shawl',
  'Rumal',
  'Nighty',
  'Kurti',
  'Bache Ka Kapra'
] as const;

// No hardcoded fake data - the website is dynamic from Supabase
export const PRODUCTS: Product[] = [];

