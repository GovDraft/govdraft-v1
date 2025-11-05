'use client';

import { useEffect, useState } from 'react';
import createBrowserClient from '../../lib/supabaseClient';

export default function Dashboard() {
  const supabase = createBrowserClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 🔍 Check who’s logged in
    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        // if no one is logged in, send back to login
        window.location.href = '/login';
      }
    }
    loadUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

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
        <p>Loading...</p>
      )}
    </main>
  );
}
