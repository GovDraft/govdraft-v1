// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import createBrowserClient from '../../lib/supabaseClient';

export default function Dashboard() {
  const supabase = createBrowserClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        window.location.href = '/login';
      }
      setLoading(false);
    })();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) return <main style={{ textAlign: 'center', marginTop: 100 }}>Loading...</main>;

  return (
    <main style={{ textAlign: 'center', marginTop: 100 }}>
      <h1>Dashboard</h1>
      {user ? (
        <>
          <p>🎉 You’re logged in as:</p>
          <p style={{ fontWeight: 'bold', marginTop: 8 }}>{user.email}</p>
          <button
            onClick={handleLogout}
            style={{
              marginTop: 20,
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              backgroundColor: '#333',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Log out
          </button>
        </>
      ) : (
        <p>Not logged in</p>
      )}
    </main>
  );
}
