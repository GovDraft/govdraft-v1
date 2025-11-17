// govdraft-v1/app/actions/projects.ts
'use server'

import { z } from 'zod'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@supabase/ssr'

const CreateProjectSchema = z.object({
  name: z.string().trim().min(1, 'Project name is required').max(200),
  description: z.string().trim().max(2000).optional(),
  naics_code: z.string().trim().max(10).optional(),
  agency: z.string().trim().max(200).optional(),
})

const RenameProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1, 'Project name is required').max(200),
})

const ProjectIdSchema = z.object({
  id: z.string().uuid(),
})

function getSupabaseServer() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
      },
    }
  )
}

export async function createProject(formData: FormData) {
  const parsed = CreateProjectSchema.safeParse({
    name: formData.get('name'),
    description: (formData.get('description') as string) || undefined,
    naics_code: (formData.get('naics_code') as string) || undefined,
    agency: (formData.get('agency') as string) || undefined,
  })

  if (!parsed.success) {
    const message = parsed.error.errors.map(e => e.message).join(', ')
    return { ok: false as const, error: message }
  }

  const supabase = getSupabaseServer()
  const { data: auth } = await supabase.auth.getUser()
  const user = auth?.user

  if (!user) {
    return { ok: false as const, error: 'Not signed in' }
  }

  const payload = {
    owner_id: user.id,
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    naics_code: parsed.data.naics_code ?? null,
    agency: parsed.data.agency ?? null,
  }

  const { error } = await supabase.from('projects').insert(payload)

  if (error) {
    return { ok: false as const, error: error.message }
  }

  revalidatePath('/dashboard')
  return { ok: true as const }
}

export async function renameProject(formData: FormData) {
  const parsed = RenameProjectSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
  })

  if (!parsed.success) {
    const message = parsed.error.errors.map(e => e.message).join(', ')
    return { ok: false as const, error: message }
  }

  const supabase = getSupabaseServer()
  const { data: auth } = await supabase.auth.getUser()
  const user = auth?.user

  if (!user) {
    return { ok: false as const, error: 'Not signed in' }
  }

  const { error } = await supabase
    .from('projects')
    .update({ name: parsed.data.name, updated_at: new Date().toISOString() })
    .eq('id', parsed.data.id)

  if (error) {
    return { ok: false as const, error: error.message }
  }

  revalidatePath('/dashboard')
  return { ok: true as const }
}

export async function archiveProject(formData: FormData) {
  const parsed = ProjectIdSchema.safeParse({
    id: formData.get('id'),
  })

  if (!parsed.success) {
    return { ok: false as const, error: 'Invalid project id' }
  }

  const supabase = getSupabaseServer()
  const { data: auth } = await supabase.auth.getUser()
  const user = auth?.user

  if (!user) {
    return { ok: false as const, error: 'Not signed in' }
  }

  const { error } = await supabase
    .from('projects')
    .update({
      is_archived: true,
      status: 'archived',
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.id)

  if (error) {
    return { ok: false as const, error: error.message }
  }

  revalidatePath('/dashboard')
  return { ok: true as const }
}

export async function deleteProject(formData: FormData) {
  const parsed = ProjectIdSchema.safeParse({
    id: formData.get('id'),
  })

  if (!parsed.success) {
    return { ok: false as const, error: 'Invalid project id' }
  }

  const supabase = getSupabaseServer()
  const { data: auth } = await supabase.auth.getUser()
  const user = auth?.user

  if (!user) {
    return { ok: false as const, error: 'Not signed in' }
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', parsed.data.id)

  if (error) {
    return { ok: false as const, error: error.message }
  }

  revalidatePath('/dashboard')
  return { ok: true as const }
}
