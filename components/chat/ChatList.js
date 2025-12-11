"use client";

import { useState } from "react";

export default function ChatList({ clientes, clienteActivo, onSelect }) {
  const [search, setSearch] = useState("");

  const filtrados = clientes.filter((c) =>
    c.nombre_completo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-80 bg-white border-r shadow-xl flex flex-col h-full rounded-l-xl overflow-hidden">

      {/* 🔍 BUSCADOR */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
        <input
          type="text"
          placeholder="Buscar paciente..."
          className="
            w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400
            transition-all
          "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🧑‍⚕️ LISTA DE PACIENTES */}
      <div className="flex-1 overflow-y-auto">
        {filtrados.map((c) => {
          const isActive = clienteActivo === c.id;

          return (
            <div
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`
                flex items-center gap-3 px-4 py-3 cursor-pointer border-b 
                transition-all
                ${isActive 
                  ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white shadow-md" 
                  : "hover:bg-gray-100"
                }
              `}
            >
              {/* AVATAR SIMPLE (INICIAL) */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold
                  ${isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"}
                `}
              >
                {c.nombre_completo.charAt(0).toUpperCase()}
              </div>

              {/* NOMBRE */}
              <div className="flex-1">
                <p className={`text-sm font-semibold ${isActive ? "text-white" : "text-gray-800"}`}>
                  {c.nombre_completo}
                </p>
                <p className={`text-xs ${isActive ? "text-white/80" : "text-gray-500"}`}>
                  Ver conversación →
                </p>
              </div>
            </div>
          );
        })}

        {/* SIN COINCIDENCIAS */}
        {filtrados.length === 0 && (
          <p className="text-center p-4 text-gray-500">No hay coincidencias</p>
        )}
      </div>
    </div>
  );
}
