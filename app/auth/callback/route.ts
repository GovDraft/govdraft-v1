// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { cookies as nextCookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export const runtime = 'nodejs' // route handlers run on the Edge by default; we want Node for SSR cookies

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const redirectTo = url.searchParams.get('redirect') || '/dashboard'

  // No code? Back to login.
  if (!code) {
    return NextResponse.redirect(new URL('/login', url.origin))
  }

  // Prepare a response we'll attach auth cookies to
  const res = NextResponse.redirect(new URL(redirectTo, url.origin))

  // Use Next's cookie store so we can read/set individual cookie values
  const cookieStore = nextCookies()

  // Supabase server client that can set/remove cookies on the response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Return just the cookie value (or undefined if missing)
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // Proper delete: set empty value + maxAge 0
          res.cookies.set({ name, value: '', ...options, maxAge: 0 })
        },
      },
    }
  )

  // Exchange auth code for a real session (sets the auth cookies above)
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Supabase login error:', error.message)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, url.origin)
    )
  }

  // Success — send the user to the requested destination (or /dashboard)
  return res
}
