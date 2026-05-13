"use client";

import { useEffect, useState } from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env-public";

export function useSupabaseUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseBrowserConfigured()) {
      setLoading(false);
      return;
    }

    const supabase = getBrowserSupabase();

    void supabase.auth
      .getUser()
      .then((res: { data: { user: User | null } }) => {
        setUser(res.data.user ?? null);
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    isLoaded: !loading,
    isSignedIn: !!user,
  };
}
