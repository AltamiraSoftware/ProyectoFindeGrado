"use client";

import { useState } from "react";
import { ChevronLeft, CheckCircle } from "lucide-react";

export default function BookingConfirmation({
  date,
  time,
  servicios,
  selectedService,
  setSelectedService,
  onConfirm,
  onBack,
}) {
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!selectedService) e.service = "Debes seleccionar un servicio";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onConfirm({ notes });
  };

  const dateFormatted = new Date(date).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack} 
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold !text-gray-900">Confirma tu Cita</h2>
          <p className="text-gray-600">Selecciona servicio y añade notas opcionales</p>
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-8 border-l-4 border-blue-600">
        <div className="flex items-start gap-4">
          <CheckCircle className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Tu Cita</h3>

            <p className="text-sm text-gray-600">Fecha</p>
            <p className="font-semibold text-gray-900 capitalize mb-3">{dateFormatted}</p>

            <p className="text-sm text-gray-600">Hora</p>
            <p className="font-semibold text-gray-900">{time}</p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Servicios */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Tipo de Sesión
          </label>

          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className={`w-full px-4 py-2 border-2 rounded-lg  ${
              errors.service ? "border-red-600" : "border-gray-300"
            }`}
          >
            <option value="">Selecciona un servicio</option>

            {servicios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre} — {s.precio}€
              </option>
            ))}
          </select>

          {errors.service && (
            <p className="text-red-600 text-sm mt-1">{errors.service}</p>
          )}
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Notas adicionales (opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
            placeholder="Escribe aquí cualquier información relevante..."
          />
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-6">
          <button 
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
          >
            Atrás
          </button>

          <button 
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg"
          >
            Confirmar cita
          </button>
        </div>
      </form>
    </div>
  );
}
