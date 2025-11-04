'use client';

import { useState } from 'react';
import createBrowserClient from '../../lib/supabaseClient';

export default function LoginPage() {
  const supabase = createBrowserClient();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // 👇 this sends them to our callback (next step)
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) setMessage(error.message);
    else setMessage('✅ Check your email for the login link!');
  };

  return (
    <main style={{ textAlign: 'center', marginTop: 100 }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 8, marginRight: 8 }}
        />
        <button type="submit">Send Magic Link</button>
      </form>
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </main>
  );
}
