"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        if (active) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      const { data: perfil } = await supabase
        .from("perfiles_usuarios")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (active) {
        setUser({ ...authUser, ...perfil });
        setLoading(false);
      }
    }

    load();

    const { data: subscription } = supabase.auth.onAuthStateChange(() => load());

    return () => {
      active = false;
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  return { user, isLoading };
}
