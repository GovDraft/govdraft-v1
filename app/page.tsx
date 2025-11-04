'use client';

export default function Page() {
  return (
    <main className="container">
      <section className="card">
        <h1>Coming Soon — Join GovDraft Beta</h1>
        <p>AI-powered proposal drafting for government contracts.</p>
        <a
          className="cta"
          href={process.env.NEXT_PUBLIC_BETA_FORM_URL || '#'}
          target="_blank"
        >
          Join Beta
        </a>
      </section>
    </main>
  );
}
