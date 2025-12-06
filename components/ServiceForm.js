"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ServiceForm({ onCreated }) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    duracion_minutos: "",
    precio: "",
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    const { nombre, descripcion, duracion_minutos, precio } = form;

    const { error } = await supabase.from("servicios").insert({
      nombre,
      descripcion,
      duracion_minutos: Number(duracion_minutos),
      precio: Number(precio),
      esta_activo: true,
    });

    setLoading(false);

    if (error) {
      setMensaje("❌ Error al crear el servicio.");
      console.error(error);
      return;
    }

    setMensaje("✅ Servicio creado correctamente.");
    setForm({
      nombre: "",
      descripcion: "",
      duracion_minutos: "",
      precio: "",
    });

    if (onCreated) onCreated();
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-200 w-full max-w-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Crear nuevo servicio
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre del servicio
          </label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) =>
              setForm({ ...form, nombre: e.target.value })
            }
            className="w-full border rounded px-3 py-2 text-gray-800"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            value={form.descripcion}
            onChange={(e) =>
              setForm({ ...form, descripcion: e.target.value })
            }
            rows={2}
            className="w-full border rounded px-3 py-2 text-gray-800"
            required
          />
        </div>

        {/* Duración */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Duración (minutos)
          </label>
          <input
            type="number"
            min="10"
            value={form.duracion_minutos}
            onChange={(e) =>
              setForm({ ...form, duracion_minutos: e.target.value })
            }
            className="w-full border rounded px-3 py-2 text-gray-800"
            required
          />
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Precio (€)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.precio}
            onChange={(e) =>
              setForm({ ...form, precio: e.target.value })
            }
            className="w-full border rounded px-3 py-2 text-gray-800"
            required
          />
        </div>

        {/* Mensaje */}
        {mensaje && (
          <div className="text-center text-sm font-medium pt-2">
            {mensaje}
          </div>
        )}

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded font-semibold"
        >
          {loading ? "Creando..." : "Crear servicio"}
        </button>
      </form>
    </div>
  );
}
