"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header({ openLogin, openRegister }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="
        fixed top-0 w-full z-50
        bg-white/80 backdrop-blur-lg
        shadow-sm
      "
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* LOGO / NOMBRE */}
        <Link href="/" className="text-2xl font-extrabold text-gradient">
          PsyClinic 
        </Link>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center gap-8">
         
          <Link href="#features" className="nav-link">Features</Link>
          <Link href="#cta" className="nav-link">Contacto</Link>

          {/* BOTONES DE AUTH */}
          <button
            onClick={openLogin}
            className="
            bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 
            text-white px-5 py-2 rounded-xl shadow-md 
            hover:opacity-90 transition
          "
          >
            Iniciar sesión
          </button>

          <button
            onClick={openRegister}
            className="
              bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 
              text-white px-5 py-2 rounded-xl shadow-md 
              hover:opacity-90 transition
            "
          >
            Registrarse
          </button>
        </nav>

        {/* BOTÓN MENÚ MOBILE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-800"
        >
          <svg width="28" height="28" stroke="currentColor" fill="none">
            <path strokeWidth="2" d="M4 7h20M4 14h20M4 21h20" />
          </svg>
        </button>
      </div>

      {/* MENU MOBILE */}
      {open && (
        <div
          className="
            md:hidden px-4 pb-4 space-y-4
            bg-white/95 backdrop-blur-md shadow-md
            animate-fadeIn
          "
        >
          <Link href="#about" className="mobile-link" onClick={() => setOpen(false)}>
            Sobre mí
          </Link>
          <Link href="#features" className="mobile-link" onClick={() => setOpen(false)}>
            Servicios
          </Link>
          <Link href="#cta" className="mobile-link" onClick={() => setOpen(false)}>
            Contacto
          </Link>

          {/* BOTONES AUTH MOBILE */}
          <button
            onClick={() => { openLogin(); setOpen(false); }}
            className="block w-full text-left font-semibold text-blue-700 hover:underline"
          >
            Iniciar sesión
          </button>

          <button
            onClick={() => { openRegister(); setOpen(false); }}
            className="
              w-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500
              text-white px-5 py-2 rounded-xl shadow-md
              hover:opacity-90 transition block text-center
            "
          >
            Registrarse
          </button>
        </div>
      )}
    </header>
  );
}
