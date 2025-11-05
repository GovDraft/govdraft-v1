// app/login/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import createBrowserClient from '../../lib/supabaseClient';

export default function LoginPage() {
  const supabase = createBrowserClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // If already logged in, go to dashboard
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) router.replace('/dashboard');
    });
  }, [router, supabase]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // only log in existing users
        // IMPORTANT: this must match your route path below
        emailRedirectTo: 'https://govdraft-v1.vercel.app/auth/callback',
      },
    });

    if (error) setMessage(error.message);
    else setMessage('✅ Check your email for the login link!');
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 100 }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', gap: 10 }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 10, width: 280 }}
        />
        <button type="submit" style={{ padding: 10 }}>Send Magic Link</button>
      </form>
      {message && <p style={{ marginTop: 16 }}>{message}</p>}
    </main>
  );
}
