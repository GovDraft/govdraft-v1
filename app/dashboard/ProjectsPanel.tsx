// govdraft-v1/app/dashboard/ProjectsPanel.tsx
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import ProjectsPanelClient from './ProjectsPanelClient'

export const runtime = 'nodejs'

export type Project = {
  id: string
  name: string
  status: string
  is_archived: boolean
  created_at: string
}

export default async function ProjectsPanel() {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
      },
    }
  )

  const { data: auth } = await supabase.auth.getUser()
  const user = auth?.user

  if (!user) {
    return null
  }

  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, name, status, is_archived, created_at')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="rounded-2xl border p-6">
        <h2 className="text-lg font-semibold mb-2">Projects</h2>
        <p className="text-red-700 text-sm">
          Could not load projects: {error.message}
        </p>
      </div>
    )
  }

  return (
    <ProjectsPanelClient projects={projects ?? []} />
  )
}
