"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadUser(sessionUser) {
      if (!sessionUser) {
        if (active) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      const { data: perfil } = await supabase
        .from("perfiles_usuarios")
        .select("*")
        .eq("id", sessionUser.id)
        .single();

      if (active) {
        setUser({ ...sessionUser, ...perfil });
        setLoading(false);
      }
    }

    // 1️⃣ Cargar usuario al montar
    supabase.auth.getUser().then(({ data: { user } }) => {
      loadUser(user);
    });

    // 2️⃣ Detectar login / logout en tiempo real
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          loadUser(session.user);   // login
        } else {
          setUser(null);            // logout
          setLoading(false);
        }
      }
    );

    return () => {
      active = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return { user, isLoading };
}
