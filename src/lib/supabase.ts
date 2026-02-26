import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Explicitly cast the client to ensure types are correctly inferred
export const supabase = createClient(supabaseUrl, supabaseAnonKey) as SupabaseClient<Database>;
