import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { ENV_CONFIG } from '../config/env';

const supabaseUrl = ENV_CONFIG.SUPABASE.URL;
const supabaseAnonKey = ENV_CONFIG.SUPABASE.ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables - running in static mode');
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://dummy.supabase.co',
  supabaseAnonKey || 'dummy-key'
);