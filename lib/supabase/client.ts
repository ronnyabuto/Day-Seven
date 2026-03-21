import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/env'

export function createClient() {
    if (!env.SUPABASE.URL || !env.SUPABASE.ANON_KEY) return null
    return createBrowserClient(
        env.SUPABASE.URL,
        env.SUPABASE.ANON_KEY
    )
}
