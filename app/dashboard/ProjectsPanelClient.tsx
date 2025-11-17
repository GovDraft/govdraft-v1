// govdraft-v1/app/dashboard/ProjectsPanelClient.tsx
'use client'

import * as React from 'react'
import { useFormStatus } from 'react-dom'
import type { Project } from './ProjectsPanel'
import {
  createProject,
  renameProject,
  archiveProject,
  deleteProject,
} from '@/app/actions/projects'

function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus()
  return (
    <button
      {...props}
      disabled={pending || props.disabled}
      className={
        'rounded-xl border px-3 py-2 text-sm shadow-sm disabled:opacity-60 ' +
        (props.className ?? '')
      }
    >
      {pending ? 'Working...' : props.children}
    </button>
  )
}

export default function ProjectsPanelClient({
  projects,
}: {
  projects: Project[]
}) {
  const [message, setMessage] = React.useState<string | null>(null)

  async function handleCreate(formData: FormData) {
    setMessage(null)
    const res = await createProject(formData)
    if (!res.ok) setMessage(res.error ?? 'Could not create project')
    else setMessage('Project created')
  }

  async function handleRename(formData: FormData) {
    setMessage(null)
    const res = await renameProject(formData)
    if (!res.ok) setMessage(res.error ?? 'Could not rename project')
    else setMessage('Project renamed')
  }

  async function handleArchive(formData: FormData) {
    setMessage(null)
    const res = await archiveProject(formData)
    if (!res.ok) setMessage(res.error ?? 'Could not archive project')
    else setMessage('Project archived')
  }

  async function handleDelete(formData: FormData) {
    setMessage(null)
    const res = await deleteProject(formData)
    if (!res.ok) setMessage(res.error ?? 'Could not delete project')
    else setMessage('Project deleted')
  }

  return (
    <section className="w-full max-w-4xl rounded-2xl border p-6 shadow-sm bg-white space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Projects</h2>
          <p className="text-sm text-gray-600">
            Each project will hold drafts, requirements, and exports.
          </p>
        </div>
      </header>

      {/* New project form */}
      <form
        action={handleCreate}
        className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
      >
        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-xs text-gray-600">Project name</span>
          <input
            name="name"
            required
            placeholder="VA IT Support 2026"
            className="rounded-lg border px-3 py-2 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1 md:col-span-1">
          <span className="text-xs text-gray-600">NAICS (optional)</span>
          <input
            name="naics_code"
            placeholder="541512"
            className="rounded-lg border px-3 py-2 text-sm"
          />
        </label>

        <PrimaryButton type="submit" className="md:col-span-1">
          New project
        </PrimaryButton>
      </form>

      {message && (
        <p
          className={
            'text-xs ' +
            (message.toLowerCase().includes('could not')
              ? 'text-red-700'
              : 'text-green-700')
          }
        >
          {message}
        </p>
      )}

      {/* Projects list */}
      {projects.length === 0 ? (
        <p className="text-sm text-gray-600">
          No projects yet. Create your first project above.
        </p>
      ) : (
        <ul className="divide-y">
          {projects.map(project => (
            <li
              key={project.id}
              className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div className="space-y-1">
                <form action={handleRename} className="flex gap-2 items-center">
                  <input type="hidden" name="id" value={project.id} />
                  <input
                    name="name"
                    defaultValue={project.name}
                    className="rounded-lg border px-2 py-1 text-sm w-full md:w-64"
                  />
                  <PrimaryButton type="submit" className="text-xs px-2 py-1">
                    Save
                  </PrimaryButton>
                </form>
                <p className="text-xs text-gray-500">
                  Status: {project.status}{' '}
                  • Created:{' '}
                  {new Date(project.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                {!project.is_archived && (
                  <form action={handleArchive}>
                    <input type="hidden" name="id" value={project.id} />
                    <PrimaryButton
                      type="submit"
                      className="text-xs px-3 py-1 bg-gray-100"
                    >
                      Archive
                    </PrimaryButton>
                  </form>
                )}
                <form action={handleDelete}>
                  <input type="hidden" name="id" value={project.id} />
                  <PrimaryButton
                    type="submit"
                    className="text-xs px-3 py-1 bg-red-50"
                  >
                    Delete
                  </PrimaryButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
