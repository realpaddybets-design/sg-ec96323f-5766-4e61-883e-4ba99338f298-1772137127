import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isStaff: boolean;
  isAdmin: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    isStaff: false,
    isAdmin: false,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setAuthState({
          user: null,
          profile: null,
          loading: false,
          isStaff: false,
          isAdmin: false,
        });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setAuthState({
          user: null,
          profile: null,
          loading: false,
          isStaff: false,
          isAdmin: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(user: User) {
    const { data } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const profile = data;

    setAuthState({
      user,
      profile: profile || null,
      loading: false,
      isStaff: profile?.is_active ?? false,
      isAdmin: (profile?.role === "admin" && (profile?.is_active ?? false)) ?? false,
    });
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  return {
    ...authState,
    signIn,
    signOut,
  };
}