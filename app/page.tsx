'use client';

import { useState } from 'react';
import createBrowserClient from '../lib/supabaseClient';   // ← exactly one "../"

export default function LoginPage() {
  const supabase = createBrowserClient()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('✅ Check your email for the login link!')
    }
  }

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 100,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: 8,
            marginBottom: 10,
            borderRadius: 4,
            border: '1px solid #ccc',
          }}
        />
        <button
          type="submit"
          style={{
            padding: 8,
            borderRadius: 4,
            background: '#008060',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Send Magic Link
        </button>
      </form>
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </main>
  )
}
