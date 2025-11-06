// app/login/page.tsx (server component)
import LoginClient from './LoginClient'

type PageProps = {
  searchParams?: {
    error?: string
  }
}

export default function Page({ searchParams }: PageProps) {
  const initialError = searchParams?.error
  return <LoginClient initialError={initialError} />
}
