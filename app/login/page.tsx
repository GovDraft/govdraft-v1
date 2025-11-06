// app/login/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import createBrowserClient from '../../lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const supabase = createBrowserClient();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Read ?redirect= from the URL (default to /dashboard)
  const redirect = useMemo(
    () => search.get('redirect') || '/dashboard',
    [search]
  );

  // If already logged in, skip login page
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) router.replace('/dashboard');
    });
  }, [router, supabase]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    // Send a magic link that comes back to /auth/callback
    // and carries the redirect along
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(
          redirect
        )}`,
        shouldCreateUser: true,
      },
    });

    if (error) setMessage(error.message);
    else setMessage('✅ Check your email for the login link!');
  }

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 100,
      }}
    >
      <h1>Login</h1>

      {/* If you want, show where they’ll land after login */}
      <p style={{ opacity: 0.7, marginBottom: 12 }}>
        You’ll go to <code>{redirect}</code> after login
      </p>

      <form onSubmit={handleLogin} style={{ display: 'flex', gap: 10 }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 10, width: 280 }}
        />
        <button type="submit" style={{ padding: 10 }}>
          Send Magic Link
        </button>
      </form>

      {message && <p style={{ marginTop: 16 }}>{message}</p>}
    </main>
  );
}
