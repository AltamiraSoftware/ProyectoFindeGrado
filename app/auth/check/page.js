"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient.js";

export default function CheckPage() {
  const [state, setState] = useState(null);

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      let perfil = null;

      if (user) {
        const { data } = await supabase
          .from("perfiles_usuarios")
          .select("*")
          .eq("id", user.id)
          .single();

        perfil = data;
      }

      setState({ user, perfil });
    }
    check();
  }, []);

  return (
    <pre className="p-6">{JSON.stringify(state, null, 2)}</pre>
  );
}
