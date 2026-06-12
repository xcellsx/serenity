import type { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { supabase } from './supabase';

// Keep the session token fresh while the app is in the foreground.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

type AuthState = {
  session: Session | null;
  userId: string | null;
  loading: boolean;
};

const AuthContext = createContext<AuthState>({ session: null, userId: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      let current = data.session;

      // First launch on this device → silently create an anonymous account.
      if (!current) {
        const { data: anon, error } = await supabase.auth.signInAnonymously();
        if (error) {
          console.warn('[auth] anonymous sign-in failed:', error.message);
        }
        current = anon?.session ?? null;
      }

      if (mounted) {
        setSession(current);
        setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, userId: session?.user.id ?? null, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
