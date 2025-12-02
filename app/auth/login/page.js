"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("Email o contraseña incorrectos");
      return;
    }

    const { data: perfil } = await supabase
      .from("perfiles_usuarios")
      .select("rol")
      .eq("id", data.user.id)
      .single();

    if (perfil?.rol === "cliente") router.push("/cliente");
    else router.push("/dashboard");
  }

  return (
    <div className="flex justify-center p-10">
      <form className="p-6 shadow w-full max-w-sm rounded space-y-4" onSubmit={handleLogin}>
        <h1 className="text-2xl font-bold">Iniciar Sesión</h1>

        <input
          className="border w-full p-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border w-full p-2"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

        <button className="bg-blue-600 text-white p-2 w-full rounded">
          Entrar
        </button>
      </form>
    </div>
  );
}
