"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header({ openLogin, openRegister }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg shadow-sm safe-area-inset-top">
      
      {/* DESKTOP + MOBILE TOP BAR */}
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between min-h-[56px] sm:min-h-0">
        
        {/* LOGO + BRAND */}
        <Link href="/" className="flex items-center gap-2 sm:gap-5 shrink-0">
          <Image
            src="/logo-psymanage.svg"
            alt="PsyManage"
            width={145}
            height={40}
            priority
            className="h-8 sm:h-10 w-auto"
          />
          <span className="text-xl sm:text-2xl font-extrabold text-gradient hidden sm:block">
            PsyManage
          </span>
        </Link>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="nav-link">Servicios</Link>
          <Link href="#cta" className="nav-link">Contacto</Link>
          <button onClick={openLogin} className="btn-primary">Iniciar sesión</button>
          <button onClick={openRegister} className="btn-primary">Registrarse</button>
        </nav>

        {/* MOBILE MENU BUTTON - área táctil mínima 44px */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-800 p-3 -m-2 rounded-xl hover:bg-gray-100 active:bg-gray-200 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          <svg className="w-6 h-6" stroke="currentColor" fill="none" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h20M4 14h20M4 21h20" />
            )}
          </svg>
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-4 sm:px-6 pb-6 pt-2 space-y-1 bg-white/98 backdrop-blur-md shadow-lg border-t border-gray-100 animate-fadeIn">
          <Link href="#features" className="mobile-link block py-4 text-base font-medium text-gray-800 border-b border-gray-100" onClick={() => setOpen(false)}>
            Servicios
          </Link>
          <Link href="#cta" className="mobile-link block py-4 text-base font-medium text-gray-800 border-b border-gray-100" onClick={() => setOpen(false)}>
            Contacto
          </Link>
          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={() => { openLogin(); setOpen(false); }}
              className="w-full btn-primary py-3.5 text-base min-h-[48px]"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => { openRegister(); setOpen(false); }}
              className="w-full btn-secondary py-3.5 text-base min-h-[48px]"
            >
              Registrarse
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
