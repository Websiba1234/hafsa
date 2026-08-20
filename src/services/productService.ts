import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product } from '../types';

export interface SupabaseProductForm {
  id?: string | number;
  name: string;
  price: number | string;
  original_price?: number | string | null;
  discount_percent?: number | string | null;
  category: string;
  color?: string;
  fabric?: string;
  pattern?: string;
  image: string;
  images?: string[] | string;
  stock: number | string;
  rating?: number | string;
  is_new?: boolean;
  is_trending?: boolean;
  description?: string;
}

/**
 * Upload an image file to the Supabase "products" storage bucket and return the public URL
 */
export async function uploadProductImage(file: File): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { url: null, error: 'Supabase is not configured' };
  }

  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return { url: null, error: uploadError.message };
    }

    const { data: publicData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return { url: publicData.publicUrl, error: null };
  } catch (err: any) {
    console.error('Error uploading product image:', err);
    return { url: null, error: err.message || 'Image upload failed' };
  }
}

/**
 * Convert Supabase "Products" table database row to frontend Product type
 */
export function mapSupabaseRowToProduct(row: any): Product {
  const rawName = row.name ?? row.Name ?? 'Untitled Product';
  const currentPrice = Number(row.price ?? row.Price ?? 0);
  const rawOriginalPrice = row.original_price !== undefined && row.original_price !== null
    ? Number(row.original_price)
    : (row.originalPrice !== undefined ? Number(row.originalPrice) : currentPrice);

  let discountPercent = 0;
  if (row.discount_percent !== undefined && row.discount_percent !== null && row.discount_percent !== '') {
    discountPercent = Number(row.discount_percent);
  } else if (rawOriginalPrice > currentPrice && rawOriginalPrice > 0) {
    discountPercent = Math.round(((rawOriginalPrice - currentPrice) / rawOriginalPrice) * 100);
  }

  const discountBadge = discountPercent > 0 ? `${discountPercent}% OFF` : undefined;

  // Handle image and array of images
  let rawImagesList: string[] = [];
  if (Array.isArray(row.images)) {
    rawImagesList = row.images;
  } else if (typeof row.images === 'string' && row.images.trim()) {
    try {
      const parsed = JSON.parse(row.images);
      if (Array.isArray(parsed)) rawImagesList = parsed;
    } catch {
      rawImagesList = row.images.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
  }

  const mainImage = row.image ?? (rawImagesList.length > 0 ? rawImagesList[0] : null) ?? row.Image_URL ?? 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';
  const hoverImage = (rawImagesList.length > 1 ? rawImagesList[1] : null) ?? mainImage;

  const rawStock = row.stock !== undefined && row.stock !== null ? Number(row.stock) : (row.Stock !== undefined ? Number(row.Stock) : 10);
  const rawRating = row.rating !== undefined && row.rating !== null ? Number(row.rating) : 4.8;
  const isNew = row.is_new !== undefined ? Boolean(row.is_new) : (row.isNew !== undefined ? Boolean(row.isNew) : true);
  const isTrending = row.is_trending !== undefined ? Boolean(row.is_trending) : (row.isTrending !== undefined ? Boolean(row.isTrending) : false);

  // Generate description / details from fabric & pattern if not given
  const fabricStr = row.fabric ? `Fabric: ${row.fabric}` : '';
  const patternStr = row.pattern ? `Pattern: ${row.pattern}` : '';
  const colorStr = row.color ? `Color: ${row.color}` : '';

  const detailsList: string[] = [];
  if (fabricStr) detailsList.push(fabricStr);
  if (patternStr) detailsList.push(patternStr);
  if (colorStr) detailsList.push(colorStr);
  if (row.category) detailsList.push(`Category: ${row.category}`);
  detailsList.push(rawStock > 0 ? `Stock: ${rawStock} available` : 'Out of Stock');

  // Parse colors
  let colorsList: { name: string; hex: string }[] = [];
  if (row.color && typeof row.color === 'string') {
    colorsList = row.color.split(',').map((c: string) => {
      const name = c.trim();
      const lower = name.toLowerCase();
      let hex = '#dfac6c';
      if (lower.includes('pink')) hex = '#facbd5';
      else if (lower.includes('white') || lower.includes('cream') || lower.includes('ivory')) hex = '#fafafa';
      else if (lower.includes('black')) hex = '#1e1e1e';
      else if (lower.includes('red') || lower.includes('maroon')) hex = '#e11d48';
      else if (lower.includes('blue') || lower.includes('navy')) hex = '#1e3a8a';
      else if (lower.includes('green') || lower.includes('sage')) hex = '#059669';
      else if (lower.includes('yellow') || lower.includes('gold')) hex = '#eab308';
      return { name, hex };
    });
  }
  if (colorsList.length === 0) {
    colorsList = [{ name: row.color || 'Standard', hex: '#dfac6c' }];
  }

  const generatedDesc = row.description || (row.fabric
    ? `Crafted with luxurious ${row.fabric}${row.pattern ? ` featuring stunning ${row.pattern}` : ''}. Perfect for versatile occasions and timeless elegance.`
    : `Exquisite ${row.category || 'fashion'} piece designed for comfort, grace, and modern elegance.`);

  return {
    id: String(row.id),
    name: rawName,
    category: row.category || 'Kurtis',
    price: currentPrice,
    originalPrice: rawOriginalPrice,
    original_price: rawOriginalPrice,
    discount_percent: discountPercent,
    rating: rawRating,
    reviewCount: row.review_count || 36,
    image: mainImage,
    images: rawImagesList.length > 0 ? rawImagesList : [mainImage],
    hoverImage,
    description: generatedDesc,
    details: detailsList,
    fabric: row.fabric || '',
    pattern: row.pattern || '',
    color: row.color || '',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: colorsList,
    isNew,
    is_new: isNew,
    isTrending,
    is_trending: isTrending,
    isBestSeller: isTrending,
    discountBadge,
    stock: rawStock,
    sku: row.sku || `SIBA-${row.id}`,
    isAvailable: rawStock > 0
  };
}

/**
 * Fetch products for website visitors from Supabase "Products" table
 */
export async function fetchVisitorProducts(): Promise<{ products: Product[]; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { products: [], error: 'Supabase credentials not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('Products')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching visitor products from Supabase "Products" table:', error);
      return { products: [], error: error.message };
    }

    if (!data || data.length === 0) {
      return { products: [], error: null };
    }

    const mappedProducts = data.map(mapSupabaseRowToProduct);
    return { products: mappedProducts, error: null };
  } catch (err: any) {
    console.error('Unexpected error fetching visitor products:', err);
    return { products: [], error: err.message || 'Failed to fetch products' };
  }
}

