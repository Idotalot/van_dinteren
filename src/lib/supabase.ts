import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
