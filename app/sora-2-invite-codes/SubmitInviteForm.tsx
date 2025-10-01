'use client'

import { useState } from 'react'

export default function SubmitInviteForm() {
  const [inviteCode, setInviteCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!inviteCode.trim()) return

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/sora-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: inviteCode.trim().toUpperCase() })
      })

      const data = await response.json().catch(() => ({}))

     if (!response.ok) {
       setMessage(data?.reason || 'Failed to submit invite code. Please try again.')
       return
     }

     setInviteCode('')
     setMessage('Thank you! Your invite code has been shared with the community.')
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    } catch (error) {
      console.error(error)
      setMessage('Unexpected error. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="rounded-lg border-2 border-gray-900 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 sm:flex-row">
        <label className="flex-1 text-left text-sm font-medium text-gray-700">
          Invite code
          <input
            type="text"
            name="invite"
            required
            maxLength={64}
            value={inviteCode}
            onChange={(event) => setInviteCode(event.target.value.toUpperCase())}
            placeholder="Paste your Sora 2 invite code"
            className="mt-2 w-full rounded-md border-2 border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            disabled={isSubmitting}
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-md border-2 border-gray-900 bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-auto"
        >
          {isSubmitting ? 'Submitting…' : 'Submit'}
          <span aria-hidden>→</span>
        </button>
      </div>
      {message && (
        <p className="mt-3 text-sm text-gray-600">{message}</p>
      )}
    </form>
  )
}
