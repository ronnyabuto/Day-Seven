import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/env'

export function createClient() {
    return createBrowserClient(
        env.SUPABASE.URL,
        env.SUPABASE.ANON_KEY
    )
}
