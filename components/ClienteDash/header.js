"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LogoutButton from "../LogoutButtom";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/hooks/useUser";

export default function Header() {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);

  // 🔧 Restauramos el estado del menú
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      const { data } = await supabase
        .from("perfiles_usuarios")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
    }
    loadProfile();
  }, [user]);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        <Link
          href="/cliente"
          className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          Panel del usuario
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-4">
          <LogoutButton />
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="md:hidden text-gray-800"
        >
          <svg width="28" height="28" stroke="currentColor" fill="none">
            <path strokeWidth="2" d="M4 7h20M4 14h20M4 21h20" />
          </svg>
        </button>
      </div>

      {/* MOBILE MENU */}
      {openMenu && (
        <div className="md:hidden px-4 pb-4 space-y-4 bg-white/95 backdrop-blur-md shadow-md animate-fadeIn">

          <button
            onClick={() => setOpenMenu(false)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-3 rounded-xl shadow transition text-center"
          >
            Cerrar menú
          </button>

          <LogoutButton />
        </div>
      )}
    </header>
  );
}
