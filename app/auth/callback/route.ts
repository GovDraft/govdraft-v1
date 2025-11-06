// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const redirectTo = url.searchParams.get('redirect') || '/dashboard'

  // No code? Go back to login.
  if (!code) {
    return NextResponse.redirect(new URL('/login', url.origin))
  }

  // Where we’ll send the user after we finish the exchange.
  const res = NextResponse.redirect(new URL(redirectTo, url.origin))

  // 👇 Next 15: cookies() is a Promise — take a snapshot you can read synchronously.
  const cookieStore = await cookies()

  // Build a Supabase server client that can read existing cookies and write new ones.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // MUST be sync; we read from the snapshot we awaited above
        get(name: string) {
          return cookieStore.get(name)?.value // string | undefined
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Exchange the auth code for a session (sets the auth cookies via set/remove above)
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Supabase login error:', error.message)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, url.origin)
    )
  }

  // Success -> continue to the original destination
  return res
}
