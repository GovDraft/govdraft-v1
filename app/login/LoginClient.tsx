'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import createBrowserClient from '../../lib/supabaseClient';

export default function LoginClient({ initialError }: { initialError?: string } = {}) {
  const router = useRouter();
  const supabase = createBrowserClient();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string>(initialError || '');

  // If already logged in, skip login page
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) router.replace('/dashboard');
    });
  }, [router, supabase]);

  // Surface ?error=... from callback
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) setMessage(error);
  }, [searchParams]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    // If user came here from a protected page, middleware attached ?redirect=...
    const redirect = searchParams.get('redirect') || '/dashboard';

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(
          redirect
        )}`,
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
