import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { getProfile } from '@/lib/db';
import { useAuth } from '@/lib/auth';

type AccessibilityContextValue = {
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
};

const AccessibilityContext = createContext<AccessibilityContextValue>({
  reduceMotion: false,
  setReduceMotion: () => {},
  highContrast: false,
  setHighContrast: () => {},
});

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const { userId, loading: authLoading } = useAuth();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    if (authLoading || !userId) return;
    getProfile()
      .then((profile) => {
        setReduceMotion(!!profile?.reduce_motion);
        setHighContrast(!!profile?.high_contrast);
      })
      .catch(() => {});
  }, [authLoading, userId]);

  const value = useMemo(
    () => ({ reduceMotion, setReduceMotion, highContrast, setHighContrast }),
    [reduceMotion, highContrast],
  );

  return (
    <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
  );
}

export function useMotion() {
  return useContext(AccessibilityContext);
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
