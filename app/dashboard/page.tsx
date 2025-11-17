// govdraft-v1/app/dashboard/page.tsx
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import ProfileCard from './ProfileCard'
import ProjectsPanel from './ProjectsPanel'

export const runtime = 'nodejs'

export default async function DashboardPage() {
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

  const { data: auth, error: authErr } = await supabase.auth.getUser()

  if (authErr || !auth?.user) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold">Not signed in</h1>
        <p className="text-gray-600">Please log in to view your dashboard.</p>
      </div>
    )
  }

  const userId = auth.user.id

  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (!profile) {
    const { data: up } = await supabase
      .from('profiles')
      .upsert({ id: userId })
      .select('*')
      .single()
    profile = up
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">
          Make the most of your GovDraft account.
        </p>
      </header>

      {profile && <ProfileCard profile={profile} />}

      <ProjectsPanel />

      {/* Later: drafts, analytics, exports etc */}
    </div>
  )
}
