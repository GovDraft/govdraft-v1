
'use client';

import { useEffect, useState } from 'react';
import createBrowserClient from '../../lib/supabaseClient';

export default function DashboardPage() {
  const supabase = createBrowserClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        window.location.href = '/login';
      }
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 80,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ fontSize: 64, marginBottom: 20 }}>Welcome to your Dashboard</h1>

      {user && (
        <>
          <p style={{ fontSize: 20 }}>Logged in as: {user.email}</p>
          <button
            style={{
              marginTop: 20,
              padding: '12px 18px',
              borderRadius: 6,
              background: '#ff6961',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
            }}
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}
          >
            Log Out
          </button>
        </>
      )}
    </main>
  );
}
