// lib/supabaseClient.ts
'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Use this in client components:
 *   const supabase = createBrowserClient();
 */
export default function createBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
