"use client";

import { Clock, ChevronLeft } from "lucide-react";

export default function TimeSlots({
  date,
  timeSlots,
  selectedTime,
  onTimeSelect,
  onBack,
}) {
  const dateObj = new Date(date);
  const dateFormatted = dateObj.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const morningSlots = timeSlots.filter(
    (t) => parseInt(t.split(":")[0]) < 13
  );

  const afternoonSlots = timeSlots.filter(
    (t) => parseInt(t.split(":")[0]) >= 13
  );

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
          <h2 className="text-2xl font-bold text-gray-900">
            Horarios Disponibles
          </h2>
          <p className="text-gray-600 capitalize">{dateFormatted}</p>
        </div>
      </div>

      {/* Mañana */}
      {morningSlots.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Mañana
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {morningSlots.map((time) => (
              <button
                key={time}
                onClick={() => onTimeSelect(time)}
                className={`py-3 px-4 rounded-lg font-semibold border-2 transition ${
                  selectedTime === time
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white border-gray-200 hover:border-blue-600 hover:bg-blue-50"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tarde */}
      {afternoonSlots.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Tarde
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {afternoonSlots.map((time) => (
              <button
                key={time}
                onClick={() => onTimeSelect(time)}
                className={`py-3 px-4 rounded-lg font-semibold border-2 transition ${
                  selectedTime === time
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white border-gray-200 hover:border-purple-600 hover:bg-purple-50"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {timeSlots.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            No hay horarios disponibles para esta fecha
          </p>
        </div>
      )}
    </div>
  );
}
