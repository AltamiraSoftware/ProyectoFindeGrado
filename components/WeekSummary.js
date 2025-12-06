"use client";

export default function WeekSummary({ resumenSemana }) {
  return (
    <section className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-2">
        Resumen de la Semana
      </h2>
      <p className="text-white mb-4">
        Vista general de las próximas citas
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 flex flex-col items-center shadow">
          <span className="text-2xl font-bold text-blue-700">
            {resumenSemana.total}
          </span>
          <span className="text-gray-700 text-sm">Citas esta semana</span>
        </div>

        <div className="bg-green-100 rounded-lg p-4 flex flex-col items-center shadow">
          <span className="text-2xl font-bold text-green-700">
            {resumenSemana.confirmadas}
          </span>
          <span className="text-gray-700 text-sm">Confirmadas</span>
        </div>

        <div className="bg-yellow-100 rounded-lg p-4 flex flex-col items-center shadow">
          <span className="text-2xl font-bold text-yellow-700">
            {resumenSemana.pendientes}
          </span>
          <span className="text-gray-700 text-sm">Pendientes</span>
        </div>

        <div className="bg-red-100 rounded-lg p-4 flex flex-col items-center shadow">
          <span className="text-2xl font-bold text-red-700">
            {resumenSemana.canceladas}
          </span>
          <span className="text-gray-700 text-sm">Canceladas</span>
        </div>
      </div>
    </section>
  );
}
