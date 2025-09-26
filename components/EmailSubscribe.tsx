'use client'

import { useState } from 'react'

interface EmailSubscribeProps {
  className?: string
  size?: 'small' | 'medium' | 'large'
  showArrow?: boolean
  placeholder?: string
}

export default function EmailSubscribe({
  className = '',
  size = 'large',
  showArrow = true,
  placeholder = 'Your email address'
}: EmailSubscribeProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const targetUrl = 'https://socialprompt.substack.com/'

    setIsLoading(true)

    try {
      if (typeof window !== 'undefined') {
        window.open(targetUrl, '_blank', 'noopener,noreferrer')
      } else {
        console.log('Redirect to newsletter:', targetUrl)
      }
      setMessage('Opening newsletter signup…')
      setEmail('')
    } catch (error) {
      console.error('Newsletter redirect failed', error)
      setMessage('Redirect failed. Please visit socialprompt.substack.com manually.')
    } finally {
      setIsLoading(false)
    }
  }

  // 简化的尺寸配置
  const isLarge = size === 'large'
  const inputClass = isLarge 
    ? 'px-6 py-4 text-lg' 
    : 'px-4 py-3 text-base'
  const buttonClass = isLarge 
    ? 'px-8 py-4 text-lg font-medium' 
    : 'px-6 py-3 text-base font-medium'

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        {/* Email Input */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 rounded-md border-2 border-gray-900 bg-white placeholder-gray-500 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/40 disabled:cursor-not-allowed disabled:opacity-70 ${inputClass}`}
          disabled={isLoading}
          required
        />

        {/* Subscribe Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`${buttonClass} inline-flex items-center justify-center gap-2 rounded-md border-2 border-gray-900 bg-gray-900 text-white transition-colors duration-200 hover:bg-white hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Subscribing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Subscribe</span>
              {showArrow && <span aria-hidden>→</span>}
            </div>
          )}
        </button>
      </form>

      {/* Status Message */}
      {message && (
        <div className={`mt-3 text-center ${
          message.includes('Thanks') 
            ? 'text-green-600' 
            : 'text-red-600'
        }`}>
          <p className="text-sm">{message}</p>
        </div>
      )}
    </div>
  )
}
