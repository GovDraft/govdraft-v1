// app/login/page.tsx (Server Component)
import LoginClient from './LoginClient'

type SearchParams = { [key: string]: string | string[] | undefined }

export default function Page({
  searchParams,
}: {
  searchParams?: SearchParams
}) {
  // Normalize ?error=... to a string (ignore arrays/undefined)
  const error =
    typeof searchParams?.error === 'string' ? searchParams.error : undefined

  return <LoginClient error={error} />
}
