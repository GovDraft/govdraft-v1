// app/login/page.tsx  (Server Component)
import LoginClient from './LoginClient';

export default function Page({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  // Read any ?error= from the URL server-side (safe for prerender)
  const initialError = searchParams?.error
    ? decodeURIComponent(searchParams.error)
    : '';

  return <LoginClient initialError={initialError} />;
}
