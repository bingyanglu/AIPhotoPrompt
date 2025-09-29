import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAdminSessionCookieName } from '@/lib/auth/admin-session'

export async function POST() {
  const cookieStore = cookies()
  cookieStore.set(getAdminSessionCookieName(), '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  })

  return NextResponse.json({ success: true })
}
