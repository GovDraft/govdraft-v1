// app/auth/callback/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// This runs whenever someone visits /auth/callback?code=XYZ
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code'); // grab the ?code from the link

  // Get access to Next.js cookies (so we can store the login session)
  const cookieStore = cookies();

  // Create a Supabase "server" client — this version can handle cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,        // from Vercel Env Vars
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,   // from Vercel Env Vars
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // If we got a code, ask Supabase to turn it into a real session
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
    return NextResponse.redirect(`${url.origin}/dashboard`);
  }

  // No code? Go back to login
  return NextResponse.redirect(`${url.origin}/login`);
}
