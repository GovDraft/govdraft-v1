// app/auth/callback/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import createBrowserClient from '../../../lib/supabaseClient'; // <-- fixed path

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [msg] = useState('Finishing login…');

  useEffect(() => {
    async function run() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');

        if (!code) {
          router.replace('/login?error=missing%20code');
          return;
        }

        // Browser client handles PKCE & magic links.
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          router.replace(`/login?error=${encodeURIComponent(error.message)}`);
          return;
        }

        router.replace('/dashboard');
      } catch (e: any) {
        router.replace(
          `/login?error=${encodeURIComponent(e?.message || 'login failed')}`
        );
      }
    }
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ display: 'grid', placeItems: 'center', height: '60vh' }}>
      <p>{msg}</p>
    </main>
  );
}
