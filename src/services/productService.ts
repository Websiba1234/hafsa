import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product } from '../types';

export interface SupabaseProductForm {
  id?: string | number;
  Name: string;
  Price: number | string;
  Description: string;
  Image_URL: string;
  Stock: number | string;
  Sku: string;
  category: string;
  color: string;
  discount_price: number | string | null;
  is_available: boolean;
  size: string;
}

// Convert Supabase database row to frontend Product type
export function mapSupabaseRowToProduct(row: any): Product {
  // Support both PascalCase (Name, Price) and lowercase (name, price) column names
  const rawName = row.Name ?? row.name ?? 'Untitled Product';
  const rawOriginalPrice = Number(row.Price ?? row.price ?? 0);
  const rawDiscountPrice = row.discount_price !== undefined && row.discount_price !== null && row.discount_price !== ''
    ? Number(row.discount_price)
    : undefined;

  const currentPrice = (rawDiscountPrice && rawDiscountPrice > 0 && rawDiscountPrice < rawOriginalPrice)
    ? rawDiscountPrice
    : rawOriginalPrice;

  const rawImage = row.Image_URL ?? row.image_url ?? row.image ?? 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';
  const rawStock = row.Stock !== undefined && row.Stock !== null ? Number(row.Stock) : (row.stock !== undefined ? Number(row.stock) : 0);
  const rawIsAvailable = row.Is_available !== undefined ? Boolean(row.Is_available) : (row.is_available !== undefined ? Boolean(row.is_available) : (row.isAvailable !== undefined ? Boolean(row.isAvailable) : true));

  // Compute discount percentage badge
  let discountBadge: string | undefined = undefined;
  if (rawDiscountPrice && rawOriginalPrice > rawDiscountPrice) {
    const pct = Math.round(((rawOriginalPrice - rawDiscountPrice) / rawOriginalPrice) * 100);
    if (pct > 0) {
      discountBadge = `${pct}% OFF`;
    }
  }

  // Parse sizes string (e.g. "S, M, L, XL" -> ['S', 'M', 'L', 'XL'])
  let sizesList: string[] = ['S', 'M', 'L', 'XL'];
  const rawSize = row.size ?? row.Size;
  if (typeof rawSize === 'string' && rawSize.trim()) {
    sizesList = rawSize.split(',').map((s: string) => s.trim()).filter(Boolean);
  } else if (Array.isArray(rawSize) && rawSize.length > 0) {
    sizesList = rawSize;
  }

  // Parse colors string
  let colorsList: { name: string; hex: string }[] = [{ name: 'Default', hex: '#d97706' }];
  const rawColor = row.color ?? row.Color;
  if (typeof rawColor === 'string' && rawColor.trim()) {
    const splitColors = rawColor.split(',').map((c: string) => c.trim()).filter(Boolean);
    colorsList = splitColors.map((cName) => ({
      name: cName,
      hex: cName.toLowerCase().includes('pink') ? '#facbd5' : cName.toLowerCase().includes('white') || cName.toLowerCase().includes('ivory') ? '#fafafa' : cName.toLowerCase().includes('black') ? '#1e1e1e' : '#dfac6c'
    }));
  }

  return {
    id: String(row.id),
    name: rawName,
    category: row.category ?? 'Kurtis',
    price: currentPrice,
    originalPrice: rawOriginalPrice,
    rating: 4.8,
    reviewCount: 42,
    image: rawImage,
    hoverImage: rawImage,
    description: row.Description ?? row.description ?? '',
    details: [
      `Category: ${row.category || 'Kurtis'}`,
      `SKU: ${row.Sku || row.sku || 'N/A'}`,
      `Stock Status: ${rawStock > 0 ? `${rawStock} available` : 'Out of Stock'}`
    ],
    sizes: sizesList,
    colors: colorsList,
    isNew: true,
    discountBadge,
    stock: rawStock,
    sku: row.Sku ?? row.sku ?? '',
    isAvailable: rawIsAvailable
  };
}

/**
 * Fetch products for website visitors (where is_available = true)
 */
