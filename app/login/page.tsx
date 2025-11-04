'use client';

import { useState } from 'react';
import createBrowserClient from '../../lib/supabaseClient';

export default function LoginPage() {
  const supabase = createBrowserClient();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,                          // create the user if they don't exist
        emailRedirectTo: `${window.location.origin}/dashboard`, // where the magic link lands
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('✅ Check your email for the login link!');
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
      <h1 style={{ fontSize: 72, marginBottom: 24 }}>Login</h1>

      <form onSubmit={handleLogin} style={{ display: 'flex', gap: 8 }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: 12,
            minWidth: 420,
            borderRadius: 6,
            border: '1px solid #c9ccd1',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '12px 18px',
            borderRadius: 6,
            background: '#e5e6eb',
            border: '1px solid #c9ccd1',
            cursor: 'pointer',
          }}
        >
          Send Magic Link
        </button>
      </form>

      {message && <p style={{ marginTop: 16, fontSize: 22 }}>{message}</p>}
    </main>
  );
}
