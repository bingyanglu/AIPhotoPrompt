'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setError(result.message || '账号或密码错误')
        setLoading(false)
        return
      }

      router.replace('/admin/prompts')
    } catch (error) {
      console.error('[admin] login request failed', error)
      setError('登录失败，请稍后再试。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border-2 border-gray-900 bg-white p-8 shadow-xl">
        <h1 className="font-display text-2xl text-gray-900">管理员登录</h1>
        <p className="mt-2 text-sm text-gray-600">请输入账号和密码，以进入提示词管理后台。</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-700">账号</label>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="请输入 ADMIN_USERNAME"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">密码</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="请输入 ADMIN_PASSWORD"
              required
            />
          </div>

          {error && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md border-2 border-gray-900 bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? '登录中…' : '立即登录'}
          </button>
        </form>
      </div>
    </div>
  )
}
