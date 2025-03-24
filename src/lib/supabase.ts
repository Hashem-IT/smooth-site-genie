
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Ersetzen Sie diese Werte mit Ihren eigenen Supabase-Anmeldedaten
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL oder Anon Key fehlt. Bitte stellen Sie sicher, dass die Umgebungsvariablen korrekt gesetzt sind.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
