import { getSupabaseClient } from '@/lib/supabase/client'

export interface SoraInviteRow {
  invite_code: string
  used_once: boolean
  used_twice: boolean
  used_thrice: boolean
  used_fourth: boolean
  updated_at: string
}

function remainingUses(row: SoraInviteRow): number {
  const used = [row.used_once, row.used_twice, row.used_thrice, row.used_fourth].filter(Boolean).length
  return 4 - used
}

export async function fetchSoraInvites(): Promise<SoraInviteRow[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('sora_invite_usage')
    .select('invite_code, used_once, used_twice, used_thrice, used_fourth, updated_at')

  if (error) {
    console.error('Failed to fetch sora_invite_usage:', error)
    return []
  }

  return (data ?? []).sort((a, b) => {
    const remainingA = remainingUses(a as SoraInviteRow)
    const remainingB = remainingUses(b as SoraInviteRow)
    if (remainingA !== remainingB) {
      return remainingB - remainingA
    }
    return new Date(b.updated_at ?? 0).getTime() - new Date(a.updated_at ?? 0).getTime()
  }) as SoraInviteRow[]
}
