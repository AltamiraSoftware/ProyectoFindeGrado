"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

export default function ServiceList({ refresh }) {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

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

  async function toggleEstado(id, estado) {
    await supabase
      .from("servicios")
      .update({ esta_activo: !estado })
      .eq("id", id);

    await fetchServicios();
  }

  if (loading) {
    return (
      <div className="p-6 text-gray-500 text-center border rounded-xl bg-white shadow">
        Cargando servicios...
      </div>
    );
  }

  if (servicios.length === 0) {
    return (
      <div className="p-6 text-gray-500 text-center border rounded-xl bg-white shadow">
        No hay servicios creados aún.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {servicios.map((s) => (
        <div
          key={s.id}
          className="bg-white border rounded-xl shadow p-5 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-xl font-bold text-gray-800">{s.nombre}</h3>
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
  );
}
