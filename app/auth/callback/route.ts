// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login', url.origin));
  }

  // Prepare a redirect to /dashboard
  const res = NextResponse.redirect(new URL('/dashboard', url.origin));

  // Create Supabase server client that can write cookies to the response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // In Next.js 15, cookies() returns a Promise, so handle it properly
          try {
            const store = cookies();
            // @ts-ignore
            return store.get(name)?.value;
          } catch {
            return undefined;
          }
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Exchange the code for a session (sets auth cookies)
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Supabase login error:', error.message);
    return NextResponse.redirect(new URL(`/login?error=${error.message}`, url.origin));
  }

  return res;
}
