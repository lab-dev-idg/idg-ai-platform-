import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initAuth = useAuthStore(state => state.initAuth);

  useEffect(() => {
    const unsubscribe = initAuth();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [initAuth]);

  return <>{children}</>;
};

