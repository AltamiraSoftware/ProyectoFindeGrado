"use client";

export default function AppointmentDetailsModal({
  open,
  detalleCita,
  onClose,
}) {
  if (!open || !detalleCita) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Detalles de la cita
        </h2>
        <p>
          <strong>Paciente:</strong> {detalleCita.paciente}
        </p>
        <p className="mt-2">
          <strong>Hora:</strong>{" "}
          {new Date(detalleCita.hora).toLocaleString("es-ES")}
        </p>
        {detalleCita.estado && (
          <p className="mt-2">
            <strong>Estado:</strong>{" "}
            {detalleCita.estado.charAt(0).toUpperCase() +
              detalleCita.estado.slice(1)}
          </p>
        )}
        {detalleCita.notas && (
          <p className="mt-2">
            <strong>Notas:</strong> {detalleCita.notas}
          </p>
        )}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
