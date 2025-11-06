// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// Keep this on Node for stability
export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  // If no code in URL, go back to login
  if (!code) {
    return NextResponse.redirect(new URL('/login', url.origin));
  }

  // We’ll end by sending people to /dashboard
  const res = NextResponse.redirect(new URL('/dashboard', url.origin));

  // Create a Supabase server client.
  // We only IMPLEMENT `set` and `remove` here — no `get` needed.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // We don't need to read any cookies for the code exchange
        get(_name: string) {
          return undefined;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Write auth cookies onto the outgoing response
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          // Clear cookie on the outgoing response
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Turn the `?code=` into a real session (Supabase sets cookies via `set` above)
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Supabase login error:', error.message);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, url.origin)
    );
  }

  return res;
}
