export interface Product {
  id: string;
  name: string;
  category: 'Kurtis' | 'Dresses' | 'Tops' | 'Bottom Wear' | 'Bags' | 'Jewellery' | 'Accessories';
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  hoverImage: string;
  description: string;
  details: string[];
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  isNew?: boolean;
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
  'Kurtis',
  'Dresses',
  'Tops',
  'Bottom Wear',
  'Bags',
  'Jewellery',
  'Accessories'
] as const;

export const PRODUCTS: Product[] = [
  {
    id: 'kurt-1',
    name: 'Peach Blossom Chanderi Kurti',
    category: 'Kurtis',
    price: 1899,
    originalPrice: 2499,
    rating: 4.8,
    reviewCount: 124,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
    description: 'Elevate your ethnic wardrobe with our exquisite Peach Blossom Kurti, hand-loomed from pure Chanderi silk with subtle golden zari borders and intricate floral embroidery.',
    details: [
      'Fabric: Premium Chanderi Silk (Dry Clean Only)',
      'Intricate hand-embroidered floral motifs',
      'Elegant 3/4th sleeves with scalloped lace details',
      'Fully lined with comfortable soft cotton fabric',
      'Ideal for festive occasions, family gatherings, and celebrations'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Peach Pink', hex: '#facbd5' },
      { name: 'Soft Cream', hex: '#fbf7f0' }
    ],
    isNew: true,
    isBestSeller: true,
    discountBadge: '24% OFF'
  },
  {
    id: 'kurt-2',
    name: 'Ivory Chikankari Georgette Kurta',
    category: 'Kurtis',
    price: 2199,
    originalPrice: 2799,
    rating: 4.9,
    reviewCount: 98,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    description: 'Immerse yourself in heritage luxury with this hand-embroidered Lucknowi Chikankari kurta in soft georgette. Adorned with delicate shadow work and tiny sequins.',
    details: [
      'Fabric: Premium faux georgette with cotton inner lining',
      'Authentic shadow embroidery from local artisans',
      'Subtle sequin embellishments for a gentle shimmer',
      'Relaxed, flattering straight-cut silhouette',
      'Includes matching premium soft slip'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Ivory White', hex: '#fafafa' },
      { name: 'Blush Pink', hex: '#fce7eb' }
    ],
    isNew: false,
    isBestSeller: true,
    discountBadge: '21% OFF'
  },
  {
    id: 'dres-1',
    name: 'Blush Pink Tiered Maxi Dress',
    category: 'Dresses',
    price: 2499,
    originalPrice: 3299,
    rating: 4.7,
    reviewCount: 86,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1539008835657-9e8e62c82fe7?auto=format&fit=crop&w=600&q=80',
    description: 'A breath of fresh air, this layered maxi dress features fluid tiers, a flattering tie-up neckline, and a gentle floral print inspired by morning gardens.',
    details: [
      'Fabric: 100% Breathable Eco-Viscose',
      'Graceful tiered skirt layout with flowing movement',
      'Adjustable drawstring waist with handmade tassels',
      'Perfect for garden parties, resort vacations, or Sunday brunches',
      'Lightweight and fully lined for transparency protection'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Blush Pink', hex: '#fce7eb' },
      { name: 'Dusty Rose', hex: '#e2a3b0' }
    ],
    isNew: true,
    discountBadge: '24% OFF'
  },
  {
    id: 'dres-2',
    name: 'Ethereal Pastel Linen Midi Dress',
    category: 'Dresses',
    price: 1999,
    originalPrice: 2599,
    rating: 4.6,
    reviewCount: 74,
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e62c82fe7?auto=format&fit=crop&w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
    description: 'Timeless minimalist elegance meets everyday luxury. This soft linen-blend dress boasts comfortable side pockets, a matching sash belt, and mother-of-pearl buttons.',
    details: [
      'Fabric: Premium Linen-Cotton Blend',
      'Flattering wrap-around v-neck design',
      'Functional deep side pockets',
      'Includes detachable fabric waist sash',
      'Breathable, airy weave perfect for summer climates'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sage Green', hex: '#d4e2d4' },
      { name: 'Warm Oatmeal', hex: '#efebe3' },
      { name: 'Soft Rose', hex: '#fad4d8' }
    ],
    isNew: false,
    discountBadge: '23% OFF'
  },
  {
    id: 'tops-1',
    name: 'Ruffled Silk Georgette Blouse',
    category: 'Tops',
    price: 1299,
    originalPrice: 1799,
    rating: 4.5,
    reviewCount: 112,
    image: 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?auto=format&fit=crop&w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80',
    description: 'A charming, versatile top styled with delicate cascading ruffles down the front and elegant button-cuffed sleeves. Ideal for transitioning from office desk to evening dinner.',
    details: [
      'Fabric: Premium Silk Georgette',
      'Feminine ruffled neckline with dainty keyhole back closure',
      'Slightly sheer fabrication with textured crepe handle',
      'Looks chic tucked into trousers or styled casually with denim',
      'Rich, colorfast pastel dye technology'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Peachy Coral', hex: '#f7b0a2' },
      { name: 'Off-White Accent', hex: '#fcfbf9' }
    ],
    isNew: true,
    discountBadge: '27% OFF'
  },
  {
    id: 'tops-2',
    name: 'Minimalist Cotton Linen Summer Camisole',
    category: 'Tops',
    price: 999,
    originalPrice: 1399,
    rating: 4.4,
    reviewCount: 65,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?auto=format&fit=crop&w=600&q=80',
    description: 'Clean, airy, and effortlessly sophisticated. Features fine thin straps and a curved hemline. Made with pure combed cotton and pre-washed linen to prevent shrinkage.',
    details: [
      'Fabric: 80% Cotton, 20% French Flax Linen',
      'Ultra-soft breathable weave with natural linen slub texture',
      'Double layer front panel for maximum coverage and neat seam finish',
      'Adjustable fine slide shoulder straps',
      'Ideal for layering under structured blazers or cardigans'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Crisp White', hex: '#ffffff' },
      { name: 'Pastel Lavender', hex: '#e3dcf0' }
    ],
    isNew: false
  },
  {
    id: 'bott-1',
    name: 'Premium High-Waisted Linen Trousers',
    category: 'Bottom Wear',
    price: 1599,
    originalPrice: 2199,
    rating: 4.8,
    reviewCount: 143,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=600&q=80',
    description: 'Tailored for ultimate comfort and contemporary styling. Features a high rise, wide straight leg, elegant front pleats, and a comfortable elasticized back waistband.',
    details: [
      'Fabric: 100% Authentic Organic Linen',
      'Double clasp-and-zipper secure clean front tab closure',
      'Hidden deep pockets at side seams for daily essentials',
      'Relaxed straight-leg drapes gracefully',
      'Sustainably sourced premium yarn'
    ],
    sizes: ['26', '28', '30', '32', '34'],
    colors: [
      { name: 'Earthy Sand', hex: '#dfd2bc' },
      { name: 'Midnight Charcoal', hex: '#313131' }
    ],
    isNew: true,
    isBestSeller: true,
    discountBadge: '27% OFF'
  },
  {
    id: 'bott-2',
    name: 'Flowy Silk-Blend Pleated Palazzos',
    category: 'Bottom Wear',
    price: 1199,
    originalPrice: 1699,
    rating: 4.6,
    reviewCount: 82,
    image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    description: 'Enrich your traditional outfits with these featherlight, voluminous pleated palazzos. Its luxurious satin sheen catches light beautifully as you glide.',
    details: [
      'Fabric: Soft Satin-Silk and Rayon blend',
      'Generously wide flare mimics the elegance of a long skirt',
      'Stretchy satin-wrapped elasticated comfort band',
      'Pair with long Kurtis or fusion crop tops',
      'Pre-shrunk, skin-safe organic reactive dyes'
    ],
    sizes: ['Free Size (Fits 26-36)'],
    colors: [
      { name: 'Soft Cream', hex: '#faf5eb' },
      { name: 'Rosewood Gold', hex: '#dfb79e' }
    ],
    isNew: false
  },
  {
    id: 'bags-1',
    name: 'Siba Signature Blush Leather Handbag',
    category: 'Bags',
    price: 2899,
    originalPrice: 3999,
    rating: 4.9,
    reviewCount: 154,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1566150905458-1bf1fc15a6a0?auto=format&fit=crop&w=600&q=80',
    description: 'Our crown jewel accessory. Crafted from premium full-grain vegan leather, featuring custom champagne gold hardware, double top handles, and structured compartments.',
    details: [
      'Material: 100% Eco-conscious Saffiano Vegan Leather',
      'Lined interior with signature jacquard print',
      'Central zippered divider, slide phone pockets, and key leash',
      'Includes detachable, adjustable matching crossbody shoulder strap',
      'Fitted with bottom metal feet for scratch protection'
    ],
    sizes: ['One Size (W 12" x H 9.5" x D 5.5")'],
    colors: [
      { name: 'Rose Blush', hex: '#f0ccd4' },
      { name: 'Elegant Taupe', hex: '#beb0a7' }
    ],
    isNew: true,
    isBestSeller: true,
    discountBadge: '27% OFF'
  },
  {
    id: 'bags-2',
    name: 'Parisian Chic Crossbody Suede Clutch',
    category: 'Bags',
    price: 1699,
    originalPrice: 2299,
    rating: 4.7,
    reviewCount: 91,
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc15a6a0?auto=format&fit=crop&w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    description: 'Add French romantic charm to your attire. This high-end envelope suede clutch is decorated with a beautiful gold geometric metal bar and a convertible delicate chain.',
    details: [
      'Material: Premium micro-suede leather with polished metallic accents',
      'Magnetic secure fold-over snap flap',
      'Dainty gold-plated snake chain strap (drop 22")',
      'Perfectly sized to fit larger smartphones, keys, cardholders, and lipsticks',
      'Slim, lightweight silhouette'
    ],
    sizes: ['One Size (W 9.5" x H 6" x D 2")'],
    colors: [
      { name: 'Pastel Lilac', hex: '#dfcfe4' },
      { name: 'Midnight Jet', hex: '#1c1c1c' }
    ],
    isNew: false,
    discountBadge: '26% OFF'
  },
  {
    id: 'jewl-1',
    name: 'Rose Gold Premium Pearl Drop Earrings',
    category: 'Jewellery',
    price: 1499,
    originalPrice: 1999,
    rating: 4.9,
    reviewCount: 215,
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    description: 'Pure sophistication in every dangle. Hand-picked AAA freshwater Baroque pearls cascade elegantly from an 18k rose gold-plated hypoallergenic stud cluster.',
    details: [
      'Base: Hypoallergenic Sterling Silver S925 with 18K Rose Gold thick plating',
      'Pearl: Genuine high-luster Baroque Freshwater Pearls',
      'Lightweight design for absolute all-day comfortable wear',
      'Comes in a luxurious custom velvet-lined keepsake drawer box',
      'Tarnish-resistant finish guarantee'
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Rose Gold & Pink Pearl', hex: '#eccbcb' },
      { name: 'White Gold & Pearl', hex: '#e8ecef' }
    ],
    isNew: false,
    isBestSeller: true,
    discountBadge: '25% OFF'
  },
  {
    id: 'jewl-2',
    name: 'Solitaire Crystal Delicate Pendant Necklace',
    category: 'Jewellery',
    price: 1199,
    originalPrice: 1599,
    rating: 4.8,
    reviewCount: 168,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=600&q=80',
    description: 'Whispers of minimalism. A brilliant-cut solitaire Austrian cubic zirconia crystal is suspended on a super-fine, skin-safe adjustable princess-length box chain.',
    details: [
      'Material: 18k White Gold plated S925 Silver',
      'Stone: High-grade sparkling 6mm Cubic Zirconia Solitaire',
      'Chain length: 16 inches + 2 inches extension slider',
      'Perfect for minimalist necklines or subtle everyday office sparkle',
      'Secure premium lobster claw clasp'
    ],
    sizes: ['Adjustable (16" - 18")'],
    colors: [
      { name: 'Classic Silver', hex: '#e5e7eb' },
      { name: 'Rose Gold Warmth', hex: '#dfb0a3' }
    ],
    isNew: true
  },
  {
    id: 'accs-1',
    name: 'Retro Pastel Oversized Sunglasses',
    category: 'Accessories',
    price: 999,
    originalPrice: 1499,
    rating: 4.6,
    reviewCount: 95,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=600&q=80',
    description: 'Block rays and turn heads with these vintage-inspired oversized sunglasses. Features ultra-lightweight translucent acetate frames and shatter-resistant tinted lenses.',
    details: [
      'Protection: 100% UV400 Protection blocks UVA & UVB rays',
      'Frame: High-grade biodegradable Acetate in transparent rose hue',
      'Lenses: Impact-proof rose-tinted polycarbonate gradient lenses',
      'Includes premium leather soft-pouch and microfiber cleaning cloth',
      'Reinforced 5-barrel metal hinges for long-term durability'
    ],
    sizes: ['Standard (Lens W 54mm, Bridge 18mm, Temples 142mm)'],
    colors: [
      { name: 'Blush Pink', hex: '#facbd5' },
      { name: 'Champagne Honey', hex: '#eedbb8' }
    ],
    isNew: true,
    discountBadge: '33% OFF'
  },
  {
    id: 'accs-2',
    name: 'Meadow Garden Pure Silk Scarf',
    category: 'Accessories',
    price: 1299,
    originalPrice: 1799,
    rating: 4.8,
    reviewCount: 79,
    image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
    description: 'A luxurious square scarf meticulously hand-rolled from pure mulberry silk. Decorated with timeless pastel floral drawings. Tie it around your neck, head, or Siba handbag strap.',
    details: [
      'Material: 100% Mulberry Silk, 14 Momme weight',
      'Meticulously hand-rolled and hand-stitched hem borders',
      'Satin-smooth weave feels delightfully cool on skin',
      'Versatile square format for multi-way artistic styling',
      'Vibrant long-lasting eco-friendly digital prints'
    ],
    sizes: ['One Size (35" x 35" / 90cm x 90cm)'],
    colors: [
      { name: 'Meadow Pastel', hex: '#e9fad3' },
      { name: 'Blossom Pink', hex: '#fadbd9' }
    ],
    isNew: false,
    discountBadge: '27% OFF'
  }
];
