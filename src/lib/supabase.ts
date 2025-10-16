import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_supabase_url;
const supabaseAnonKey = import.meta.env.VITE_chave_anon_supabase;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
