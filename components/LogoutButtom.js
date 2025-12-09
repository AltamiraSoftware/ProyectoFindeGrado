"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LogoutButtom() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    router.refresh();   // 🔥 Forzar recarga del user desde useUser
    router.push("/");   // Volver al home
  };

  return (
    <button
      onClick={handleLogout}
      className="
        bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 
        text-white px-5 py-2 rounded-xl shadow-md 
        hover:opacity-90 transition
      "
    >
      Cerrar sesión
    </button>
  );
}
