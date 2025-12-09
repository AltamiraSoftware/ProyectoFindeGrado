// app/dashboard/chat/ChatList.jsx
"use client";

import { useState } from "react";

export default function ChatList({ clientes, clienteActivo, onSelect }) {
  const [search, setSearch] = useState("");

  const filtrados = clientes.filter((c) =>
    c.nombre_completo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-80 bg-white border-r shadow-md flex flex-col h-full">
      {/* BUSCADOR */}
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Buscar paciente..."
          className="w-full px-3 py-2 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LISTA */}
      <div className="flex-1 overflow-y-auto">
        {filtrados.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`p-4 cursor-pointer border-b hover:bg-gray-100 transition ${
              clienteActivo === c.id ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            <div className="text-lg">{c.nombre_completo}</div>
          </div>
        ))}

        {filtrados.length === 0 && (
          <p className="text-center p-4 text-gray-500">No hay coincidencias</p>
        )}
      </div>
    </div>
  );
}
