import Papa from 'papaparse';
import { Product, CATEGORIES } from '../types';

export const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1UjFz9BDvDBXqVoJzYoMAHSIH4lwKXkpah0ccwD_Gscw/export?format=csv';
export const SIBA_WHATSAPP_NUMBER = '918210941262';
export const SIBA_FULL_ADDRESS = 'Siba Collection, Road No. 5, Mahesh Babu Chowk, Muzaffarpur, Bihar - 842002';

// Helper to clean price strings like "₹ 1,499", "Rs. 1499", "1499.00"
function parseNumericPrice(val: any): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Check if image link is valid URL and not the placeholder instruction
export function isValidImageUrl(url?: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.toLowerCase().includes('photo link') || 
      trimmed.toLowerCase().includes('photo link dalo') ||
      trimmed.toLowerCase().includes('...photo link...') ||
      trimmed.toLowerCase().includes('example.com') ||
      trimmed.startsWith('PHOTO LINK')) {
    return false;
  }
  return /^https?:\/\/.+/i.test(trimmed);
}

/**
 * Normalizes category from raw sheet string into the standardized 14 category names
 */
export function normalizeCategoryName(rawCategory: string): string {
  if (!rawCategory || !rawCategory.trim()) return 'Dupatta 99';
  const trimmed = rawCategory.trim();
  const catLower = trimmed.toLowerCase();

  // 1. Dastarkhan
  if (catLower.includes('dastarkhan') || catLower.includes('dastarkhwan') || catLower.includes('dining') || catLower.includes('table cloth')) {
    return 'Dastarkhan';
  }

  // 2. Dupatta 99
  if (catLower === 'dupatta 99' || catLower === 'dupatta99' || (catLower.includes('dupatta') && catLower.includes('99')) || catLower === '99') {
    return 'Dupatta 99';
  }

  // 3. Dupatta Cotton
  if (catLower.includes('cotton') && catLower.includes('dupatta')) {
    return 'Dupatta Cotton';
  }

  // 4. Dupatta Chiffon
  if (catLower.includes('chiffon') && catLower.includes('dupatta')) {
    return 'Dupatta Chiffon';
  }

  // 5. Dupatta Banarasi & Fancy
  if (catLower.includes('banarasi') || catLower.includes('fancy') || catLower.includes('organza') || catLower.includes('net dupatta') || catLower.includes('partywear') || catLower.includes('saree')) {
    return 'Dupatta Banarasi & Fancy';
  }

  // 6. Generic Dupatta fallback
  if (catLower.includes('dupatta')) {
    return 'Dupatta Banarasi & Fancy';
  }

  // 7. Stoll Simple
  if (catLower === 'stoll simple' || catLower === 'stole simple' || (catLower.includes('simple') && (catLower.includes('stoll') || catLower.includes('stole') || catLower.includes('shawl')))) {
    return 'Stoll Simple';
  }

  // 8. Stoll Cotton
  if (catLower === 'stoll cotton' || catLower === 'stole cotton' || (catLower.includes('cotton') && (catLower.includes('stoll') || catLower.includes('stole')))) {
    return 'Stoll Cotton';
  }

  // 9. Stoll Luxury / Shawl
  if (catLower.includes('luxury') || catLower.includes('shawl') || catLower.includes('velvet') || catLower.includes('shimmer') || catLower.includes('pashmina') || catLower.includes('winter')) {
    return 'Stoll Luxury / Shawl';
  }

  // Generic Stoll
  if (catLower.includes('stoll') || catLower.includes('stole')) {
    return 'Stoll Simple';
  }

  // 10. Niqab (and Abaya/Burqa)
  if (catLower.includes('niqab') || catLower.includes('naqab') || catLower.includes('nirab') || catLower.includes('nakab') || catLower.includes('abaya') || catLower.includes('burqa') || catLower.includes('burkha')) {
    return 'Niqab';
  }

  // 11. Hijab
  if (catLower.includes('hijab')) {
    return 'Hijab';
  }

  // 12. Undercap / Undergarments / Innerwear
  if (catLower.includes('undercap') || catLower.includes('inner cap') || catLower.includes('under cap') || catLower.includes('cap') || catLower.includes('innerwear') || catLower.includes('undergarments') || catLower.includes('bra') || catLower.includes('panty') || catLower.includes('legging')) {
    return 'Undercap / Undergarments / Innerwear';
  }

  // 13. Kurti
  if (catLower.includes('kurti') || catLower.includes('kurta') || catLower.includes('tunic') || catLower.includes('suit') || catLower.includes('trouser') || catLower.includes('nighty')) {
    return 'Kurti';
  }

  // 14. Bache Ka Kapra
  if (catLower.includes('kid') || catLower.includes('bache') || catLower.includes('bacha') || catLower.includes('baby') || catLower.includes('children')) {
    return 'Bache Ka Kapra';
  }

  // Direct check against standard list
  for (const c of CATEGORIES) {
    if (c.toLowerCase() === catLower) return c;
  }

  return trimmed;
}

