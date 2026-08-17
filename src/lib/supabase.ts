import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read env variables (supporting both VITE_ prefix and standard process.env)
const metaEnv = (import.meta as any).env || {};
const supabaseUrl =
  (metaEnv.VITE_SUPABASE_URL as string) ||
  (typeof process !== 'undefined' ? process.env.SUPABASE_URL : '') ||
  '';

const supabaseAnonKey =
  (metaEnv.VITE_SUPABASE_ANON_KEY as string) ||
  (typeof process !== 'undefined' ? process.env.SUPABASE_ANON_KEY : '') ||
  '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase URL or Anon Key is missing. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
  );
}

// Create Supabase client (using empty strings gracefully if not configured yet to prevent initial runtime crash)
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
