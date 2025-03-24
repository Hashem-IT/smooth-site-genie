
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// URL und Key aus Umgebungsvariablen abrufen
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Überprüfen, ob die Umgebungsvariablen gesetzt sind und Warnungen ausgeben
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL oder Anon Key fehlt. Bitte stellen Sie sicher, dass die Umgebungsvariablen korrekt gesetzt sind.');
  console.error('Sie müssen die .env-Datei mit Ihren tatsächlichen Supabase-Zugangsdaten aktualisieren.');
  console.error('Die aktuellen Werte sind Platzhalter und funktionieren nicht für tatsächliche API-Aufrufe.');
}

// Dummy-Werte für Entwicklungszwecke, wenn keine echten Werte verfügbar sind
// Dies verhindert Abstürze während der Entwicklung
const fallbackUrl = supabaseUrl || 'https://placeholder-project.supabase.co';
const fallbackKey = supabaseAnonKey || 'placeholder-key-for-development-only';

// Supabase-Client mit Fallback-Werten erstellen
export const supabase = createClient<Database>(fallbackUrl, fallbackKey);
