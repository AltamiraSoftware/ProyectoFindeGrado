"use client";

export default function WeekSummary({ resumenSemana }) {
  return (
    <section className="w-full max-w-6xl mx-auto mt-10 mb-16">

      {/* =================== ENCABEZADO CORPORATIVO =================== */}
      <div className="rounded-t-2xl bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white">Resumen de la Semana</h2>
        <p className="text-white/80 text-sm">
          Estado general de las citas programadas esta semana
        </p>
      </div>

      {/* =================== CONTENIDO =================== */}
      <div className="bg-white border border-gray-200 rounded-b-2xl shadow-xl p-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {/* Total */}
          <div className="bg-blue-200 rounded-xl p-5 flex flex-col items-center shadow-md">
            <span className="text-3xl font-bold text-blue-700">
              {resumenSemana.total}
            </span>
            <span className="text-gray-700 text-sm">Total de citas</span>
          </div>

          {/* Pendientes */}
          <div className="bg-purple-200 rounded-xl p-5 flex flex-col items-center shadow-md">
            <span className="text-3xl font-bold text-yellow-600">
              {resumenSemana.pendientes}
            </span>
            <span className="text-gray-700 text-sm">Pendientes</span>
          </div>

          {/* Pagadas */}
          <div className="bg-green-200 rounded-xl p-5 flex flex-col items-center shadow-md">
            <span className="text-3xl font-bold text-green-700">
              {resumenSemana.pagadas}
            </span>
            <span className="text-gray-700 text-sm">Pagadas</span>
          </div>

          {/* Canceladas */}
          <div className="bg-pink-200 rounded-xl p-5 flex flex-col items-center shadow-md">
            <span className="text-3xl font-bold text-red-600">
              {resumenSemana.canceladas}
            </span>
            <span className="text-gray-700 text-sm">Canceladas</span>
          </div>

        </div>
      </div>
    </section>
  );
}
