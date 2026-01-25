import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

// Admin client with service role key for backend operations
// helping us bypass RLS for the "Ghost" engine
export const adminClient = env.SUPABASE.SERVICE_ROLE_KEY
    ? createClient(env.SUPABASE.URL, env.SUPABASE.SERVICE_ROLE_KEY)
    : null
