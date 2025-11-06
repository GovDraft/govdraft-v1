// app/login/page.tsx
import LoginClient from './LoginClient';

export default function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // if middleware sent ?redirect=..., grab it (fallback to /dashboard)
  const redirect =
    (typeof searchParams?.redirect === 'string' && searchParams?.redirect) ||
    '/dashboard';

  return <LoginClient initialRedirect={redirect} />;
}
