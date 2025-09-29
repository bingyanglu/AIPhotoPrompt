import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminSessionCookie, getAdminSessionCookieName } from '@/lib/auth/admin-session'

export async function POST(request: Request) {
  const usernameEnv = process.env.ADMIN_USERNAME
  const passwordEnv = process.env.ADMIN_PASSWORD

  if (!usernameEnv || !passwordEnv) {
    return NextResponse.json({ success: false, message: '管理员账号未配置' }, { status: 500 })
  }

  try {
    const { username, password } = await request.json()

    if (username !== usernameEnv || password !== passwordEnv) {
      return NextResponse.json({ success: false, message: '账号或密码错误' }, { status: 401 })
    }

    const cookieStore = cookies()
    const { token, maxAge } = await createAdminSessionCookie(usernameEnv)
    cookieStore.set(getAdminSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin] login error', error)
    return NextResponse.json({ success: false, message: '登录失败' }, { status: 500 })
  }
}
