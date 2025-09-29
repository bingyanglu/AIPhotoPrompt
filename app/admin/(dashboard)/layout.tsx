import type { ReactNode } from 'react'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAdminSessionCookieName, verifyAdminSessionToken, type AdminSessionPayload } from '@/lib/auth/admin-session'
import AdminSidebar from './sidebar'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(getAdminSessionCookieName())?.value
  const session = await verifyAdminSessionToken(sessionCookie)
  const username = (session as AdminSessionPayload | null)?.username ?? 'Admin'

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
            <div>
              <h1 className="font-display text-2xl text-gray-900">AI Photo Prompt Lab Admin</h1>
              <p className="text-sm text-gray-600">Welcome back, {username}</p>
            </div>
            <Link
              href="/admin/logout"
              className="rounded-md border-2 border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
            >
              Sign out
            </Link>
          </header>
          <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
        </div>
      </div>
    </div>
  )
}
