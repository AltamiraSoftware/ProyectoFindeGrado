"use client";

import { useState } from "react";
import Link from "next/link";
import LogoutButtom from "@/components/LogoutButtom";
import Image from "next/image";

export default function Header({ onOpenServicios }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white/80 backdrop-blur-lg shadow-md top-0 z-50 mb-5">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* LOGO + TITULO */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo-psymanage.svg"
            alt="PsyManage"
            width={32}
            height={32}
            className="h-8 w-auto"
          />
          <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 leading-none">
            Panel del Profesional
          </span>
        </Link>

        {/* NAV DESKTOP */}
        <div className="hidden md:flex items-center gap-3">
          
          <Link
            href="/dashboard/chat"
            className="px-4 py-2 rounded-lg font-semibold shadow bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90"
          >
            Chat
          </Link>

          <button
            onClick={onOpenServicios}
            className="px-4 py-2 rounded-lg font-semibold shadow bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90"
          >
            Servicios
          </button>

          <Link
            href="/dashboard/disponibilidad"
            className="px-4 py-2 rounded-lg font-semibold shadow bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90"
          >
            Disponibilidad
          </Link>

          <LogoutButtom />
        </div>

        {/* BOTÓN MENÚ MOBILE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-800 hover:text-black transition"
        >
          <svg width="28" height="28" stroke="currentColor" fill="none" strokeWidth="2">
            <path d="M4 7h20M4 14h20M4 21h20" />
          </svg>
        </button>
      </div>

      {/* MENU MOBILE */}
      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg shadow-md px-4 pb-4 space-y-4 animate-fadeIn">
          
          {/* ICONO EN MOBILE */}
          <div className="flex items-center gap-2 pt-2">
            <Image
              src="/logo-psymanage.svg"
              alt="PsyManage"
              width={28}
              height={28}
              className="h-7 w-auto"
            />
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
              Panel Profesional
            </span>
          </div>

          <button
            onClick={() => { onOpenServicios(); setOpen(false); }}
            className="block w-full px-4 py-3 rounded-lg font-semibold shadow bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90"
          >
            Servicios
          </button>

          <Link
            href="/dashboard/disponibilidad"
            onClick={() => setOpen(false)}
            className="block w-full px-4 py-3 rounded-lg font-semibold shadow bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90"
          >
            Disponibilidad
          </Link>

          <LogoutButtom />
        </div>
      )}
    </header>
  );
}
