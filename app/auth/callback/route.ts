// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// Ensure Node.js runtime (avoids some Edge quirks)
export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login', url.origin));
  }

  // Prepare a redirect response to /dashboard
  const res = NextResponse.redirect(new URL('/dashboard', url.origin));

  // ✅ In your Next version cookies() is async — await it
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          try {
            return cookieStore.get(name)?.value;
          } catch {
            return undefined;
          }
        },
        set(name: string, value: string, options: CookieOptions) {
          // Write to the outgoing response (so the browser gets the cookie)
          res.cookies.set({ name, value, ...options });
          // Best effort: also reflect in the server cookie bag if supported
          try {
            // Some Next versions allow setting here; ignore if not
            // @ts-ignore
            cookieStore.set?.({ name, value, ...options });
          } catch {}
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: '', ...options });
          try {
            // @ts-ignore
            cookieStore.set?.({ name, value: '', ...options });
          } catch {}
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Supabase login error:', error.message);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, url.origin)
    );
  }

  return res;
}
