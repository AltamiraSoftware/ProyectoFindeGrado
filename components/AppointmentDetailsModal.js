"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User, Clock } from "lucide-react";

export default function AppointmentDetailsModal({
  open,
  detalleCita,
  onClose,
}) {
  /* ============================================================
     HOOKS (siempre al inicio)
  ============================================================ */
  const [loading, setLoading] = useState(false);
  const [nuevaNota, setNuevaNota] = useState("");
  const [notasSesion, setNotasSesion] = useState([]);

  const citaId = detalleCita?.id ?? null;

  /* ============================================================
     CARGAR NOTAS PROFESIONALES
  ============================================================ */
  useEffect(() => {
    if (!citaId) return;

    async function cargarNotas() {
      const { data } = await supabase
        .from("notas_sesion")
        .select("*")
        .eq("id_cita_sesion", citaId)
        .order("creado_en", { ascending: false });

      setNotasSesion(data || []);
    }

    cargarNotas();
  }, [citaId]);

  /* ============================================================
     SI NO HAY CITA O MODAL CERRADO → NO RENDERIZAR
  ============================================================ */
  if (!open || !detalleCita) return null;

  /* ============================================================
     CAMPOS DE CITA
  ============================================================ */
  const {
    paciente,
    hora_inicio,
    hora_fin,
    estado_cita,
    estado_pago,
    notas_cliente,
  } = detalleCita;

  const inicio = hora_inicio
    ? new Date(hora_inicio).toLocaleString("es-ES")
    : "—";

  const fin = hora_fin
    ? new Date(hora_fin).toLocaleString("es-ES")
    : "—";

  /* ============================================================
     PAGO EN EFECTIVO + CONFIRMAR CITA
  ============================================================ */
  async function actualizarPagoYConfirmar() {
    setLoading(true);

    await supabase
      .from("citas_sesiones")
      .update({
        estado_pago: "pagado",
        estado_cita: "confirmada",
      })
      .eq("id", citaId);

    setLoading(false);
    onClose();
    window.location.reload();
  }

  /* ============================================================
     ACTUALIZAR ESTADO CITA
  ============================================================ */
  async function actualizarEstadoCita(nuevo) {
    setLoading(true);

    await supabase
      .from("citas_sesiones")
      .update({ estado_cita: nuevo })
      .eq("id", citaId);

    setLoading(false);
    onClose();
    window.location.reload();
  }

  /* ============================================================
     AÑADIR NOTA PROFESIONAL
  ============================================================ */
  async function agregarNota() {
    if (!nuevaNota.trim()) return;

    setLoading(true);

    await supabase.from("notas_sesion").insert({
      id_cita_sesion: citaId,
      contenido_nota: nuevaNota,
    });

    const { data } = await supabase
      .from("notas_sesion")
      .select("*")
      .eq("id_cita_sesion", citaId)
      .order("creado_en", { ascending: false });

    setNotasSesion(data || []);
    setNuevaNota("");
    setLoading(false);
  }

  /* ============================================================
     RENDER
  ============================================================ */
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scaleIn">

        {/* ================= HEADER ================= */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 p-6">
          <h2 className="text-2xl font-bold text-white">Detalles de la cita</h2>
          <p className="text-sm text-white/80">Gestión profesional</p>
        </div>

        {/* ================= CONTENIDO SCROLLEABLE ================= */}
        <div className="p-6 space-y-6 overflow-y-auto">

          {/* Paciente */}
          <div className="flex items-start gap-3">
            <User className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Paciente</p>
              <p className="text-lg font-semibold">{paciente}</p>
            </div>
          </div>

          {/* Horario */}
          <div className="flex items-start gap-3">
            <Clock className="w-6 h-6 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Horario</p>
              <p className="font-semibold">{inicio}</p>
              <p className="font-semibold">{fin}</p>
            </div>
          </div>

          {/* Estado cita */}
          <div>
            <p className="text-sm text-gray-500">Estado de la cita</p>
            <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
              {estado_cita}
            </span>
          </div>

          {/* Estado pago */}
          <div>
            <p className="text-sm text-gray-500">Estado del pago</p>
            <span className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700">
              {estado_pago}
            </span>
          </div>

          {/* Notas del cliente */}
          {notas_cliente && (
            <div>
              <p className="text-sm text-gray-500">Notas del cliente</p>
              <div className="p-3 bg-gray-100 rounded-lg">
                {notas_cliente}
              </div>
            </div>
          )}

          {/* Notas de sesión */}
          <div>
            <p className="text-sm text-gray-500 font-medium mb-2">Notas de sesión</p>

            {notasSesion.length === 0 ? (
              <p className="text-gray-400 text-sm">No hay notas aún.</p>
            ) : (
              <ul className="space-y-3">
                {notasSesion.map((n) => (
                  <li key={n.id} className="p-3 bg-gray-100 rounded-lg shadow-sm">
                    <p className="text-gray-800 text-sm">{n.contenido_nota}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(n.creado_en).toLocaleString("es-ES")}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            {/* Añadir nota */}
            <textarea
              value={nuevaNota}
              onChange={(e) => setNuevaNota(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-3 mt-3 focus:ring-2 focus:ring-purple-500"
              placeholder="Añadir nota profesional..."
            />

            <button
              onClick={agregarNota}
              disabled={loading}
              className="w-full py-2 mt-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
            >
              Guardar nota
            </button>
          </div>

          {/* ================= CONFIRMAR PAGO ================= */}
          {estado_pago === "pendiente" && (
            <button
              onClick={actualizarPagoYConfirmar}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Confirmar pago en efectivo
            </button>
          )}
        </div>

        {/* ================= FOOTER (acciones) ================= */}
        <div className="p-6 border-t flex flex-col gap-3">

          <div className="flex gap-2">
            <button
              onClick={() => actualizarEstadoCita("confirmada")}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg"
            >
              Confirmar Cita
            </button>


            <button
              onClick={() => actualizarEstadoCita("cancelada")}
              className="flex-1 py-2 bg-red-600 text-white rounded-lg"
            >
              Cancelar cita
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
