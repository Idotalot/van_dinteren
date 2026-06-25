import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createClient('https://placeholder.supabase.co', 'placeholder');

export interface Motor {
  id: string;
  merk: string;
  type: string;
  bouwjaar: number;
  km: number;
  prijs: number;
  kleur: string;
  beschrijving: string;
  foto_url: string | null;
  beschikbaar: boolean;
  created_at: string;
}
