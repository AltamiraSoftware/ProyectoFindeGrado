"use client";

import { useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButtom";

export default function Header({ onOpenServicios }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white/80 backdrop-blur-lg shadow-md top-0 z-50 mb-5">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

        <Link href="/dashboard" className="font-black text-xl text-gray-900">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
            Panel Profesional
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-3">
        <Link
            href="/dashboard/chat"
            className="w-full px-4 py-3 rounded-lg font-semibold shadow bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90"
          >
            Chat
          </Link>
          <button
            onClick={onOpenServicios}
            className="w-full px-4 py-3 rounded-lg font-semibold shadow bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90"
          >
            Servicios
          </button>

          <Link
            href="/dashboard/disponibilidad"
            className="w-full px-4 py-3 rounded-lg font-semibold shadow bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90"
          >
            Disponibilidad
          </Link>

          <LogoutButton />
        </div>

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

          <button
            onClick={onOpenServicios}
            className="w-full px-4 py-3 rounded-lg font-semibold shadow bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90"
          >
            Servicios
          </button>

          <Link
            href="/dashboard/disponibilidad"
            onClick={() => setOpen(false)}
            className="w-full px-4 py-3 rounded-lg font-semibold shadow bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90"
          >
            Disponibilidas
          </Link>

          <LogoutButton />
        </div>
      )}
    </header>
  );
}
