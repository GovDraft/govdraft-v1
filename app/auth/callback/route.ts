// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  // No code? Go back to login
  if (!code) {
    return NextResponse.redirect(new URL('/login', url.origin));
  }

  // Prepare the response we will send back (we'll attach auth cookies to it)
  const res = NextResponse.redirect(new URL('/dashboard', url.origin));

  // In Next 15 route handlers, cookies() is async and read-only
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // read cookies from the incoming request
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // write cookies onto the outgoing response
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Turn the ?code=... into a real session cookie
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, url.origin)
    );
  }

  // All good → go to the dashboard
  return res;
}
