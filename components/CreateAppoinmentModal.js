"use client";

import { CalendarDaysIcon } from "@heroicons/react/24/solid";

export default function CreateAppointmentModal({
  open,
  onClose,
  clientes,
  servicios,
  franjasDisponibles,
  formCita,
  setFormCita,
  loadingModal,
  onSubmit,
  showNuevoPaciente,
  setShowNuevoPaciente,
  formNuevoPaciente,
  setFormNuevoPaciente,
  creandoPaciente,
  onCrearNuevoPaciente,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn"
      >
        {/* ======================= HEADER PREMIUM ======================= */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 p-6 flex items-center gap-3">
          <CalendarDaysIcon className="w-8 h-8 text-white drop-shadow" />
          <div>
            <h2 className="text-2xl font-bold text-white">Nueva cita</h2>
            <p className="text-white/80 text-sm">
              Completa los datos para registrar la cita
            </p>
          </div>
        </div>

        {/* ======================= CONTENIDO ======================= */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* LOADING */}
          {loadingModal ? (
            <div className="text-gray-700">Cargando datos…</div>
          ) : (
            <>
              {/* CLIENTE */}
              <label className="block text-sm font-semibold text-gray-700">
                Cliente
              </label>

              <div className="flex gap-2">
                <select
                  className="flex-1 border rounded-lg px-3 py-2 text-gray-800 focus:ring focus:ring-purple-300 outline-none"
                  value={formCita.cliente || ""}
                  onChange={(e) =>
                    setFormCita((f) => ({ ...f, cliente: e.target.value }))
                  }
                  required
                >
                  <option value="">Selecciona un cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre_completo}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowNuevoPaciente(!showNuevoPaciente)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-semibold shadow transition"
                >
                  {showNuevoPaciente ? "Cancelar" : "Nuevo"}
                </button>
              </div>

              {/* NUEVO PACIENTE */}
              {showNuevoPaciente && (
                <div className="border rounded-xl p-4 bg-gray-50 shadow-inner space-y-3">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Crear nuevo paciente
                  </h3>

                  {/* NOMBRE */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      value={formNuevoPaciente.nombre_completo}
                      onChange={(e) =>
                        setFormNuevoPaciente((f) => ({
                          ...f,
                          nombre_completo: e.target.value,
                        }))
                      }
                      className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:ring focus:ring-purple-300 outline-none"
                      required
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formNuevoPaciente.email}
                      onChange={(e) =>
                        setFormNuevoPaciente((f) => ({
                          ...f,
                          email: e.target.value,
                        }))
                      }
                      className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:ring focus:ring-purple-300 outline-none"
                      required
                    />
                  </div>

                  {/* TELÉFONO */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Teléfono (opcional)
                    </label>
                    <input
                      type="tel"
                      value={formNuevoPaciente.telefono}
                      onChange={(e) =>
                        setFormNuevoPaciente((f) => ({
                          ...f,
                          telefono: e.target.value,
                        }))
                      }
                      className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:ring focus:ring-purple-300 outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={onCrearNuevoPaciente}
                    disabled={creandoPaciente}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold shadow transition"
                  >
                    {creandoPaciente ? "Creando..." : "Crear paciente"}
                  </button>
                </div>
              )}

              {/* SERVICIO */}
              <label className="block text-sm font-semibold text-gray-700">
                Servicio
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:ring focus:ring-purple-300 outline-none"
                value={formCita.servicio || ""}
                onChange={(e) =>
                  setFormCita((f) => ({ ...f, servicio: e.target.value }))
                }
                required
              >
                <option value="">Selecciona un servicio</option>
                {servicios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>

              {/* FRANJA */}
              <label className="block text-sm font-semibold text-gray-700">
                Franja disponible
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:ring focus:ring-purple-300 outline-none"
                value={formCita.franja || ""}
                onChange={(e) =>
                  setFormCita((f) => ({ ...f, franja: e.target.value }))
                }
                required
              >
                <option value="">Selecciona una franja</option>
                {franjasDisponibles.map((f) => (
                  <option key={f.id} value={f.id}>
                    {new Date(f.hora_inicio).toLocaleString("es-ES")}{" "}
                    {" - "}
                    {new Date(f.hora_fin).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </option>
                ))}
              </select>

              {/* NOTAS */}
              <label className="block text-sm font-semibold text-gray-700">
                Notas (opcional)
              </label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:ring focus:ring-purple-300 outline-none"
                rows={2}
                value={formCita.notas}
                onChange={(e) =>
                  setFormCita((f) => ({ ...f, notas: e.target.value }))
                }
              />
            </>
          )}
        </div>

        {/* ======================= FOOTER PREMIUM ======================= */}
        <div className="bg-gray-100 p-4 flex justify-end gap-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loadingModal}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:opacity-90 transition"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
