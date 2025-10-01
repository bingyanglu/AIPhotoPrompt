import { NextResponse } from 'next/server'
import { getSupabaseServiceClient, isSupabaseServiceConfigured } from '@/lib/supabase/client'

const ALLOWED_SLOTS = new Map([
  [1, 'used_once'],
  [2, 'used_twice'],
  [3, 'used_thrice'],
  [4, 'used_fourth']
] as const)

type SlotKey = (typeof ALLOWED_SLOTS)[number]

export async function POST(request: Request) {
  if (!isSupabaseServiceConfigured) {
    return NextResponse.json({ success: false, reason: 'service role key not set' }, { status: 500 })
  }

  const body = await request.json().catch(() => ({}))
  const inviteCode = typeof body?.inviteCode === 'string' ? body.inviteCode.trim().toUpperCase() : ''
  const slot = Number(body?.slot)
  const column = ALLOWED_SLOTS.get(slot)

  if (!inviteCode || !column) {
    return NextResponse.json({ success: false, reason: 'invalid payload' }, { status: 400 })
  }

  try {
    const supabase = getSupabaseServiceClient()

    const { data, error } = await supabase
      .from('sora_invite_usage')
      .select(`${column}`)
      .eq('invite_code', inviteCode)
      .maybeSingle()

    if (error) {
      console.error('[sora-invite mark] fetch error', error)
      return NextResponse.json({ success: false }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ success: false, reason: 'invite code not found' }, { status: 404 })
    }

    if (data[column as SlotKey]) {
      return NextResponse.json({ success: false, reason: 'already used' }, { status: 409 })
    }

    const { error: updateError } = await supabase
      .from('sora_invite_usage')
      .update({ [column]: true })
      .eq('invite_code', inviteCode)

    if (updateError) {
      console.error('[sora-invite mark] update error', updateError)
      return NextResponse.json({ success: false }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[sora-invite mark] unexpected', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