export async function fetchVisitorProducts(): Promise<{ products: Product[]; error: string | null }> {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured. Using fallback data.');
    return { products: [], error: 'SUPABASE_NOT_CONFIGURED' };
  }

  try {
    const { data, error } = await supabase
      .from('Product')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching visitor products from Supabase:', error);
      return { products: [], error: error.message };
    }

    if (!data || data.length === 0) {
      return { products: [], error: null };
    }

    const mappedProducts = data.map(mapSupabaseRowToProduct);
    const availableProducts = mappedProducts.filter((p) => p.isAvailable !== false);
    return { products: availableProducts, error: null };
  } catch (err: any) {
    console.error('Unexpected error fetching visitor products:', err);
    return { products: [], error: err.message || 'Failed to fetch products' };
  }
}

/**
 * Fetch ALL products for Admin panel (including disabled/out-of-stock)
 */
export async function fetchAllAdminProducts(): Promise<{ rawRows: any[]; mappedProducts: Product[]; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { rawRows: [], mappedProducts: [], error: 'Supabase credentials are not configured in environment variables.' };
  }

  try {
    const { data, error } = await supabase
      .from('Product')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching admin products from Supabase:', error);
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
 * Add a new product to Supabase "Product" table
 */
export async function createProductInSupabase(formData: SupabaseProductForm): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase credentials are not configured.' };
  }

  try {
    const basePayload: Record<string, any> = {
      Name: formData.Name,
      Price: Number(formData.Price),
      Description: formData.Description || '',
      Image_URL: formData.Image_URL || '',
      Stock: Number(formData.Stock || 0),
      Sku: formData.Sku || '',
      category: formData.category || 'Kurtis',
      color: formData.color || '',
      discount_price: formData.discount_price !== '' && formData.discount_price !== null ? Number(formData.discount_price) : null,
      size: formData.size || ''
    };

    let rowPayload: Record<string, any> = { ...basePayload, Is_available: Boolean(formData.is_available) };

    console.log('Inserting into Product table:', rowPayload);

    let { data, error } = await supabase
      .from('Product')
      .insert([rowPayload])
      .select();

    if (error && (error.message?.includes('does not exist') || error.code === '42703')) {
      rowPayload = { ...basePayload, is_available: Boolean(formData.is_available) };
      const retryRes = await supabase.from('Product').insert([rowPayload]).select();
      error = retryRes.error;
    }

    if (error) {
      console.error('Supabase create product error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Unexpected error creating product:', err);
    return { success: false, error: err.message || 'Failed to create product' };
  }
}

/**
 * Update an existing product in Supabase "Product" table
 */
export async function updateProductInSupabase(id: string | number, formData: SupabaseProductForm): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase credentials are not configured.' };
  }

  try {
    const basePayload: Record<string, any> = {
      Name: formData.Name,
      Price: Number(formData.Price),
      Description: formData.Description || '',
      Image_URL: formData.Image_URL || '',
      Stock: Number(formData.Stock || 0),
      Sku: formData.Sku || '',
      category: formData.category || 'Kurtis',
      color: formData.color || '',
      discount_price: formData.discount_price !== '' && formData.discount_price !== null ? Number(formData.discount_price) : null,
      size: formData.size || ''
    };

    let rowPayload: Record<string, any> = { ...basePayload, Is_available: Boolean(formData.is_available) };

    console.log(`Updating Product table row id ${id}:`, rowPayload);

    let { error } = await supabase
      .from('Product')
      .update(rowPayload)
      .eq('id', id);

    if (error && (error.message?.includes('does not exist') || error.code === '42703')) {
      rowPayload = { ...basePayload, is_available: Boolean(formData.is_available) };
      const retryRes = await supabase.from('Product').update(rowPayload).eq('id', id);
      error = retryRes.error;
    }

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
 * Delete a product from Supabase "Product" table
 */
export async function deleteProductInSupabase(id: string | number): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase credentials are not configured.' };
  }

  try {
    console.log(`Deleting Product table row id ${id}`);
    const { error } = await supabase
      .from('Product')
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
