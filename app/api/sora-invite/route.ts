import { NextResponse } from 'next/server'
import { getSupabaseServiceClient, isSupabaseServiceConfigured } from '@/lib/supabase/client'

const CODE_REGEX = /^[a-zA-Z0-9]{6}$/
const RATE_LIMIT_WINDOW_MS = 1000
const RATE_LIMIT_MAX = 10
const requestLog = new Map<string, number[]>()

function getClientIdentifier(request: Request): string {
  const header = request.headers.get('x-forwarded-for')
  if (!header) return 'unknown'
  return header.split(',')[0]?.trim() ?? 'unknown'
}

function rateLimitExceeded(identifier: string): boolean {
  const now = Date.now()
  const timestamps = (requestLog.get(identifier) ?? []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS)
  if (timestamps.length >= RATE_LIMIT_MAX) {
    requestLog.set(identifier, timestamps)
    return true
  }
  timestamps.push(now)
  requestLog.set(identifier, timestamps)
  return false
}

export async function POST(request: Request) {
  if (!isSupabaseServiceConfigured) {
    return NextResponse.json({ success: false, reason: 'service role key not set' }, { status: 500 })
  }

  const identifier = getClientIdentifier(request)
  if (rateLimitExceeded(identifier)) {
    return NextResponse.json({ success: false, reason: 'Too many submissions. Please slow down.' }, { status: 429 })
  }

  const body = await request.json().catch(() => ({}))
  const rawCode = typeof body?.inviteCode === 'string' ? body.inviteCode.trim() : ''

  if (!rawCode) {
    return NextResponse.json({ success: false, reason: 'invite code required' }, { status: 400 })
  }
  if (!CODE_REGEX.test(rawCode)) {
    return NextResponse.json({ success: false, reason: 'Invite code must be 6 characters (letters or numbers).' }, { status: 400 })
  }

  try {
    const supabase = getSupabaseServiceClient()

    const { count, error: countError } = await supabase
      .from('sora_invite_usage')
      .select('invite_code', { count: 'exact', head: true })

    if (countError) {
      console.error('[sora-invite] count error', countError)
      return NextResponse.json({ success: false }, { status: 500 })
    }

    if (typeof count === 'number' && count >= 20000) {
      return NextResponse.json({ success: false, reason: 'Invite code list is full. Please try again later.' }, { status: 507 })
    }

    const normalizedCode = rawCode.toUpperCase()

    const { error } = await supabase
      .from('sora_invite_usage')
      .insert({ invite_code: normalizedCode })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ success: false, reason: 'Invite code already exists.' }, { status: 409 })
      }
      console.error('[sora-invite] insert error', error)
      return NextResponse.json({ success: false }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[sora-invite] unexpected', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
