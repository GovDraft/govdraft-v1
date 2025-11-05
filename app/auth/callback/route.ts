// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    // No code? Go back to login.
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // We prepare the redirect response first, so we can write cookies to it.
  const res = NextResponse.redirect(new URL('/dashboard', request.url));

  // Read any existing cookies (Next.js 15 async cookies API)
  const cookieStore = await cookies();

  // Create a server client that writes cookies **onto the redirect response**
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
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

  // Turn the code into a real session (sets auth cookies on `res`)
  await supabase.auth.exchangeCodeForSession(code);

  // Send the user to /dashboard **with** the auth cookies set.
  return res;
}
