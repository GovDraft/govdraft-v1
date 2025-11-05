// lib/supabaseServerClient.ts
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function createServerSupabase() {
  const cookieStore = await cookies();

  // RETURN a factory that gives you the client *and* a setter to attach cookies to a response
  return (response?: { setCookie: (name: string, value: string, options: CookieOptions) => void }) =>
    createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // If a response helper is passed in, write cookies to it (for redirects)
            response?.setCookie?.(name, value, options);
          },
          remove(name: string, options: CookieOptions) {
            response?.setCookie?.(name, '', options);
          },
        },
      }
    );
}
