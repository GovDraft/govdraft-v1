// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: { headers: req.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options: any) => res.cookies.set({ name, value, ...options }),
        remove: (name: string, options: any) => res.cookies.set({ name, value: '', ...options }),
      },
    }
  );

  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    const loginUrl = new URL('/login', req.url);
    // preserve the original path + query
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