/**
 * Fetch ALL products for Admin panel from Supabase "Products" table
 */
export async function fetchAllAdminProducts(): Promise<{ rawRows: any[]; mappedProducts: Product[]; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { rawRows: [], mappedProducts: [], error: 'Supabase credentials are not configured.' };
  }

  try {
    const { data, error } = await supabase
      .from('Products')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching admin products from Supabase "Products" table:', error);
      return { rawRows: [], mappedProducts: [], error: error.message };
    }

    const rows = data || [];
    const mapped = rows.map(mapSupabaseRowToProduct);
    return { rawRows: rows, mappedProducts: mapped, error: null };
  } catch (err: any) {
    console.error('Unexpected error fetching admin products:', err);
    return { rawRows: [], mappedProducts: [], error: err.message || 'Failed to fetch products' };
  }
}

/**
 * Add a new product to Supabase "Products" table
 */
export async function createProductInSupabase(formData: SupabaseProductForm): Promise<{ success: boolean; error: string | null; data?: any }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase credentials are not configured.' };
  }

  try {
    const priceNum = Number(formData.price || 0);
    const origPriceNum = formData.original_price !== undefined && formData.original_price !== null && formData.original_price !== ''
      ? Number(formData.original_price)
      : priceNum;

    let discountPct = 0;
    if (formData.discount_percent !== undefined && formData.discount_percent !== null && formData.discount_percent !== '') {
      discountPct = Number(formData.discount_percent);
    } else if (origPriceNum > priceNum && origPriceNum > 0) {
      discountPct = Math.round(((origPriceNum - priceNum) / origPriceNum) * 100);
    }

    let imagesArray: string[] = [];
    if (Array.isArray(formData.images)) {
      imagesArray = formData.images;
    } else if (typeof formData.images === 'string' && formData.images.trim()) {
      imagesArray = formData.images.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (imagesArray.length === 0 && formData.image) {
      imagesArray = [formData.image];
    }

    const rowPayload: Record<string, any> = {
      name: formData.name,
      price: priceNum,
      original_price: origPriceNum,
      discount_percent: discountPct,
      category: formData.category || 'Kurtis',
      color: formData.color || '',
      fabric: formData.fabric || '',
      pattern: formData.pattern || '',
      image: formData.image || '',
      images: imagesArray,
      stock: Number(formData.stock || 0),
      rating: formData.rating ? Number(formData.rating) : 4.8,
      is_new: Boolean(formData.is_new ?? true),
      is_trending: Boolean(formData.is_trending ?? false)
    };

    console.log('Inserting into Products table:', rowPayload);

    const { data, error } = await supabase
      .from('Products')
      .insert([rowPayload])
      .select();

    if (error) {
      console.error('Supabase create product error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null, data: data?.[0] };
  } catch (err: any) {
    console.error('Unexpected error creating product:', err);
    return { success: false, error: err.message || 'Failed to create product' };
  }
}

/**
 * Update an existing product in Supabase "Products" table
 */
export async function updateProductInSupabase(id: string | number, formData: SupabaseProductForm): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase credentials are not configured.' };
  }

  try {
    const priceNum = Number(formData.price || 0);
    const origPriceNum = formData.original_price !== undefined && formData.original_price !== null && formData.original_price !== ''
      ? Number(formData.original_price)
      : priceNum;

    let discountPct = 0;
    if (formData.discount_percent !== undefined && formData.discount_percent !== null && formData.discount_percent !== '') {
      discountPct = Number(formData.discount_percent);
    } else if (origPriceNum > priceNum && origPriceNum > 0) {
      discountPct = Math.round(((origPriceNum - priceNum) / origPriceNum) * 100);
    }

    let imagesArray: string[] = [];
    if (Array.isArray(formData.images)) {
      imagesArray = formData.images;
    } else if (typeof formData.images === 'string' && formData.images.trim()) {
      imagesArray = formData.images.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (imagesArray.length === 0 && formData.image) {
      imagesArray = [formData.image];
    }

    const rowPayload: Record<string, any> = {
      name: formData.name,
      price: priceNum,
      original_price: origPriceNum,
      discount_percent: discountPct,
      category: formData.category || 'Kurtis',
      color: formData.color || '',
      fabric: formData.fabric || '',
      pattern: formData.pattern || '',
      image: formData.image || '',
      images: imagesArray,
      stock: Number(formData.stock || 0),
      rating: formData.rating ? Number(formData.rating) : 4.8,
      is_new: Boolean(formData.is_new ?? true),
      is_trending: Boolean(formData.is_trending ?? false)
    };

    console.log(`Updating Products table row id ${id}:`, rowPayload);

    const { error } = await supabase
      .from('Products')
      .update(rowPayload)
      .eq('id', id);

    if (error) {
      console.error('Supabase update product error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Unexpected error updating product:', err);
    return { success: false, error: err.message || 'Failed to update product' };
  }
}

/**
 * Delete a product from Supabase "Products" table
 */
export async function deleteProductInSupabase(id: string | number): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase credentials are not configured.' };
  }

  try {
    console.log(`Deleting Products table row id ${id}`);
    const { error } = await supabase
      .from('Products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete product error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Unexpected error deleting product:', err);
    return { success: false, error: err.message || 'Failed to delete product' };
  }
}
