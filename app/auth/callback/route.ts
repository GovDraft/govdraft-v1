// app/auth/callback/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Keep this on Node runtime (avoids cookies() typing issues on edge in Next 15)
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  // Where we want to end up:
  const redirectTarget = code ? '/dashboard' : '/login';
  const res = NextResponse.redirect(new URL(redirectTarget, url.origin));

  // If no code, just go back to login
  if (!code) return res;

  // Server Supabase client that ONLY sets/removes cookies on the response.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Do not read cookies in this route
        get() {
          return undefined as any;
        },
        set(name, value, options) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          // emulate remove by setting empty value
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Turn the magic-link ?code= into a real session cookie
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
