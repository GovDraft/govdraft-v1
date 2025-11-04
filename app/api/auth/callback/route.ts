import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    // no code, go back to login
    return NextResponse.redirect(new URL('/login', url.origin));
  }

  // Connect to Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Try to exchange that code for a login session
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL('/login', url.origin));
  }

  // 🎉 If login works, send them to dashboard
  return NextResponse.redirect(new URL('/dashboard', url.origin));
}
