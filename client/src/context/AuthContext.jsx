import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured, GUEST_USER } from "../services/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("modelforge_auth_user");
    return saved ? JSON.parse(saved) : GUEST_USER;
  });
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        if (session?.user) {
          setUser(session.user);
          localStorage.setItem("modelforge_auth_user", JSON.stringify(session.user));
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (session?.user) {
          setUser(session.user);
          localStorage.setItem("modelforge_auth_user", JSON.stringify(session.user));
        } else {
          // If logged out from Supabase, stay in guest developer mode
          setUser(GUEST_USER);
          localStorage.setItem("modelforge_auth_user", JSON.stringify(GUEST_USER));
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      localStorage.setItem("modelforge_auth_user", JSON.stringify(data.user));
      return data;
    } else {
      // Local dev simulation
      const mockUser = {
        id: `usr_${Date.now()}`,
        email,
        user_metadata: {
          full_name: email.split("@")[0].toUpperCase(),
          avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        },
        role: "Researcher"
      };
      setUser(mockUser);
      localStorage.setItem("modelforge_auth_user", JSON.stringify(mockUser));
      return { user: mockUser };
    }
  };

  const signUp = async (email, password, fullName) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (error) throw error;
      if (data.user) {
        setUser(data.user);
        localStorage.setItem("modelforge_auth_user", JSON.stringify(data.user));
      }
      return data;
    } else {
      const mockUser = {
        id: `usr_${Date.now()}`,
        email,
        user_metadata: {
          full_name: fullName || email.split("@")[0],
          avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        },
        role: "Researcher"
      };
      setUser(mockUser);
      localStorage.setItem("modelforge_auth_user", JSON.stringify(mockUser));
      return { user: mockUser };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(GUEST_USER);
    localStorage.setItem("modelforge_auth_user", JSON.stringify(GUEST_USER));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        isSupabaseConfigured,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
