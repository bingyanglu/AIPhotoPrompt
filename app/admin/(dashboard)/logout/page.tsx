'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch('/api/admin/auth/logout', { method: 'POST' })
      } catch (error) {
        console.error('[admin] logout failed', error)
      } finally {
        router.replace('/admin/login')
      }
    }

    logout()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <p className="text-sm text-gray-600">正在退出登录…</p>
    </div>
  )
}
