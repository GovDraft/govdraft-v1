// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// Optional: run on the edge (fast)
export const runtime = 'edge';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  // No code? Go back to /login with a tiny message.
  if (!code) {
    return NextResponse.redirect(new URL('/login', url.origin));
  }

  // We only need to SET/REMOVE cookies here (Supabase writes the auth cookies).
  // We do NOT read cookies, so we avoid the "cookies().get is a Promise" type issue entirely.
  const res = NextResponse.redirect(new URL('/dashboard', url.origin));
  const cookieStore = await cookies(); // Next 15 returns a Promise here

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // do NOT read in this handler
        get: () => undefined,

        set(name: string, value: string, options: CookieOptions) {
          // write the cookie to both the response and the request store
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

  // Turn the ?code= into a real session (Supabase sets the cookies via our wrappers above)
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    // If something goes wrong, bounce back to login with a tiny error message
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, url.origin)
    );
  }

  return res;
}
