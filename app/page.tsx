'use client';

export default function Page() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        marginTop: 100,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1>Coming Soon — Join GovDraft Beta</h1>
      <p>AI-powered proposal drafting for government contracts.</p>

      <a
        href={process.env.NEXT_PUBLIC_BETA_FORM_URL || '#'}
        target="_blank"
        rel="noreferrer"
        style={{
          padding: '10px 16px',
          background: '#008060',
          color: 'white',
          borderRadius: 6,
          textDecoration: 'none',
        }}
      >
        Join Beta
      </a>

      <a
        href="/login"
        style={{
          marginTop: 8,
          textDecoration: 'underline',
          color: '#0066cc',
        }}
      >
        Or sign in with email
      </a>
    </main>
  );
}
