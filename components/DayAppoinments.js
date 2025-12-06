"use client";

import { ClockIcon, CalendarIcon } from "@heroicons/react/24/outline";

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
    <section className="rounded-xl shadow-lg overflow-hidden bg-white border border-gray-100">
      <div className="w-full rounded-t-xl bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 mr-3">
            <ClockIcon className="h-6 w-6 text-white" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-white">Citas del Día</h2>
            <p className="text-white text-xs">
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
          className="bg-white text-blue-700 font-bold px-4 py-2 rounded shadow hover:bg-blue-50 transition"
        >
          Añadir cita
        </button>
      </div>

      <div className="bg-white p-6 flex flex-col flex-1 min-h-[180px] rounded-b-xl">
        {loadingCitas ? (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
            Cargando...
          </div>
        ) : citasDelDia.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
            <CalendarIcon className="h-12 w-12 mb-2" />
            <span>No hay citas programadas para esta fecha</span>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {citasDelDia.map((c) => {
              const cliente = clientes.find(
                (cl) => cl.id === c.id_cliente
              );
              return (
                <li
                  key={c.id}
                  className="py-2 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <span className="font-semibold text-blue-700">
                      {new Date(c.hora_inicio).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" — "}
                      {cliente?.nombre_completo || "Paciente"}
                    </span>
                    <button
                      onClick={() =>
                        onVerDetalles({
                          paciente:
                            cliente?.nombre_completo || "Paciente",
                          hora: c.hora_inicio,
                          notas: c.notas_cliente,
                          estado: c.estado_cita,
                        })
                      }
                      className="ml-3 text-sm text-blue-600 hover:underline"
                    >
                      Ver detalles
                    </button>
                  </div>
                  {c.estado_cita !== "cancelada" && (
                    <button
                      onClick={() =>
                        onCancelarCita(
                          c.id,
                          c.id_franja_disponibilidad
                        )
                      }
                      className="mt-2 md:mt-0 ml-0 md:ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-semibold"
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
