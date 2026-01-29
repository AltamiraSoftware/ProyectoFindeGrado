"use client";
import { useState } from "react";

export default function Hero({ openLogin, openRegister }) {
  const [open, setOpen] = useState(false);

  return (
    <section
      className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-[#eef2ff] via-[#f5e1ff] to-[#ffe4f2] pt-20 sm:pt-24 pb-12 sm:pb-16"
    >
      <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-16 items-center">

        {/* COLUMNA IZQUIERDA – TEXTOS */}
        <div className="space-y-4 sm:space-y-6 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
            Centraliza y automatiza
            <span className="block title-gradient">
              la administración de tu clínica.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
            Gestiona tus citas de forma eficiente y segura.
            Disponibilidad en tiempo real, pagos protegidos y una experiencia
            diseñada para tu comodidad. Comunicación cliente-profesional y automatización de e-mail.
          </p>

          {/* CTA Buttons - móvil: apilados y full width */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
            <button
              onClick={openRegister}
              className="w-full sm:w-auto btn-primary shadow-lg py-3.5 sm:py-3 min-h-[48px] text-base"
            >
              Registrarse como cliente
            </button>
            <a href="#features" className="w-full sm:w-auto btn-secondary shadow-md py-3.5 sm:py-3 min-h-[48px] text-center text-base">
              Software Features
            </a>
          </div>
        </div>

        {/* CARD PREMIUM – DERECHA */}
        <div className="relative group w-full max-w-md mx-auto ">
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 blur-2xl sm:blur-3xl opacity-40 group-hover:opacity-60 transition-all duration-500" />
          <div
            className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-white/10
                       bg-gradient-to-br from-[#1f2a40] via-[#2e3a55] to-[#3b4a6b]
                       backdrop-blur-xl transition-all duration-300
                       group-hover:-translate-y-1 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
          >
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shrink-0">
                <span className="text-white text-lg sm:text-xl">📅</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Sistema de reservas inteligente
              </h2>
            </div>
            <p className="text-sm text-gray-200 mb-6 sm:mb-8">
              Gestiona tu próxima cita de manera rápida, segura y sin complicaciones.
              Consulta disponibilidad en tiempo real.
            </p>
            <button
              onClick={openLogin}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 hover:opacity-90 transition px-4 py-3.5 rounded-xl font-semibold shadow-lg text-white min-h-[48px] text-base"
            >
              Agendar cita
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
