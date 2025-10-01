import { NextResponse } from 'next/server'
import { getSupabaseServiceClient, isSupabaseServiceConfigured } from '@/lib/supabase/client'

const SLOT_MAP = {
  1: 'used_once',
  2: 'used_twice',
  3: 'used_thrice',
  4: 'used_fourth'
} as const

type SlotIndex = keyof typeof SLOT_MAP
type SlotColumn = (typeof SLOT_MAP)[SlotIndex]

export async function POST(request: Request) {
  if (!isSupabaseServiceConfigured) {
    return NextResponse.json({ success: false, reason: 'service role key not set' }, { status: 500 })
  }

  const body = await request.json().catch(() => ({}))
  const inviteCode = typeof body?.inviteCode === 'string' ? body.inviteCode.trim().toUpperCase() : ''
  const slot = Number(body?.slot) as SlotIndex
  const column = SLOT_MAP[slot]

  if (!inviteCode || !column) {
    return NextResponse.json({ success: false, reason: 'invalid payload' }, { status: 400 })
  }

  try {
    const supabase = getSupabaseServiceClient()

    const { data: updatedRows, error: updateError } = await supabase
      .from('sora_invite_usage')
      .update({ [column]: true })
      .eq('invite_code', inviteCode)
      .eq(column, false)
      .select('invite_code')

    if (updateError) {
      console.error('[sora-invite mark] update error', updateError)
      return NextResponse.json({ success: false }, { status: 500 })
    }

    if (!updatedRows || updatedRows.length === 0) {
      const { data: exists } = await supabase
        .from('sora_invite_usage')
        .select('invite_code')
        .eq('invite_code', inviteCode)
        .maybeSingle()

      if (!exists) {
        return NextResponse.json({ success: false, reason: 'invite code not found' }, { status: 404 })
      }

      return NextResponse.json({ success: false, reason: 'already used' }, { status: 409 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[sora-invite mark] unexpected', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
