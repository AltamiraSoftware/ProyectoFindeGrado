"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export default function AppointmentCalendar({ availabilityData, onDateSelect }) {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // 🟦 Semana de lunes a domingo
  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  // 🟦 Primer día del mes con lunes como columna 1 (lunes = 0)
  const getFirstDayOfMonth = (date) => {
    const nativeDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return (nativeDay + 6) % 7;
  };

  const monthDays = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const days = [];

  // 🟦 Días vacíos ajustados a calendario lunes–domingo
  for (let i = 0; i < firstDay; i++) days.push(null);

  // Días del mes
  for (let i = 1; i <= monthDays; i++) days.push(i);

  // Chequear disponibilidad REAL del mapa
  const hasAvailability = (day) => {
    const dateKey = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return availabilityData[dateKey] && availabilityData[dateKey].length > 0;
  };

  return (
    <div className="bg-white rounded-lg p-6">
      
      {/* Controles de mes */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
            )
          }
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <h3 className="text-xl font-semibold !text-gray-900 capitalize">
          {currentDate.toLocaleDateString("es-ES", {
            month: "long",
            year: "numeric",
          })}
        </h3>

        <button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
            )
          }
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Calendario */}
      <div className="bg-gray-50 rounded-lg p-4">
        
        {/* 🟦 Semana de lunes → domingo */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((d) => (
            <div
              key={d}
              className="text-center text-sm font-semibold text-gray-600"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Días */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => (
            <div key={idx}>
              {day ? (
                <button
                  onClick={() =>
                    hasAvailability(day) &&
                    onDateSelect(
                      `${currentDate.getFullYear()}-${String(
                        currentDate.getMonth() + 1
                      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                    )
                  }
                  disabled={!hasAvailability(day)}
                  className={`w-full aspect-square flex items-center justify-center rounded-lg font-semibold transition ${
                    hasAvailability(day)
                      ? "bg-blue-400 hover:bg-purple-600 text-white border-2 border-transparent hover:border-blue-600"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {day}
                </button>
              ) : (
                <div className="w-full aspect-square"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Leyenda */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          <span className="inline-block w-4 h-4 bg-blue-400 border-2 border-blue-600 rounded mr-2"></span>
          Disponible
        </p>
        <p className="text-sm text-gray-600 mt-2">
          <span className="inline-block w-4 h-4 bg-gray-200 rounded mr-2"></span>
          No disponible
        </p>
      </div>
    </div>
  );
}
