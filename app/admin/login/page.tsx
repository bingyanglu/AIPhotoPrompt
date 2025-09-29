'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const adminToken = process.env.NEXT_PUBLIC_ADMIN_ACCESS_TOKEN

    if (adminToken && token.trim() === adminToken) {
      router.push('/admin/prompts')
    } else {
      setError('访问令牌不正确，请重试。')
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border-2 border-gray-900 bg-white p-8 shadow-lg">
        <h1 className="font-display text-2xl text-gray-900">管理员登录</h1>
        <p className="mt-2 text-sm text-gray-600">请输入访问令牌，以进入提示词管理后台。</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">访问令牌</label>
            <input
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="请输入 ADMIN_ACCESS_TOKEN"
              required
            />
          </div>

          {error && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md border-2 border-gray-900 bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? '验证中…' : '立即进入'}
          </button>
        </form>
      </div>
    </div>
  )
}
