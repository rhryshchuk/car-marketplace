import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Задай VITE_SUPABASE_URL і VITE_SUPABASE_ANON_KEY у .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
