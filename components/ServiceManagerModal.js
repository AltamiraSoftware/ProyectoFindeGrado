"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ServiceManagerModal({ open, onClose }) {
  /* ============================================================
      HOOKS — SIEMPRE AL INICIO
  ============================================================ */
  const [servicios, setServicios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ============================================================
      CARGAR SERVICIOS — NUNCA LLAMAR CONDICIONALMENTE
  ============================================================ */
  useEffect(() => {
    if (!open) return; // OK: condición DENTRO del hook, NO rodeando el hook

    async function cargarServicios() {
      setLoading(true);

      const { data, error } = await supabase
        .from("servicios")
        .select("*")
        .order("id", { ascending: true });

      if (!error) setServicios(data || []);
      setLoading(false);
    }

    cargarServicios();
  }, [open]);

  /* ============================================================
      RETURN TEMPRANO — DEBE IR DESPUÉS DE TODOS LOS HOOKS
  ============================================================ */
  if (!open) return null;

  /* ============================================================
      CREAR SERVICIO
  ============================================================ */
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("servicios")
      .insert({
        nombre,
        precio,
        esta_activo: true,
      });

    if (!error) {
      setNombre("");
      setPrecio("");

      const { data } = await supabase
        .from("servicios")
        .select("*")
        .order("id");

      setServicios(data || []);
    }

    setSaving(false);
  }

  /* ============================================================
      ACTIVAR / DESACTIVAR SERVICIO
  ============================================================ */
  async function toggleActivo(servicio) {
    await supabase
      .from("servicios")
      .update({ esta_activo: !servicio.esta_activo })
      .eq("id", servicio.id);

    const { data } = await supabase
      .from("servicios")
      .select("*")
      .order("id");

    setServicios(data || []);
  }

  /* ============================================================
      UI
  ============================================================ */
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">

      {/* Fondo oscuro */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">

        {/* HEADER CORPORATIVO */}
        <div className="p-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M9 17v-6h6v6m3 4H6a2 2 0 01-2-2V6a2 2 0 012-2h3l1-2h4l1 2h3a2 2 0 012 2v13a2 2 0 01-2 2z" />
              </svg>
            </div>

            <h2 className="text-lg font-bold">Gestión de Servicios</h2>
          </div>

          <button
            onClick={onClose}
            className="text-white text-xl font-bold hover:text-red-200 transition"
          >
            ✕
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="p-6 space-y-6">

          {/* LISTA DE SERVICIOS */}
          <div>
            <h3 className="text-lg font-semibold mb-3 !text-gray-800">
              Servicios existentes
            </h3>

            {loading ? (
              <p className="text-gray-500 text-sm">Cargando servicios…</p>
            ) : servicios.length === 0 ? (
              <p className="text-gray-500">No hay servicios registrados.</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {servicios.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-4 rounded-xl border 
                               shadow-sm bg-white 
                               border-blue-200 hover:border-purple-400 
                               hover:shadow-md transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{s.nombre}</p>
                      <p className="text-sm text-gray-600">{s.precio} €</p>
                    </div>

                    <button
                      onClick={() => toggleActivo(s)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium text-white
                        ${
                          s.esta_activo
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }
                      `}
                    >
                      {s.esta_activo ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FORMULARIO NUEVO SERVICIO */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Añadir nuevo servicio
            </h3>

            <form onSubmit={handleSave} className="grid grid-cols-1 gap-4">
              <input
                required
                placeholder="Nombre del servicio"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />

              <input
                required
                type="number"
                min="1"
                placeholder="Precio (€)"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />

              <button
                disabled={saving}
                className="py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {saving ? "Guardando…" : "Guardar servicio"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
