"use client";

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded shadow p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold mb-2 text-gray-800">
          Añadir cita
        </h2>

        {loadingModal ? (
          <div className="text-gray-700">Cargando...</div>
        ) : (
          <>
            {/* CLIENTE */}
            <label className="block text-sm font-medium text-gray-700">
              Cliente
            </label>

            <div className="flex gap-2">
              <select
                className="flex-1 border rounded px-3 py-2 text-gray-800"
                value={formCita.cliente}
                onChange={(e) =>
                  setFormCita((f) => ({
                    ...f,
                    cliente: e.target.value,
                  }))
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
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-semibold"
              >
                {showNuevoPaciente ? "Cancelar" : "Nuevo"}
              </button>
            </div>

            {/* NUEVO PACIENTE */}
            {showNuevoPaciente && (
              <div className="border rounded p-4 bg-gray-50">
                <h3 className="font-semibold mb-3 text-gray-800">
                  Crear nuevo paciente
                </h3>

                <div className="space-y-3">
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
                      className="w-full border rounded px-3 py-2 text-gray-800"
                      required
                    />
                  </div>

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
                      className="w-full border rounded px-3 py-2 text-gray-800"
                      required
                    />
                  </div>

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
                      className="w-full border rounded px-3 py-2 text-gray-800"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={onCrearNuevoPaciente}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
                    disabled={creandoPaciente}
                  >
                    {creandoPaciente ? "Creando..." : "Crear paciente"}
                  </button>
                </div>
              </div>
            )}

            {/* SERVICIO */}
            <label className="block text-sm font-medium text-gray-700">
              Servicio
            </label>
            <select
              className="w-full border rounded px-3 py-2 text-gray-800"
              value={formCita.servicio}
              onChange={(e) =>
                setFormCita((f) => ({
                  ...f,
                  servicio: e.target.value,
                }))
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
            <label className="block text-sm font-medium text-gray-700">
              Franja disponible
            </label>
            <select
              className="w-full border rounded px-3 py-2 text-gray-800"
              value={formCita.franja}
              onChange={(e) =>
                setFormCita((f) => ({
                  ...f,
                  franja: e.target.value,
                }))
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
            <label className="block text-sm font-medium text-gray-700">
              Notas (opcional)
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 text-gray-800"
              rows={2}
              value={formCita.notas}
              onChange={(e) =>
                setFormCita((f) => ({
                  ...f,
                  notas: e.target.value,
                }))
              }
            />
          </>
        )}

        {/* BOTONES */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded font-semibold"
            disabled={loadingModal}
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 px-4 rounded font-semibold"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
