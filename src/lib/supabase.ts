import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase Configuration with robust fallbacks
export const SUPABASE_URL =
  ((import.meta as any).env?.VITE_SUPABASE_URL as string) ||
  (typeof process !== 'undefined' ? (process.env as any)?.SUPABASE_URL : '') ||
  'https://vkguvrnymuoppisafttw.supabase.co';

export const SUPABASE_ANON_KEY =
  ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) ||
  (typeof process !== 'undefined' ? (process.env as any)?.SUPABASE_ANON_KEY : '') ||
  'sb_publishable_a-FMI4wwGqFB5r4ZUgTT-A_dDRM6NI-';

export const isSupabaseConfigured: boolean = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Create Supabase client instance
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
