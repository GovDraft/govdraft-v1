// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  // Let Next.js continue as usual, but give us a response we can modify cookies on
  const res = NextResponse.next({ request: { headers: req.headers } });

  // Create a Supabase **server** client that reads/writes auth cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Is there a logged-in user?
  const { data } = await supabase.auth.getUser();

  // Not logged in? Send to /login and keep where they were going in ?redirect=
  if (!data?.user) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set(
      'redirect',
      req.nextUrl.pathname + req.nextUrl.search
    );
    return NextResponse.redirect(loginUrl);
  }

  // Logged in – carry on
  return res;
}

/**
 * What to protect:
 * - /dashboard and everything under it.
 * Add more entries like '/app/:path*' if you want to protect other sections.
 */
export const config = {
  matcher: ['/dashboard/:path*'],
};
