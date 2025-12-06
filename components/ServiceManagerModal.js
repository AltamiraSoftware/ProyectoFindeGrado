"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

export default function ServiceManagerModal({ open, onClose }) {

  // ❗ TODOS LOS HOOKS DEBEN IR ANTES DE CUALQUIER return
  const [loading, setLoading] = useState(true);
  const [servicios, setServicios] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    duracion_minutos: "",
    precio: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [creando, setCreando] = useState(false);

  // ============================
  //     FETCH SERVICIOS
  // ============================
  async function fetchServicios() {
    const { data, error } = await supabase
      .from("servicios")
      .select("*")
      .order("creado_en", { ascending: false });

    if (!error) setServicios(data || []);
    setLoading(false);
  }

  useEffect(() => {
    async function cargar() {
      setLoading(true);
      await fetchServicios();
    }
    cargar();
  }, [refresh]);

  // ============================
  //    CREAR SERVICIO
  // ============================
  async function handleCrearServicio(e) {
    e.preventDefault();
    setCreando(true);
    setMensaje("");

    const { nombre, descripcion, duracion_minutos, precio } = form;

    const { error } = await supabase.from("servicios").insert({
      nombre,
      descripcion,
      duracion_minutos: Number(duracion_minutos),
      precio: Number(precio),
      esta_activo: true,
    });

    if (error) {
      setMensaje("❌ Error al crear el servicio.");
      setCreando(false);
      return;
    }

    setMensaje("✅ Servicio creado.");

    setForm({
      nombre: "",
      descripcion: "",
      duracion_minutos: "",
      precio: "",
    });

    setCreando(false);
    setRefresh(!refresh);
  }

  // ============================
  //   TOGGLE ESTADO SERVICIO
  // ============================
  async function toggleEstado(id, estado) {
    await supabase
      .from("servicios")
      .update({ esta_activo: !estado })
      .eq("id", id);

    setRefresh(!refresh);
  }

  // ============================
  //        RETURN UI
  // ============================
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Servicios</h2>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold"
          >
            Cerrar
          </button>
        </div>

        {/* FORMULARIO */}
        <form
          onSubmit={handleCrearServicio}
          className="space-y-4 bg-gray-50 p-4 rounded-lg border mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Crear nuevo servicio
          </h3>

          {/* Campos */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del servicio
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full border rounded px-3 py-2 text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              rows={2}
              className="w-full border rounded px-3 py-2 text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duración (minutos)
            </label>
            <input
              type="number"
              value={form.duracion_minutos}
              min="10"
              onChange={(e) =>
                setForm({ ...form, duracion_minutos: e.target.value })
              }
              className="w-full border rounded px-3 py-2 text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Precio (€)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
              className="w-full border rounded px-3 py-2 text-gray-800"
              required
            />
          </div>

          {mensaje && (
            <p className="text-center text-sm font-medium">{mensaje}</p>
          )}

          <button
            type="submit"
            disabled={creando}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded font-semibold"
          >
            {creando ? "Creando..." : "Crear servicio"}
          </button>
        </form>

        {/* LISTADO */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Servicios existentes
        </h3>

        {loading ? (
          <div className="text-center text-gray-500">Cargando...</div>
        ) : servicios.length === 0 ? (
          <div className="text-center text-gray-500">
            No hay servicios creados.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {servicios.map((s) => (
              <div
                key={s.id}
                className="bg-white border rounded-xl shadow p-5 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-lg font-bold text-gray-800">
                    {s.nombre}
                  </h4>

                  <p className="text-gray-600 mt-1">{s.descripcion}</p>

                  <div className="mt-3 text-sm text-gray-700">
                    <span className="block">🕒 Duración: {s.duracion_minutos} min</span>
                    <span className="block">💶 Precio: {s.precio} €</span>
                  </div>

                  <span
                    className={`inline-block mt-3 px-3 py-1 text-xs rounded-full font-semibold ${
                      s.esta_activo
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {s.esta_activo ? "Activo" : "Inactivo"}
                  </span>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => toggleEstado(s.id, s.esta_activo)}
                    className={`px-4 py-2 rounded-lg text-white font-semibold ${
                      s.esta_activo
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {s.esta_activo ? "Desactivar" : "Activar"}
                  </button>

                  <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold flex items-center gap-2">
                    <PencilSquareIcon className="w-5 h-5" />
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
