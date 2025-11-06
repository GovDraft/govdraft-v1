// app/login/page.tsx (Server Component - Next.js 15 compatible)
import LoginClient from './LoginClient'

// In Next 15, `searchParams` is a Promise at type-level.
type SearchParamsPromise = Promise<
  Record<string, string | string[] | undefined>
>

export default async function Page({
  searchParams,
}: {
  searchParams?: SearchParamsPromise
}) {
  // Await the params (works in server components)
  const params = (await searchParams) ?? {}

  // Normalize ?error=... to a single string
  const raw = params.error
  const error =
    typeof raw === 'string'
      ? raw
      : Array.isArray(raw)
      ? raw[0]
      : undefined

  return <LoginClient error={error} />
}
