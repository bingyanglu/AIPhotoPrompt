'use client'

import { useState } from 'react'
import type { SoraInviteRow } from '@/lib/soraInvites'

interface InviteListClientProps {
  initialInvites: SoraInviteRow[]
}

interface InviteSlot {
  label: string
  field: keyof Pick<SoraInviteRow, 'used_once' | 'used_twice' | 'used_thrice' | 'used_fourth'>
}

const SLOTS: InviteSlot[] = [
  { label: 'First use', field: 'used_once' },
  { label: 'Second use', field: 'used_twice' },
  { label: 'Third use', field: 'used_thrice' },
  { label: 'Fourth use', field: 'used_fourth' }
]

function remaining(invite: SoraInviteRow): number {
  const used = SLOTS.filter((slot) => invite[slot.field]).length
  return 4 - used
}

function sortInvites(invites: SoraInviteRow[]): SoraInviteRow[] {
  return [...invites].sort((a, b) => {
    const remainingA = remaining(a)
    const remainingB = remaining(b)
    if (remainingA !== remainingB) return remainingB - remainingA
    return new Date(b.updated_at ?? 0).getTime() - new Date(a.updated_at ?? 0).getTime()
  })
}

export default function InviteListClient({ initialInvites }: InviteListClientProps) {
  const [invites, setInvites] = useState(() => sortInvites(initialInvites))
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null)

  const handleMark = async (inviteCode: string, slotIndex: number) => {
    if (isSubmitting) return
    setIsSubmitting(`${inviteCode}-${slotIndex}`)

    try {
      const res = await fetch('/api/sora-invite/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode, slot: slotIndex + 1 })
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.reason || 'Failed to mark invite code')
      }

      setInvites((prev) => {
        const next = prev.map((invite) => {
          if (invite.invite_code !== inviteCode) return invite
          const updated: SoraInviteRow = {
            ...invite,
            updated_at: new Date().toISOString()
          }
          const field = SLOTS[slotIndex].field
          updated[field] = true
          return updated
        })
        return sortInvites(next)
      })
    } catch (error) {
      console.error(error)
      alert('Unable to mark this slot. It may already be used or the request failed.')
    } finally {
      setIsSubmitting(null)
    }
  }

  if (invites.length === 0) {
    return (
      <div className="mt-12 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-10 text-center text-sm text-gray-600">
        No invite codes shared yet. Add the first one and help the community get started!
      </div>
    )
  }

  return (
    <div className="mt-12 overflow-x-auto rounded-lg border-2 border-gray-900 bg-white shadow-sm">
      <table className="w-full min-w-[720px] table-fixed">
        <thead className="bg-gray-100 text-left text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
          <tr>
            <th className="px-4 py-3 text-gray-700">Invite code</th>
            <th className="px-4 py-3 text-gray-700">Remaining</th>
            {SLOTS.map((slot) => (
              <th key={slot.field} className="px-4 py-3 text-gray-700">{slot.label}</th>
            ))}
            <th className="px-4 py-3 text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invites.map((invite) => {
            const remainingUses = remaining(invite)
            return (
              <tr key={invite.invite_code} className="border-t border-gray-200 text-sm text-gray-700">
                <td className="px-4 py-3 align-middle font-mono text-sm font-semibold text-gray-900">
                  {invite.invite_code}
                </td>
                <td className="px-4 py-3 align-middle text-center text-xs uppercase tracking-[0.3em] text-gray-500">
                  {remainingUses}
                </td>
                {SLOTS.map((slot, slotIndex) => {
                  const isChecked = invite[slot.field]
                  const isBusy = isSubmitting === `${invite.invite_code}-${slotIndex}`
                  return (
                    <td key={slot.field} className="px-4 py-3 align-middle text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isChecked || isBusy}
                        onChange={() => {
                          if (isChecked) return
                          void handleMark(invite.invite_code, slotIndex)
                        }}
                      />
                    </td>
                  )
                })}
                <td className="px-4 py-3 align-middle text-right">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(invite.invite_code).catch(() => undefined)}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900"
                  >
                    Copy
                    <span aria-hidden>→</span>
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
