import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { UserData } from '../types';

interface AuthState {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  checkAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          set({ 
            user: {
              id: session.user.id,
              email: session.user.email || '',
              username: profile.username,
              createdAt: profile.created_at,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } else {
        set({ isLoading: false, isAuthenticated: false });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      set({ isLoading: false, isAuthenticated: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          set({ 
            user: {
              id: data.user.id,
              email: data.user.email || '',
              username: profile.username,
              createdAt: profile.created_at,
            },
            isAuthenticated: true,
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  register: async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username,
            email,
          });

        if (profileError) throw profileError;

        set({
          user: {
            id: data.user.id,
            email,
            username,
            createdAt: new Date().toISOString(),
          },
          isAuthenticated: true,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
}));
