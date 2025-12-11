"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header({ openLogin, openRegister }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg shadow-sm">
      
      {/* ================================
          DESKTOP + MOBILE TOP BAR
      ================================== */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* LOGO + BRAND */}
        <Link href="/" className="flex items-center gap-5">
        <Image
            src="/logo-psyclinic.svg"
            alt="PsyClinic"
            width={145}
            height={40}
            priority
            className="h-10 w-auto"
          />
          <span className="text-2xl font-extrabold text-gradient hidden sm:block ">
            PsyClinic
          </span>
        </Link>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center gap-8">

          <Link href="#features" className="nav-link">Servicios</Link>
          <Link href="#cta" className="nav-link">Contacto</Link>

          <button
            onClick={openLogin}
            className="btn-secondary"
          >
            Iniciar sesión
          </button>

          <button
            onClick={openRegister}
            className="btn-primary"
          >
            Registrarse
          </button>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-800 p-2 rounded-lg hover:bg-gray-100"
          aria-label="Abrir menú"
        >
          <svg width="28" height="28" stroke="currentColor" fill="none">
            <path strokeWidth="2" d="M4 7h20M4 14h20M4 21h20" />
          </svg>
        </button>
      </div>

      {/* ================================
          MOBILE MENU
      ================================== */}
      {open && (
        <div className="md:hidden px-4 pb-5 pt-2 space-y-5 bg-white/95 backdrop-blur-md shadow-md animate-fadeIn">

          {/* LOGO EN MOBILE MENU */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo-psyclinic.svg"
              alt="PsyClinic"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              PsyClinic
            </span>
          </div>

          <Link href="#features" className="mobile-link" onClick={() => setOpen(false)}>
            Servicios
          </Link>

          <Link href="#cta" className="mobile-link" onClick={() => setOpen(false)}>
            Contacto
          </Link>

          {/* botones auth */}
          <button
            onClick={() => { openLogin(); setOpen(false); }}
            className="w-full btn-secondary"
          >
            Iniciar sesión
          </button>

          <button
            onClick={() => { openRegister(); setOpen(false); }}
            className="w-full btn-primary"
          >
            Registrarse
          </button>

        </div>
      )}
    </header>
  );
}
