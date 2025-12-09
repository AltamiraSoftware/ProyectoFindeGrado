"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ClienteNextAppointments({ userId }) {
  const [citas, setCitas] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!userId) return;

    async function loadCitas() {
      const { data } = await supabase
        .from("citas_sesiones")
        .select(`
          id,
          hora_inicio,
          hora_fin,
          estado_cita,
          estado_pago,
          servicios (nombre, precio)
        `)
        .eq("id_cliente", userId)
        .order("hora_inicio", { ascending: true });

      setCitas(data || []);
    }

    loadCitas();
  }, [userId]);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const futuras = citas.filter(
    (c) => new Date(c.hora_inicio) >= hoy && c.estado_cita !== "cancelada"
  );

  return (
    <div className="bg-white shadow-md p-6 rounded-2xl mt-2">
      

      {futuras.length === 0 ? (
        <p className="text-gray-600">No tienes citas próximas.</p>
      ) : (
        futuras.map((c) => (
          <div key={c.id} className="border-l-4 border-blue-600 pl-4 mb-4">
            <p className="font-semibold text-gray-900">{c.servicios.nombre}</p>
            <p className="text-gray-700">
              {new Date(c.hora_inicio).toLocaleDateString("es-ES")}
              {" • "}
              {new Date(c.hora_inicio).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Estado:{" "}
              <span
                className={
                  c.estado_cita === "confirmada"
                    ? "text-green-600"
                    : "text-yellow-600"
                }
              >
                {c.estado_cita}
              </span>
            </p>
          </div>
        ))
      )}

      <button
        onClick={() => setShowModal(true)}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Ver historial
      </button>

      {showModal && (
        <HistorialModal citas={citas} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

/* -------------------------------
     MODAL DEL HISTORIAL
-------------------------------- */

function HistorialModal({ citas, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-xl animate-fadeInUp relative overflow-hidden">

        {/* ENCABEZADO CORPORATIVO */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 p-6 text-white">
          <h2 className="text-2xl font-bold text-center">Historial de Citas</h2>
        </div>

        {/* BOTÓN CERRAR */}
        <button
          className="absolute top-4 right-4 text-white/90 hover:text-white text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        {/* CONTENIDO */}
        <div className="p-6 max-h-[400px] overflow-y-auto space-y-4">

          {citas.length === 0 && (
            <p className="text-gray-600 text-center">
              No hay citas registradas.
            </p>
          )}

          {citas.map((cita) => (
            <div
              key={cita.id}
              className="border rounded-xl p-4 bg-gray-50 shadow-sm"
            >
              <h3 className="font-semibold !text-gray-900">
                {cita.servicios.nombre}
              </h3>

              <p className="!text-gray-700">
                {new Date(cita.hora_inicio).toLocaleDateString("es-ES")}
                {" • "}
                {new Date(cita.hora_inicio).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p className="text-sm mt-1">
                Estado cita:{" "}
                <span
                  className={
                    cita.estado_cita === "confirmada"
                      ? "text-green-600"
                      : cita.estado_cita === "cancelada"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {cita.estado_cita}
                </span>
              </p>

              <p className="text-sm">
                Pago:{" "}
                <span
                  className={
                    cita.estado_pago === "pagado"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                >
                  {cita.estado_pago}
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* BOTÓN CERRAR FOOTER */}
        <div className="p-6">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white py-3 rounded-xl hover:opacity-90 transition font-semibold"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}