/**
 * Filter match logic for sub-categories
 */
export function matchesCategoryFilter(productCategory: string, filterCategory: string): boolean {
  if (filterCategory === 'All') return true;
  if (!productCategory) return false;

  const pCat = productCategory.trim().toLowerCase();
  const fCat = filterCategory.trim().toLowerCase();

  if (pCat === fCat) return true;

  // Specific Subcategory rules
  if (fCat === 'dupatta 99') {
    return pCat === 'dupatta 99' || (pCat.includes('dupatta') && pCat.includes('99')) || pCat.includes('99');
  }
  if (fCat === 'dupatta cotton') {
    return pCat === 'dupatta cotton' || (pCat.includes('cotton') && pCat.includes('dupatta'));
  }
  if (fCat === 'dupatta chiffon') {
    return pCat === 'dupatta chiffon' || (pCat.includes('chiffon') && pCat.includes('dupatta'));
  }
  if (fCat === 'dupatta banarasi & fancy') {
    return pCat === 'dupatta banarasi & fancy' || pCat.includes('banarasi') || pCat.includes('fancy') || pCat.includes('organza') || pCat.includes('partywear') || (pCat.includes('dupatta') && !pCat.includes('99') && !pCat.includes('cotton') && !pCat.includes('chiffon'));
  }
  if (fCat === 'stoll simple') {
    return pCat === 'stoll simple' || pCat === 'stole simple' || (pCat.includes('simple') && (pCat.includes('stoll') || pCat.includes('stole')));
  }
  if (fCat === 'stoll cotton') {
    return pCat === 'stoll cotton' || pCat === 'stole cotton' || (pCat.includes('cotton') && (pCat.includes('stoll') || pCat.includes('stole')));
  }
  if (fCat === 'stoll luxury / shawl') {
    return pCat === 'stoll luxury / shawl' || pCat.includes('luxury') || pCat.includes('shawl') || pCat.includes('velvet') || pCat.includes('shimmer') || pCat.includes('pashmina');
  }
  if (fCat === 'niqab') {
    return pCat === 'niqab' || pCat.includes('niqab') || pCat.includes('naqab') || pCat.includes('nirab') || pCat.includes('nakab') || pCat.includes('abaya') || pCat.includes('burqa');
  }
  if (fCat === 'hijab') {
    return pCat === 'hijab' || pCat.includes('hijab');
  }
  if (fCat === 'undercap / undergarments / innerwear') {
    return pCat === 'undercap / undergarments / innerwear' || pCat.includes('undercap') || pCat.includes('inner cap') || pCat.includes('under cap') || pCat.includes('cap') || pCat.includes('innerwear') || pCat.includes('undergarments');
  }
  if (fCat === 'kurti') {
    return pCat === 'kurti' || pCat.includes('kurti') || pCat.includes('kurta') || pCat.includes('trouser') || pCat.includes('nighty');
  }
  if (fCat === 'bache ka kapra') {
    return pCat === 'bache ka kapra' || pCat.includes('kid') || pCat.includes('bache') || pCat.includes('bacha') || pCat.includes('baby');
  }
  if (fCat === 'dastarkhan') {
    return pCat === 'dastarkhan' || pCat.includes('dastarkhan') || pCat.includes('dastarkhwan') || pCat.includes('dining');
  }

  return pCat.includes(fCat);
}

