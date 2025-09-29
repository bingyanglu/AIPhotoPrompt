import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

const TOKEN_COOKIE = 'admin_session'
const TOKEN_EXPIRES_SECONDS = 60 * 60 * 2 // 2 hours

function getSecretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not configured')
  }
  return new TextEncoder().encode(secret)
}

export async function createAdminSessionCookie(username: string) {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_EXPIRES_SECONDS}s`)
    .sign(getSecretKey())

  return { token, maxAge: TOKEN_EXPIRES_SECONDS }
}

export async function verifyAdminSessionToken(token: string | undefined) {
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    return payload
  } catch (error) {
    console.warn('[admin] session verify failed', error)
    return null
  }
}

export function getAdminSessionCookieName() {
  return TOKEN_COOKIE
}

export function clearAdminSessionCookie() {
  return { name: TOKEN_COOKIE, value: '', maxAge: 0 }
}

export type AdminSessionPayload = JWTPayload & { username?: string }
