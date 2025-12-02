"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Revisa tu correo para confirmar la cuenta.");
    router.push("/auth/login");
  }

  return (
    <div className="flex justify-center p-10">
      <form className="p-6 shadow w-full max-w-sm rounded space-y-4" onSubmit={handleRegister}>
        <h1 className="text-2xl font-bold">Crear cuenta</h1>

        <input className="border w-full p-2" placeholder="Nombre completo"
          onChange={(e) => setFullName(e.target.value)} />

        <input className="border w-full p-2" placeholder="Email"
          onChange={(e) => setEmail(e.target.value)} />

        <input type="password" className="border w-full p-2" placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)} />

        <button className="bg-green-600 text-white p-2 w-full rounded">
          Registrarse
        </button>
      </form>
    </div>
  );
}
