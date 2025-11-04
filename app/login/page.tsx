'use client'

import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabaseClient'

export default function LoginPage() {
  const supabase = createBrowserClient()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setMessage(error.message)
    else setMessage('Check your email for a login link!')
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 100 }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 8, marginBottom: 10 }}
        />
        <button type="submit" style={{ padding: 8 }}>Send Magic Link</button>
      </form>
      {message && <p>{message}</p>}
    </main>
  )
}
