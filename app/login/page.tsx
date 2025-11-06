// app/login/page.tsx
import LoginClient from './LoginClient';

export default function Page(props: any) {
  const initialError = props?.searchParams?.error as string | undefined;
  return <LoginClient initialError={initialError} />;
}
