'use server'

import { z } from 'zod'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@supabase/ssr'

const UpdateProfileSchema = z.object({
  full_name: z.string().trim().max(200).optional(),
  company: z.string().trim().max(200).optional(),
  phone: z.string().trim().max(50).optional(),
})

function getSupabaseServer() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // FIX: next/headers returns a Promise-like cookie store in Next 15
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
      },
    }
  )
}

export async function updateProfile(formData: FormData) {
  const parsed = UpdateProfileSchema.safeParse({
    full_name: formData.get('full_name'),
    company: formData.get('company'),
    phone: formData.get('phone'),
  })

  if (!parsed.success) {
    const message = parsed.error.issues.map(i => i.message).join(', ')
    return { ok: false as const, error: message }
  }

  const supabase = getSupabaseServer()
  const { data: auth } = await supabase.auth.getUser()
  const user = auth?.user

  if (!user) {
    return { ok: false as const, error: 'Not signed in' }
  }

  const updates = {
    full_name: parsed.data.full_name ?? null,
    company: parsed.data.company ?? null,
    phone: parsed.data.phone ?? null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) {
    return { ok: false as const, error: error.message }
  }

  revalidatePath('/dashboard')
  return { ok: true as const }
}