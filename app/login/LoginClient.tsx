'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import createClient from '../../lib/supabaseClient';

export default function LoginClient({ initialError = '' }: { initialError?: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(
    initialError ? `⚠️ ${initialError}` : ''
  );

  // If already logged in, skip login
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) router.replace('/dashboard');
    });
  }, [router, supabase]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    // Preserve where the user was going (if middleware added ?redirect=...)
    const current = new URL(window.location.href);
    const redirect = current.searchParams.get('redirect') || '/dashboard';

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Send user back through our /auth/callback with the same destination
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
