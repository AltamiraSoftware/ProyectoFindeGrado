"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AccountSettingsModal({ open, onClose, user, profile }) {
  // 🚀 Hooks SIEMPRE aquí, sin condiciones
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // 🔄 Sincronizar cuando user o profile cambien
  useEffect(() => {
    if (user) setEmail(user.email || "");
    if (profile) {
      setNombre(profile.nombre_completo || "");
      setTelefono(profile.telefono || "");
    }
  }, [user, profile]);

  // Si el modal está cerrado → no renderizar nada
  if (!open) return null;

  // Si falta user o profile → mostrar pantalla de carga
  if (!user || !profile) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow text-gray-700">
          Cargando datos del usuario...
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // ACCIONES
  // ---------------------------------------------------------
  async function actualizarPerfil() {
    setGuardando(true);
    setMensaje("");

    try {
      // 1️⃣ Actualizar datos del perfil
      const { error: perfilError } = await supabase
        .from("perfiles_usuarios")
        .update({
          nombre_completo: nombre,
          telefono: telefono,
        })
        .eq("id", user.id);

      if (perfilError) throw perfilError;

      // 2️⃣ Actualizar email si cambió
      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email,
        });
        if (emailError) throw emailError;
      }

      // 3️⃣ Actualizar contraseña si se introdujo
      if (password.length > 0) {
        const { error: passError } = await supabase.auth.updateUser({
          password,
        });
        if (passError) throw passError;
      }

      setMensaje("Cambios guardados correctamente ✔️");
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al guardar los cambios");
    }

    setGuardando(false);
  }

  // ---------------------------------------------------------
  // UI FINAL
  // ---------------------------------------------------------
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pt-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 animate-fadeIn">

        {/* ENCABEZADO CORPORATIVO */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 p-4 rounded-xl mb-6">
          <h2 className="text-xl font-bold text-white">Ajustes de la cuenta</h2>
          <p className="text-white/80 text-sm">Gestiona tus datos personales</p>
        </div>

        {/* CAMPOS */}
        <div className="space-y-4">

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* NOMBRE */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Nombre completo</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          {/* TELEFONO */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Teléfono</label>
            <input
              type="tel"
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Nueva contraseña</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="•••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* MENSAJE */}
          {mensaje && (
            <p className="text-center font-semibold text-blue-700 mt-2">{mensaje}</p>
          )}

        </div>

        {/* BOTONES */}
        <div className="mt-6 flex justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800"
          >
            Cerrar
          </button>

          <button
            onClick={actualizarPerfil}
            disabled={guardando}
            className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>

      </div>
    </div>
  );
}
