"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  if (isLoading) return <p>Cargando...</p>;

  if (!user) {
    router.replace("/auth/login");
    return null;
  }

  if (user.rol !== "profesional") {
    router.replace("/");
    return null;
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl">Panel Profesional</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
