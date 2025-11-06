// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export const runtime = 'edge';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  // No code? Go back to login.
  if (!code) return NextResponse.redirect(new URL('/login', url.origin));

  // We’ll redirect to /dashboard after we set the session.
  const res = NextResponse.redirect(new URL('/dashboard', url.origin));
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // 👇 IMPORTANT: magic links are "implicit" flow (no PKCE code_verifier)
      auth: { flowType: 'implicit' },

      // we only SET/REMOVE cookies here (don’t try to read)
      cookies: {
        get() {
          return undefined;
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options });
          cookieStore.set(name, value, options as any);
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: '', ...options, maxAge: 0 });
          cookieStore.set(name, '', { ...(options as any), maxAge: 0 });
        },
      },
    }
  );

  // Turn the ?code= from the email into a real session
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, url.origin)
    );
  }

  return res;
}
