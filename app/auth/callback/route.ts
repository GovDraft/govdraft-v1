// app/auth/callback/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// keep on Node runtime (fixes cookie type error in Next 15)
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  // where we want to go
  const redirectTarget = code ? '/dashboard' : '/login';
  const res = NextResponse.redirect(new URL(redirectTarget, url.origin));

  if (!code) return res;

  // create Supabase server client (only sets cookies)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get() {
          return undefined as any; // no reads
        },
        set(name, value, options) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // exchange ?code= for a real session cookie
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    res.headers.set(
      'Location',
      `/login?error=${encodeURIComponent(error.message)}`
    );
    res.status = 302;
  }

  return res;
}
