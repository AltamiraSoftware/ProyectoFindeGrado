"use client";

import { supabase } from "@/lib/supabaseClient";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthModal() {
  const { isOpen, closeModal, mode, openLogin, openRegister } = useAuthModal();
  const router = useRouter();

  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  /* =============================
       HANDLERS
  =============================== */

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setErrorMsg("Email o contraseña incorrectos");
      return;
    }

    // Obtener el rol del usuario
    const { data: perfil } = await supabase
      .from("perfiles_usuarios")
      .select("rol")
      .eq("id", data.user.id)
      .single();

    closeModal();

    if (perfil?.rol === "cliente") router.push("/cliente");
    else router.push("/dashboard");
  }

  async function handleRegister(e) {
    e.preventDefault();
    setErrorMsg(null);
  
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          telefono: form.phone || null
        }
      },
    });
  
    if (error) {
      setErrorMsg(error.message);
      return;
    }
  
    alert("Revisa tu correo para confirmar la cuenta.");
    openLogin();
  }
  

 

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] animate-fadeIn">
      
      {/* CARD */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl shadow-black/20 overflow-hidden animate-scaleIn relative">
        
        {/* HEADER DEGRADADO */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 p-6 text-white">
          <h2 className="text-2xl font-bold text-center drop-shadow-md">
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h2>
        </div>

        {/* BOTÓN CERRAR */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-white opacity-80 hover:opacity-100 text-xl"
        >
          ✕
        </button>

        <div className="p-6 space-y-4">

          {/* FORMULARIO LOGIN */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">

              <input
                className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />

              <input
                type="password"
                className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Contraseña"
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
              />

              {errorMsg && (
                <p className="text-red-500 text-sm">{errorMsg}</p>
              )}

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Entrar
              </button>
            </form>
          )}

          {/* FORMULARIO REGISTRO */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">

            {/* Nombre completo */}
            <input
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="Nombre completo"
              onChange={(e) =>
                setForm((f) => ({ ...f, fullName: e.target.value }))
              }
              required
            />
          
            {/* Email */}
            <input
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="Email"
              type="email"
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
          
            {/* Teléfono */}
            <input
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="Teléfono"
              type="tel"
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
            />
          
            {/* Contraseña */}
            <input
              type="password"
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="Contraseña"
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              required
            />
          
            {errorMsg && (
              <p className="text-red-500 text-sm">{errorMsg}</p>
            )}
          
            <button className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition">
              Registrarse
            </button>
          </form>
          
          )}

          {/* CAMBIO DE MODO */}
          <p className="text-sm text-center mt-2 text-gray-600">
            {mode === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <button
                  onClick={openRegister}
                  className="text-blue-600 font-semibold underline"
                >
                  Crear una nueva
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button
                  onClick={openLogin}
                  className="text-blue-600 font-semibold underline"
                >
                  Iniciar sesión
                </button>
              </>
            )}
          </p>

        </div>
      </div>
    </div>
  );
}
