import { create } from 'zustand';
import { auth, db, onAuthStateChanged, signOut, doc, getDoc, setDoc, serverTimestamp, googleProvider, signInWithPopup } from '@/services/firebase';
import { signInAnonymously, User as FirebaseUser, GoogleAuthProvider } from 'firebase/auth';

export interface DemoUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isDemo?: boolean;
}

export type AppUser = FirebaseUser | DemoUser;

interface AuthState {
  user: AppUser | null;
  loading: boolean;
  initialized: boolean;
  googleAccessToken: string | null;
  
  // Actions
  initAuth: () => () => void;
  loginAsDemo: (name?: string) => Promise<void>;
  loginWithGoogle: () => Promise<{ user: FirebaseUser; token: string | null }>;
  logout: () => Promise<void>;
  setGoogleAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,
  googleAccessToken: null,
  
  setGoogleAccessToken: (token: string | null) => {
    set({ googleAccessToken: token });
  },

  initAuth: () => {
    if (get().initialized) return () => {};

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        localStorage.removeItem('idg_demo_user');
        
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              createdAt: serverTimestamp()
            });
          }
        } catch (dbError) {
          console.warn('Firestore sync postponed or restricted:', dbError);
        }
        set({ user: firebaseUser, loading: false, initialized: true });
      } else {
        const localUserStr = localStorage.getItem('idg_demo_user');
        if (localUserStr) {
          try {
            set({ user: JSON.parse(localUserStr), loading: false, initialized: true });
          } catch {
            set({ user: null, loading: false, initialized: true });
          }
        } else {
          set({ user: null, loading: false, initialized: true });
        }
      }
    });

    return unsubscribe;
  },
  
  loginWithGoogle: async () => {
    set({ loading: true });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken || null;
      set({ user: result.user, googleAccessToken: token, loading: false });
      return { user: result.user, token };
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  loginAsDemo: async (customName?: string) => {
    set({ loading: true });
    try {
      const result = await signInAnonymously(auth);
      if (result.user) {
        set({ user: result.user, loading: false });
      }
    } catch (anonymousError) {
      console.warn('Anonymous Firebase sign-in restricted or failed, falling back to local guest:', anonymousError);
      
      const guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
      const guestUser: DemoUser = {
        uid: guestId,
        email: 'guest@idg-gateway.com',
        displayName: customName || 'مێوان / Guest',
        photoURL: null,
        isDemo: true,
      };
      localStorage.setItem('idg_demo_user', JSON.stringify(guestUser));
      set({ user: guestUser, loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      localStorage.removeItem('idg_demo_user');
      await signOut(auth);
      set({ user: null, googleAccessToken: null, loading: false });
    } catch (signOutError) {
      console.error('Sign out error:', signOutError);
      set({ loading: false });
    }
  }
}));
