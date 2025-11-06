// app/login/page.tsx
import { Suspense } from 'react';
import LoginClient from './LoginClient';

export default function Page() {
  // No props, no searchParams: this keeps Next's PageProps typing happy.
  // Suspense ensures useSearchParams() in the client is wrapped correctly.
  return (
    <Suspense>
      <LoginClient />
    </Suspense>
  );
}
