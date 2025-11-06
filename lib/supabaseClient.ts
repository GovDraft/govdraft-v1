// lib/supabaseClient.ts
'use client';

import { createBrowserClient } from '@supabase/ssr';

export default function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // 👇 Keep the browser in implicit flow, too (we’re using magic links)
      auth: {
        flowType: 'implicit',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    }
  );
}