// Convert a single CSV row object from PapaParse to Product
export function mapCsvRowToProduct(row: Record<string, any>, index: number): Product | null {
  const normalized: Record<string, any> = {};
  for (const key of Object.keys(row)) {
    const cleanKey = key.trim().toLowerCase().replace(/[\s_-]+/g, '');
    normalized[cleanKey] = row[key];
  }

  const rawId = normalized['productid'] || normalized['id'] || `SIBA-${index + 1}`;
  const rawTitle = normalized['title'] || normalized['name'] || normalized['producttitle'] || '';

  if (!rawTitle && !normalized['price']) {
    return null;
  }

  const title = String(rawTitle).trim() || `Siba Exclusive Item ${index + 1}`;
  const price = parseNumericPrice(normalized['price']);
  const rawOrigPrice = parseNumericPrice(normalized['originalprice'] || normalized['mrp']);
  const originalPrice = rawOrigPrice > 0 ? rawOrigPrice : (price > 0 ? Math.round(price * 1.3) : 0);

  // Discount parsing
  let discountBadge = '';
  let discountPercent = 0;
  const rawDiscount = normalized['discount'] ? String(normalized['discount']).trim() : '';

  if (rawDiscount) {
    discountBadge = rawDiscount.toUpperCase().includes('OFF') ? rawDiscount : `${rawDiscount} OFF`;
    const numMatch = rawDiscount.match(/\d+/);
    if (numMatch) {
      discountPercent = parseInt(numMatch[0], 10);
    }
  } else if (originalPrice > price && originalPrice > 0) {
    discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
    if (discountPercent > 0) {
      discountBadge = `${discountPercent}% OFF`;
    }
  }

  // Images parsing (Can be comma separated)
  const rawImages = normalized['images'] || normalized['image'] || normalized['photo'] || '';
  let imageList: string[] = [];

  if (typeof rawImages === 'string' && rawImages.trim()) {
    imageList = rawImages
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  const primaryImage = imageList[0] || '';
  const hasValidImage = isValidImageUrl(primaryImage);

  // Category normalization using robust helper
  const rawCategory = normalized['category'] ? String(normalized['category']).trim() : 'Dupatta 99';
  const category = normalizeCategoryName(rawCategory);

  // Colors
  const rawColor = normalized['color'] ? String(normalized['color']).trim() : '';
  const colorsList: { name: string; hex: string }[] = [];
  if (rawColor) {
    const splitColors = rawColor.split(/[,/|]/).map((c) => c.trim()).filter(Boolean);
    for (const c of splitColors) {
      const cLow = c.toLowerCase();
      let hex = '#111827';
      if (cLow.includes('pink') || cLow.includes('rose') || cLow.includes('blush')) hex = '#e84167';
      else if (cLow.includes('white') || cLow.includes('ivory') || cLow.includes('cream')) hex = '#ffffff';
      else if (cLow.includes('black')) hex = '#0a0a0a';
      else if (cLow.includes('red') || cLow.includes('maroon') || cLow.includes('burgundy')) hex = '#881337';
      else if (cLow.includes('blue') || cLow.includes('navy')) hex = '#1e3a8a';
      else if (cLow.includes('green') || cLow.includes('olive') || cLow.includes('emerald')) hex = '#065f46';
      else if (cLow.includes('gold') || cLow.includes('beige') || cLow.includes('nude')) hex = '#d97706';
      else if (cLow.includes('grey') || cLow.includes('gray')) hex = '#6b7280';
      else if (cLow.includes('purple') || cLow.includes('lavender')) hex = '#7e22ce';
      colorsList.push({ name: c, hex });
    }
  }

  // Sizes
  const rawSizes = normalized['sizes'] || normalized['size'] || '';
  let sizesList: string[] = [];
  if (rawSizes) {
    sizesList = String(rawSizes).split(/[,/|]/).map((s) => s.trim()).filter(Boolean);
  }
  if (sizesList.length === 0) {
    sizesList = ['Free Size'];
  }

  // Stock
  const rawStock = normalized['stock'] ? String(normalized['stock']).trim() : 'In Stock';
  const isAvailable = !rawStock.toLowerCase().includes('out') && !rawStock.toLowerCase().includes('sold');
  const numericStock = parseInt(rawStock.replace(/[^0-9]/g, ''), 10);
  const stock = isNaN(numericStock) ? (isAvailable ? 25 : 0) : numericStock;

  const fabric = normalized['fabric'] ? String(normalized['fabric']).trim() : '';
  const description = normalized['description'] ? String(normalized['description']).trim() : 
    (fabric ? `Premium quality ${category} in soft ${fabric}. Designed for elegance, breathability, and modest perfection.` : `Exclusive ${category} designed for timeless modest elegance and comfort at Siba Collection, Muzaffarpur.`);

  return {
    id: String(rawId),
    productId: String(rawId),
    name: title,
    title: title,
    price: price > 0 ? price : 99,
    originalPrice: originalPrice > price ? originalPrice : Math.round(price * 1.3),
    discountBadge: discountBadge || undefined,
    discountPercent: discountPercent > 0 ? discountPercent : undefined,
    image: primaryImage,
    images: imageList.length > 0 ? imageList : (primaryImage ? [primaryImage] : []),
    hasValidImage,
    category,
    color: rawColor || 'Standard',
    colors: colorsList.length > 0 ? colorsList : [{ name: rawColor || 'Standard', hex: '#e84167' }],
    sizes: sizesList,
    fabric: fabric || 'Premium Modest Fabric',
    description,
    stockText: rawStock,
    stock,
    isAvailable,
    rating: 4.9,
    reviewCount: 42 + (index * 7) % 60,
    isNew: index < 3,
    isTrending: index % 2 === 0
  };
}

/**
 * Fetch live products directly from Google Sheets CSV URL with PapaParse
 */
export async function fetchLiveProductsFromGoogleSheet(): Promise<{
  products: Product[];
  categories: string[];
  lastUpdated: Date;
  error: string | null;
}> {
  try {
    const fetchUrl = `${GOOGLE_SHEET_CSV_URL}&_cb=${Date.now()}`;
    
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv, text/plain, */*'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Google Sheet CSV returned status ${response.status}: ${response.statusText}`);
    }

    const csvText = await response.text();

    if (!csvText || !csvText.trim()) {
      throw new Error('Google Sheet returned empty data');
    }

    return new Promise((resolve) => {
      Papa.parse<Record<string, any>>(csvText, {
        header: true,
        skipEmptyLines: 'greedy',
        complete: (results) => {
          if (results.errors && results.errors.length > 0) {
            console.warn('PapaParse warnings while parsing Google Sheet CSV:', results.errors);
          }

          const parsedRows = results.data || [];
          const products: Product[] = [];
          const categoriesSet = new Set<string>();

          parsedRows.forEach((row, idx) => {
            const product = mapCsvRowToProduct(row, idx);
            if (product) {
              products.push(product);
              if (product.category) {
                categoriesSet.add(product.category);
              }
            }
          });

          const customCategories = Array.from(categoriesSet);
          
          resolve({
            products,
            categories: customCategories,
            lastUpdated: new Date(),
            error: null
          });
        },
        error: (err: Error) => {
          console.error('PapaParse parsing error:', err);
          resolve({
            products: [],
            categories: [],
            lastUpdated: new Date(),
            error: `Failed to parse Google Sheet: ${err.message}`
          });
        }
      });
    });
  } catch (err: any) {
    console.error('Error fetching Google Sheets CSV:', err);
    return {
      products: [],
      categories: [],
      lastUpdated: new Date(),
      error: err.message || 'Failed to connect to Google Sheets live database'
    };
  }
}

/**
 * Generate direct WhatsApp Buy message link
 */
export function generateWhatsAppBuyUrl(params: {
  product: Product;
  size?: string;
  color?: string;
  quantity?: number;
  phone?: string;
}): string {
  const { product, size, color, quantity = 1, phone = SIBA_WHATSAPP_NUMBER } = params;
  
  const chosenSize = size || product.sizes?.[0] || 'Standard';
  const chosenColor = color || product.color || 'Standard';
  const totalAmount = (product.price * quantity).toLocaleString('en-IN');

  const text = 
`*🛍️ ASSALAMU ALAIKUM SIBA COLLECTION!*
I want to order this product from your website:

*Store:* Siba Collection, Road No. 5, Mahesh Babu Chowk, Muzaffarpur
*Product:* ${product.title || product.name}
*Product ID:* ${product.productId || product.id}
*Price:* ₹${product.price} ${product.originalPrice > product.price ? `(MRP: ₹${product.originalPrice})` : ''}
*Category:* ${product.category}
*Quantity:* ${quantity}
*Selected Size:* ${chosenSize}
*Selected Color:* ${chosenColor}
*Fabric:* ${product.fabric || 'Standard'}
*Total Amount:* ₹${totalAmount}

${product.hasValidImage && product.image ? `*Photo Link:* ${product.image}\n` : ''}
Please confirm availability and dispatch details. JazakAllah Khair!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate dynamic Sitemap XML string from loaded products
 */
export function generateDynamicSitemapXml(products: Product[]): string {
  const baseUrl = 'https://sibacollection.netlify.app';
  const dateStr = new Date().toISOString().split('T')[0];

  const categoryEntries = CATEGORIES.filter(c => c !== 'All').map(cat => {
    const slug = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `  <url>
    <loc>${baseUrl}/#${slug}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
  }).join('\n');

  const productEntries = products.map(p => {
    return `  <url>
    <loc>${baseUrl}/#product-${p.id}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${categoryEntries}
${productEntries}
</urlset>`;
}
