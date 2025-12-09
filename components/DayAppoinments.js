"use client";

import { ClockIcon, CalendarIcon, UserIcon } from "@heroicons/react/24/outline";

export default function DayAppointments({
  selectedDate,
  citasDelDia,
  clientes,
  loadingCitas,
  onOpenCreateModal,
  onCancelarCita,
  onVerDetalles,
}) {
  return (
    <section className="rounded-2xl shadow-xl overflow-hidden bg-white border border-gray-200">

      {/* ================= ENCABEZADO ================= */}
      <div className="w-full rounded-t-2xl bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#DB2777] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20">
            <ClockIcon className="h-5 w-5 text-white" />
          </span>

          <div>
            <h2 className="text-lg font-bold text-white">Citas del día</h2>
            <p className="text-white/80 text-xs capitalize">
              {selectedDate.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-50 transition"
        >
          Añadir cita
        </button>
      </div>

      {/* ================= CONTENIDO ================= */}
      <div className="p-6 min-h-[220px] bg-white rounded-b-2xl">
        {loadingCitas ? (
          <div className="flex flex-col items-center justify-center text-gray-400 py-10">
            Cargando...
          </div>
        ) : citasDelDia.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-400 py-10">
            <CalendarIcon className="h-12 w-12 mb-2" />
            <span>No hay citas para esta fecha</span>
          </div>
        ) : (
          <ul className="space-y-4">
            {citasDelDia.map((c) => {
              const cliente = clientes.find((cl) => cl.id === c.id_cliente);

              return (
                <li
                  key={c.id}
                  className="p-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between transition hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <UserIcon className="w-6 h-6 text-blue-600 mt-1" />

                    <div>
                      <p className="font-semibold text-gray-900 text-lg">
                        {new Date(c.hora_inicio).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>

                      <p className="text-gray-700 text-sm">
                        {cliente?.nombre_completo || "Paciente externo"}
                      </p>

                      <button
                        onClick={() =>
                          onVerDetalles({
                            ...c,
                            paciente: cliente?.nombre_completo || "Paciente externo",
                            hora_inicio: c.hora_inicio,
                            hora_fin: c.hora_fin,
                            estado_cita: c.estado_cita,
                            estado_pago: c.estado_pago,            // ✔ AHORA SE INCLUYE
                            notas_cliente: c.notas_cliente,
                            notas_profesional: c.notas_profesional,
                            id_franja_disponibilidad: c.id_franja_disponibilidad,
                          })
                        }
                        className="text-sm text-blue-600 hover:underline mt-1"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>

                  {c.estado_cita !== "cancelada" && (
                    <button
                      onClick={() =>
                        onCancelarCita(c.id, c.id_franja_disponibilidad)
                      }
                      className="mt-3 md:mt-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
                    >
                      Cancelar
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
