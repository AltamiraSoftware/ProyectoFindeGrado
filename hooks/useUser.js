"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data: perfil } = await supabase
        .from("perfiles_usuarios")
        .select("*")
        .eq("id", authUser.id)
        .single();

      setUser({ ...authUser, ...perfil });
      setLoading(false);
    }

    load();

    // Realtime auth listener
    const { data: listener } = supabase.auth.onAuthStateChange(() => load());

    return () => listener.subscription.unsubscribe();
  }, []);

  return { user, isLoading };
}
