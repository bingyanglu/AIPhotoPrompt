import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { fetchSoraInvites } from '@/lib/soraInvites'

import SubmitInviteForm from './SubmitInviteForm'
import InviteListClient from './InviteListClient'
import { generateSEOMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata = generateSEOMetadata({
  title: 'Sora 2 Invite Codes – Community Share',
  description: 'Share and track Sora 2 invite codes for the community. Submit your code, mark used slots, and help others access Sora 2 freely.',
  path: '/sora-2-invite-codes',
  keywords: [
    'sora 2 invite codes',
    'sora 2 invite',
    'sora 2 prompt invite',
    'sora 2 community share'
  ]
})

export default async function SoraInvitePage() {
  const invites = await fetchSoraInvites()

  const totalCodes = invites.length
  const usedSlots = invites.reduce((sum, invite) => {
    return (
      sum +
      (invite.used_once ? 1 : 0) +
      (invite.used_twice ? 1 : 0) +
      (invite.used_thrice ? 1 : 0) +
      (invite.used_fourth ? 1 : 0)
    )
  }, 0)
  const totalSlots = totalCodes * 4
  const remainingSlots = totalSlots - usedSlots

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="bg-white py-20">
          <div className="container-custom">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center rounded-full border border-gray-200 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                Community Share
              </span>
              <h1 className="mt-6 font-display text-4xl text-gray-900 sm:text-5xl">
                Sora 2 Invite Codes · Share & Support
              </h1>
              <p className="mt-4 text-base text-gray-600 sm:text-lg">
                This page is a free community board to share Sora 2 invite codes. Submit your code to help others, and tick the slots you use so everyone can track availability transparently.
              </p>
              <p className="mt-4 text-sm text-gray-500">
                Built in the spirit of co-creation—every contribution keeps the community open and accessible.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-2xl">
              <SubmitInviteForm />
            </div>

            <div className="mx-auto mt-12 max-w-4xl">
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Total invite codes" value={totalCodes} />
                <StatCard label="Available uses" value={remainingSlots} accent />
                <StatCard label="Used slots" value={usedSlots} />
              </div>
            </div>

            <div className="mt-12 text-center text-sm text-gray-500">
              <p>
                Tip: once you mark a slot as used it can\'t be undone. Please confirm the invite works before ticking the checkbox.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-5xl">
              <InviteListClient initialInvites={invites} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

interface StatCardProps {
  label: string
  value: number
  accent?: boolean
}

function StatCard({ label, value, accent = false }: StatCardProps) {
  return (
    <div
      className={`rounded-lg border-2 ${accent ? 'border-emerald-500 bg-emerald-50' : 'border-gray-900 bg-white'} p-6 text-center shadow-sm`}
    >
      <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${accent ? 'text-emerald-600' : 'text-gray-900'}`}>
        {Intl.NumberFormat('en-US').format(value)}
      </p>
    </div>
  )
}
