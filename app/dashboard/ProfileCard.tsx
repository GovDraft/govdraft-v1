'use client'

import * as React from 'react'

type Profile = {
  id: string
  full_name: string | null
  company: string | null
  title: string | null
  phone: string | null
  avatar_url: string | null
}

export default function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <div className="w-full max-w-2xl rounded-2xl border p-6 shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">Your Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Full name</span>
          <input
            readOnly
            value={profile.full_name ?? ''}
            className="rounded-lg border px-3 py-2 bg-gray-50"
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Company</span>
          <input
            readOnly
            value={profile.company ?? ''}
            className="rounded-lg border px-3 py-2 bg-gray-50"
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Title</span>
          <input
            readOnly
            value={profile.title ?? ''}
            className="rounded-lg border px-3 py-2 bg-gray-50"
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Phone</span>
          <input
            readOnly
            value={profile.phone ?? ''}
            className="rounded-lg border px-3 py-2 bg-gray-50"
          />
        </div>

        <div className="flex flex-col gap-1 md:col-span-2">
          <span className="text-sm text-gray-600">Avatar URL</span>
          <input
            readOnly
            value={profile.avatar_url ?? ''}
            className="rounded-lg border px-3 py-2 bg-gray-50"
          />
        </div>
      </div>
    </div>
  )
}