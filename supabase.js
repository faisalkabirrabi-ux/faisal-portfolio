import { createClient } from '@supabase/supabase-js'
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
// Stays null until you add your keys, so the site still works without a backend.
export const supabase = url && key ? createClient(url, key) : null
