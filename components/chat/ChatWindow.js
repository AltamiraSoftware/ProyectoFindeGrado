"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useChat } from "@/hooks/useChat";
import VideoCall from "@/components/VideoCall";

export default function ChatWindow({ clienteId, profesionalId, userId }) {
  const { mensajes, enviarMensaje } = useChat(clienteId, profesionalId, userId);

  const [texto, setTexto] = useState("");
  const bottomRef = useRef(null);

  const [videoOpen, setVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [creandoVideo, setCreandoVideo] = useState(false);

  // 🟦 Datos del paciente
  const [datosPaciente, setDatosPaciente] = useState(null);
  const [ultimaCita, setUltimaCita] = useState(null);

  /* ============================================================
      CARGAR DATOS DEL PACIENTE
  ============================================================ */
  useEffect(() => {
    if (!clienteId) return;

    async function loadPerfil() {
      const { data, error } = await supabase
        .from("perfiles_usuarios")
        .select("nombre_completo, email, telefono")
        .eq("id", clienteId)
        .single();

      if (!error) setDatosPaciente(data);
    }

    loadPerfil();
  }, [clienteId]);

  /* ============================================================
      CARGAR ÚLTIMA CITA DEL PACIENTE
  ============================================================ */
  useEffect(() => {
    async function loadCita() {
      const { data } = await supabase
        .from("citas_sesiones")
        .select("hora_inicio, estado_cita, servicios(nombre)")
        .eq("id_cliente", clienteId)
        .order("hora_inicio", { ascending: false })
        .limit(1)
        .maybeSingle();

      setUltimaCita(data || null);
    }

    loadCita();
  }, [clienteId]);

  /* ============================================================
      AUTOSCROLL
  ============================================================ */
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensajes]);

  /* ============================================================
      ENVIAR MENSAJE
  ============================================================ */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;

    await enviarMensaje(texto);
    setTexto("");
  };

  /* ============================================================
      CREAR VIDEOLLAMADA
  ============================================================ */
  const handleStartVideo = async () => {
    try {
      setCreandoVideo(true);

      const res = await fetch("/api/video/create-room", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.url) {
        alert("No se pudo crear la videollamada.");
        return;
      }

      setVideoUrl(data.url);
      setVideoOpen(true);

      await enviarMensaje(`📹 Videollamada disponible: ${data.url}`);
    } catch {
      alert("Error inesperado creando videollamada.");
    } finally {
      setCreandoVideo(false);
    }
  };

  /* ============================================================
      DETECTAR LINKS DE VIDEOLLAMADA
  ============================================================ */
  const renderContenido = (texto) => {
    if (!texto || typeof texto !== "string") return texto;

    const urlRegex = /(https?:\/\/[^\s]+)/gi;

    if (!urlRegex.test(texto)) return <p>{texto}</p>;

    return (
      <p>
        {texto.split(urlRegex).map((part, i) =>
          urlRegex.test(part) ? (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noreferrer"
              className="underline font-semibold text-white"
            >
              Unirse a la videollamada
            </a>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </p>
    );
  };

  /* ============================================================
      UI PRINCIPAL
  ============================================================ */
  return (
    <div className="h-full flex flex-col bg-white rounded-xl overflow-hidden shadow">

      {/* ============================================================
          HEADER CORPORATIVO CON FICHA DEL PACIENTE
      ============================================================ */}
      <div className="px-5 py-4 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 text-white shadow">

        <div className="flex flex-col gap-2">

          {/* DATOS GENERALES */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 17.804A4 4 0 018 17h8a4 4 0 013 1l2 2H3l2.121-2.196zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>

            <div>
              <p className="text-xl font-semibold leading-tight">
                {datosPaciente?.nombre_completo || "Paciente"}
              </p>
              <p className="text-sm opacity-90">{datosPaciente?.email}</p>
              {datosPaciente?.telefono && (
                <p className="text-sm opacity-80">📞 {datosPaciente.telefono}</p>
              )}
            </div>
          </div>

          {/* ÚLTIMA CITA */}
          {ultimaCita && (
            <div className="mt-2 bg-white/10 rounded-lg p-3 text-sm backdrop-blur-sm border border-white/20">
              <p className="font-semibold">📅 Última cita</p>
              <p>
                {new Date(ultimaCita.hora_inicio).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <p className="capitalize">
                Estado:{" "}
                <span className="font-medium">{ultimaCita.estado_cita}</span>
              </p>

              <p>
                Servicio:{" "}
                <span className="font-medium">
                  {ultimaCita.servicios?.nombre || "—"}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* BOTÓN VIDEOLLAMADA */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleStartVideo}
            disabled={creandoVideo}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold border border-white/40 disabled:opacity-60"
          >
            📹 {creandoVideo ? "Creando sala..." : "Videollamada"}
          </button>
        </div>
      </div>

      {/* ============================================================
          MENSAJES
      ============================================================ */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50">
        {mensajes.map((m) => {
          const mio = m.id_remitente === userId;

          return (
            <div key={m.id} className={`flex ${mio ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-2 rounded-xl max-w-[70%] shadow text-sm ${
                  mio
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300"
                }`}
              >
                {renderContenido(m.contenido)}

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

        <div ref={bottomRef} />
      </div>

      {/* ============================================================
          INPUT
      ============================================================ */}
      <form onSubmit={handleSend} className="p-4 border-t flex gap-2 bg-white">
        <input
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="Escribe un mensaje…"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
          Enviar
        </button>
      </form>

      {/* ============================================================
          MODAL VIDEOLLAMADA
      ============================================================ */}
      {videoOpen && videoUrl && (
        <VideoCall roomUrl={videoUrl} onClose={() => setVideoOpen(false)} />
      )}
    </div>
  );
}
