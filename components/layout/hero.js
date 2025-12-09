"use client";
import { useState } from "react";

export default function Hero({ openLogin, openRegister }) {
  const [open, setOpen] = useState(false);

  return (
    <section
      className="
        relative overflow-hidden 
        min-h-screen flex items-center
        bg-gradient-to-br from-[#eef2ff] via-[#f5e1ff] to-[#ffe4f2]
      "
    >
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

        {/* ------------------------------
            COLUMNA IZQUIERDA – TEXTOS
        -------------------------------- */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
            Centraliza y automatiza
            <span className="block title-gradient">
              la administración de tu clínica.
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-lg">
            Gestiona tus citas de forma eficiente y segura.
            Disponibilidad en tiempo real, pagos protegidos y una experiencia
            diseñada para tu comodidad. Comunicación cliente-profesional y automatización de e-mail.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={openRegister}
              className="btn-primary shadow-lg"
            >
              Registrarse como cliente
            </button>

            <a href="#services" className="btn-secondary shadow-md">
              Software Features
            </a>
          </div>
        </div>

        {/* ------------------------------
            CARD PREMIUM – DERECHA
        -------------------------------- */}
        <div className="relative group w-full max-w-md mx-auto">

          {/* GLOW EXTERNO */}
          <div
            className="absolute inset-0 rounded-3xl bg-gradient-to-r 
                       from-blue-600 via-purple-500 to-pink-500 
                       blur-3xl opacity-40 group-hover:opacity-60 
                       transition-all duration-500"
          ></div>

          {/* CARD INTERIOR */}
          <div
            className="relative rounded-3xl p-10 shadow-2xl border border-white/10
                       bg-gradient-to-br from-[#1f2a40] via-[#2e3a55] to-[#3b4a6b]
                       backdrop-blur-xl
                       transition-all duration-300 
                       group-hover:-translate-y-1 
                       group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
          >
            {/* ICONO + TÍTULO */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r 
                              from-blue-500 via-purple-500 to-pink-500 
                              flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">📅</span>
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight">
                Sistema de reservas inteligente
              </h3>
            </div>

            <p className="text-sm text-gray-200 mb-8">
              Gestiona tu próxima cita de manera rápida, segura y sin complicaciones.
              Consulta disponibilidad en tiempo real.
            </p>

            {/* BOTÓN */}
            <button
              onClick={openLogin}
              className="w-full bg-gradient-to-r from-blue-600 
                         via-purple-500 to-pink-500 
                         hover:opacity-90 transition px-4 py-3 
                         rounded-xl font-semibold shadow-lg 
                         text-white"
            >
              Agendar cita
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
