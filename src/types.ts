export interface Product {
  id: string;
  productId?: string;
  name: string;
  title?: string;
  price: number;
  originalPrice: number;
  original_price?: number;
  discountBadge?: string;
  discountPercent?: number;
  discount_percent?: number;
  image: string;
  images: string[];
  hoverImage?: string;
  hasValidImage?: boolean;
  category: string;
  color?: string;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  fabric?: string;
  pattern?: string;
  details?: string[];
  description?: string;
  stockText?: string;
  stock: number;
  isAvailable: boolean;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  is_new?: boolean;
  isTrending?: boolean;
  is_trending?: boolean;
  isBestSeller?: boolean;
  is_best_seller?: boolean;
  sku?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string | { name: string; hex: string };
}

// EXACT 14 CATEGORIES - IN THIS EXACT ORDER
export const CATEGORIES = [
  'All',
  'Hijab',
  'Niqab',
  'Dupatta 99',
  'Dupatta Cotton',
  'Dupatta Chiffon',
  'Dupatta Banarasi & Fancy',
  'Stoll Simple',
  'Stoll Cotton',
  'Stoll Luxury / Shawl',
  'Kurti',
  'Bache Ka Kapra',
  'Undercap / Undergarments / Innerwear',
  'Dastarkhan'
] as const;

export type CategoryType = typeof CATEGORIES[number];

export const MAIN_CATEGORIES = CATEGORIES;
export const ALL_DEFAULT_CATEGORIES = CATEGORIES;

export const PRODUCTS: Product[] = [];
