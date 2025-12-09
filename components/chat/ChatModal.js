"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";

export default function ChatModal({
  idCliente,
  idProfesional,
  userId,
  isOpen,
  onClose,
}) {

  // HOOKS ARRIBA SIEMPRE
  const { mensajes, cargando, enviarMensaje } = useChat(
    idCliente,
    idProfesional,
    userId
  );

  const [texto, setTexto] = useState("");
  const bottomRef = useRef(null);

  // AUTOSCROLL
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensajes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    await enviarMensaje(texto);
    setTexto("");
  };

  // SI NO ESTÁ ABIERTO → NO RENDERIZAR
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* FONDO OSCURO */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white w-[90%] max-w-lg h-[80vh] rounded-2xl shadow-xl flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white">
          <div>
            <p className="text-lg font-semibold">Chat con tu profesional</p>
            <p className="text-xs text-white/80">Comunicación segura</p>
          </div>
          <button
            onClick={onClose}
            className="text-xl font-bold hover:scale-110 transition"
          >
            ✕
          </button>
        </div>

        {/* MENSAJES */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
          {cargando && (
            <p className="text-center text-sm text-gray-500">Cargando…</p>
          )}

          {mensajes.map((m) => {
            const mio = m.id_remitente === userId;

            return (
              <div
                key={m.id}
                className={`flex ${mio ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm ${
                    mio
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-300"
                  }`}
                >
                  <p>{m.contenido}</p>

                  <p className="text-[10px] opacity-50 mt-1">
                    {new Date(m.creado_en).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef}></div>
        </div>

        {/* INPUT — TOTALMENTE BLINDADO */}
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white border-t border-gray-300 flex items-center gap-3"
        >
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe un mensaje…"
            className="
              flex-1 px-4 py-2 bg-white text-gray-800
              border border-gray-300 rounded-lg shadow-sm
              text-sm focus:outline-none focus:ring-2 focus:ring-purple-500
            "
            style={{ appearance: "none", WebkitAppearance: "none" }}
          />

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Enviar
          </button>
        </form>

      </div>
    </div>
  );
}
