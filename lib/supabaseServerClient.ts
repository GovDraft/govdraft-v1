'use server';

import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function createServerSupabaseClient() {
  // In Next.js 15, cookies() can be async in server contexts
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options?: CookieOptions) => {
          // cookieStore.set accepts name/value/options in Next 15
          cookieStore.set(name, value, options as any);
        },
        remove: (name: string, options?: CookieOptions) => {
          cookieStore.set(name, '', { ...(options as any), maxAge: 0 });
        },
      },
    }
  );
}
