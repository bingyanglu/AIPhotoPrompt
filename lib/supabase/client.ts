import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
export const isSupabaseServiceConfigured = Boolean(supabaseUrl && supabaseServiceRoleKey)

let client: SupabaseClient | null = null
let serviceClient: SupabaseClient | null = null

if (isSupabaseConfigured) {
  client = createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: { persistSession: false }
  })
} else {
  console.warn('[supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Falling back to local JSON data.')
}

if (isSupabaseServiceConfigured) {
  serviceClient = createClient(supabaseUrl!, supabaseServiceRoleKey!, {
    auth: { persistSession: false }
  })
}

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    throw new Error('Supabase client not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }
  return client
}

export function getSupabaseServiceClient(): SupabaseClient {
  if (!serviceClient) {
    throw new Error('Supabase service client not configured. Set SUPABASE_SERVICE_ROLE_KEY.')
  }
  return serviceClient
}
