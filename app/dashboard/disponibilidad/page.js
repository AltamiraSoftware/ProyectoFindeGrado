"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { addDays, startOfWeek, addWeeks, format } from "date-fns";

import {
  CheckCircleIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";

/* ============================================================
   1. FETCH DESDE SUPABASE — función externa (segura)
   ============================================================ */
async function fetchFranjasDB(userId) {
  if (!userId) return [];

  const { data } = await supabase
    .from("franjas_disponibilidad")
    .select("id, hora_inicio, hora_fin, esta_disponible")
    .eq("id_profesional", userId)
    .order("hora_inicio", { ascending: true });

  return data || [];
}

/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */
export default function DisponibilidadPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const [franjas, setFranjas] = useState([]);
  const [loadingFranjas, setLoadingFranjas] = useState(true);

  const [bloquesUsuario, setBloquesUsuario] = useState({});
  const [mesSeleccionado, setMesSeleccionado] = useState(() => {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`;
  });

  const [semanaBase, setSemanaBase] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const [feedback, setFeedback] = useState(false);
  const [feedbackRestablecer, setFeedbackRestablecer] = useState(false);
  const [feedbackBorrarSemana, setFeedbackBorrarSemana] = useState(false);

  const diasSemanaFull = [
    { label: "Lunes", value: 1 },
    { label: "Martes", value: 2 },
    { label: "Miércoles", value: 3 },
    { label: "Jueves", value: 4 },
    { label: "Viernes", value: 5 },
    { label: "Sábado", value: 6 },
    { label: "Domingo", value: 0 },
  ];

  const horas = Array.from({ length: 13 }, (_, i) => 8 + i);

  /* ============================================================
     2. CARGA INICIAL + PROTECCIÓN DE RUTA
     ============================================================ */
  useEffect(() => {
    if (isLoading || !user) return;

    if (user.rol !== "profesional") {
      router.replace("/");
      return;
    }

    async function cargarFranjas() {
      setLoadingFranjas(true);

      const data = await fetchFranjasDB(user.id);

      setFranjas(data);
      setLoadingFranjas(false);
      setBloquesUsuario({});
    }

    cargarFranjas();
  }, [isLoading, user, router]);

  /* ============================================================
     3. ESTADO DERIVADO — franjas reales → cuadrícula
     ============================================================ */
  const bloquesReales = useMemo(() => {
    const nuevos = {};

    franjas.forEach((f) => {
      const ini = new Date(f.hora_inicio);
      const fin = new Date(f.hora_fin);

      if (ini >= semanaBase && ini < addDays(semanaBase, 7)) {
        for (let h = ini.getHours(); h < fin.getHours(); h++) {
          const key = `${ini.getFullYear()}-${ini.getMonth()}-${ini.getDate()}-${ini.getDay()}-${h}`;
          nuevos[key] = true;
        }
      }
    });

    return nuevos;
  }, [franjas, semanaBase]);

  /* ============================================================
     4. BLOQUES → mezcla BD + selección usuario
     ============================================================ */
  const bloques = useMemo(() => {
    const resultado = {};
    const keys = new Set([...Object.keys(bloquesReales), ...Object.keys(bloquesUsuario)]);

    keys.forEach((k) => {
      resultado[k] =
        bloquesUsuario[k] !== undefined ? bloquesUsuario[k] : bloquesReales[k];
    });

    return resultado;
  }, [bloquesReales, bloquesUsuario]);

  /* ============================================================
     5. TOGGLE CELDAS
     ============================================================ */
  function toggleBloque(dia, hora) {
    const fecha = addDays(semanaBase, (dia - 1 + 7) % 7);
    const key = `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}-${dia}-${hora}`;

    setBloquesUsuario((prev) => ({
      ...prev,
      [key]: !(prev[key] ?? bloquesReales[key]),
    }));
  }

  /* ============================================================
     6. CONTROLES DE SEMANA
     ============================================================ */
  function cambiarSemana(offset) {
    setSemanaBase((prev) => addWeeks(prev, offset));
    setBloquesUsuario({});
  }

  function irHoy() {
    setSemanaBase(startOfWeek(new Date(), { weekStartsOn: 1 }));
    setBloquesUsuario({});
  }

  /* ============================================================
     7. GUARDAR SEMANA
     ============================================================ */
  async function guardarBloques() {
    if (!user) return;

    const semanaIds = franjas
      .filter((f) => {
        const ini = new Date(f.hora_inicio);
        return ini >= semanaBase && ini < addDays(semanaBase, 7);
      })
      .map((f) => f.id);

    if (semanaIds.length) {
      await supabase.from("franjas_disponibilidad").delete().in("id", semanaIds);
    }

    const nuevas = [];

    for (let d = 0; d < 7; d++) {
      for (let h = 8; h < 20; h++) {
        const fecha = addDays(semanaBase, d);
        const key = `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}-${(d + 1) % 7}-${h}`;

        if (bloques[key]) {
          const inicio = new Date(fecha);
          inicio.setHours(h, 0, 0, 0);

          const fin = new Date(fecha);
          fin.setHours(h + 1, 0, 0, 0);

          nuevas.push({
            id_profesional: user.id,
            hora_inicio: inicio.toISOString(),
            hora_fin: fin.toISOString(),
            esta_disponible: true,
          });
        }
      }
    }

    if (nuevas.length) {
      await supabase.from("franjas_disponibilidad").insert(nuevas);
    }

    const data = await fetchFranjasDB(user.id);
    setFranjas(data);
    setBloquesUsuario({});

    setFeedback(true);
    setTimeout(() => setFeedback(false), 1500);
  }

  /* ============================================================
     8. BORRAR SEMANA COMPLETA
     ============================================================ */
  async function borrarSemanaCompleta() {
    if (!user) return;

    const semanaIds = franjas
      .filter((f) => {
        const ini = new Date(f.hora_inicio);
        return ini >= semanaBase && ini < addDays(semanaBase, 7);
      })
      .map((f) => f.id);

    if (semanaIds.length) {
      await supabase.from("franjas_disponibilidad").delete().in("id", semanaIds);
    }

    setBloquesUsuario({});
    setFeedbackBorrarSemana(true);
    setTimeout(() => setFeedbackBorrarSemana(false), 1500);

    const data = await fetchFranjasDB(user.id);
    setFranjas(data);
  }

  /* ============================================================
     9. RESTABLECER MES
     ============================================================ */
  async function restablecerHorarioEstandar() {
    if (!user) return;

    const [anio, mes] = mesSeleccionado.split("-").map(Number);
    const ultimoDia = new Date(anio, mes, 0);

    const borrarIds = franjas
      .filter((f) => {
        const ini = new Date(f.hora_inicio);
        return ini.getFullYear() === anio && ini.getMonth() === mes - 1;
      })
      .map((f) => f.id);

    if (borrarIds.length) {
      await supabase.from("franjas_disponibilidad").delete().in("id", borrarIds);
    }

    const nuevas = [];

    for (let d = 1; d <= ultimoDia.getDate(); d++) {
      const dia = new Date(anio, mes - 1, d);
      const dow = dia.getDay();

      if (dow >= 1 && dow <= 5) {
        for (let h = 10; h < 18; h++) {
          const inicio = new Date(dia);
          inicio.setHours(h, 0, 0, 0);

          const fin = new Date(dia);
          fin.setHours(h + 1, 0, 0, 0);

          nuevas.push({
            id_profesional: user.id,
            hora_inicio: inicio.toISOString(),
            hora_fin: fin.toISOString(),
            esta_disponible: true,
          });
        }
      }
    }

    if (nuevas.length) {
      await supabase.from("franjas_disponibilidad").insert(nuevas);
    }

    let primerLunes = new Date(anio, mes - 1, 1);
    while (primerLunes.getDay() !== 1)
      primerLunes.setDate(primerLunes.getDate() + 1);

    setSemanaBase(startOfWeek(primerLunes, { weekStartsOn: 1 }));

    const data = await fetchFranjasDB(user.id);
    setFranjas(data);

    setFeedbackRestablecer(true);
    setTimeout(() => setFeedbackRestablecer(false), 1500);
  }

  /* ============================================================
     10. REALTIME SUPABASE
     ============================================================ */
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("franjas_disponibilidad_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "franjas_disponibilidad" },
        async () => {
          const data = await fetchFranjasDB(user.id);
          setFranjas(data);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  /* ============================================================
     11. UI FINAL — DISEÑO DEFINITIVO
     ============================================================ */

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 via-violet-500 to-pink-400 p-6 flex flex-col items-center">

      {/* NOTIFICACIONES */}
      {feedback && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white border border-green-200 shadow-md px-6 py-3 rounded-xl z-50">
          <CheckCircleIcon className="inline-block w-6 h-6 text-green-500 mr-2" />
          <span className="text-green-700 font-semibold">¡Disponibilidad guardada!</span>
        </div>
      )}

      {feedbackRestablecer && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-white border border-blue-200 shadow-md px-6 py-3 rounded-xl z-50">
          <CheckCircleIcon className="inline-block w-6 h-6 text-blue-500 mr-2" />
          <span className="text-blue-700 font-semibold">¡Horario estándar aplicado!</span>
        </div>
      )}

      {feedbackBorrarSemana && (
        <div className="fixed top-32 left-1/2 -translate-x-1/2 bg-white border border-red-200 shadow-md px-6 py-3 rounded-xl z-50">
          <CheckCircleIcon className="inline-block w-6 h-6 text-red-500 mr-2" />
          <span className="text-red-700 font-semibold">Semana borrada correctamente</span>
        </div>
      )}

      {/* HEADER PRINCIPAL */}
      <div className="rounded-2xl shadow-lg mb-8 p-6 flex flex-col items-center bg-white">
        
      <h1 className="text-3xl font-extrabold bg-gradient-to-br from-blue-500 via-violet-500 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">

      <CalendarDaysIcon className="w-8 h-8 text-blue-500" />
          Gestión de Disponibilidad
        </h1>
      </div>

      {/* Selector de mes + Restablecer */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex flex-col items-center">
        
          <input
            type="month"
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(e.target.value)}
            className="px-4 py-2 rounded-md shadow border border-pink-300 bg-white text-pink-600 font-semibold"
          />
        </div>

        <button
          onClick={restablecerHorarioEstandar}
          className="px-4 py-2  rounded-md shadow border border-pink-300 bg-white text-pink-600 font-semibold"
        >
          Restablecer mes por defecto
          
        </button>
      </div>

      {/* Disponibilidad semanal */}
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-5xl w-full flex flex-col items-center">
        <h2 className="text-lg font-bold text-pink-600 mb-4 text-center">
          Disponibilidad semanal
        </h2>

        {/* Controles debajo del título */}
        <div className="flex items-center justify-center gap-4 mb-6">

          <button
            onClick={() => cambiarSemana(-1)}
            className="bg-white px-3 py-1 rounded shadow text-pink-600 font-semibold border border-pink-300 hover:bg-pink-50"
          >
            ←
          </button>

         
          <button
            onClick={irHoy}
            className="bg-white px-3 py-1 rounded shadow text-pink-600 font-semibold border border-pink-300 hover:bg-pink-50"
          >
            Hoy
          </button>

          <button
            onClick={() => cambiarSemana(1)}
            className="bg-white px-3 py-1 rounded shadow text-pink-600 font-semibold border border-pink-300 hover:bg-pink-50"
          >
            →
          </button>
          <span className="text-pink-600 font-semibold">
            {format(semanaBase, "d MMM yyyy")} – {format(addDays(semanaBase, 6), "d MMM yyyy")}
          </span>
        </div>
<div>


</div>
        {/* Matriz de disponibilidad */}
        <table className="min-w-max border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="p-2"></th>
              {diasSemanaFull.map((d) => (
                <th key={d.value} className="p-2 text-center text-pink-700 font-semibold">
                  {d.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horas.map((h) => (
              <tr key={h}>
                <td className="text-right pr-2 text-pink-500 font-semibold">{h}:00</td>

                {diasSemanaFull.map((d) => {
                  const fecha = addDays(semanaBase, (d.value - 1 + 7) % 7);
                  const key = `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}-${d.value}-${h}`;
                  const activo = !!bloques[key];

                  return (
                    <td
                      key={key}
                      onClick={() => toggleBloque(d.value, h)}
                      className={`w-14 h-10 border rounded cursor-pointer transition ${
                        activo
                          ? "bg-gradient-to-br from-blue-400 via-violet-400 to-pink-400 text-white shadow-inner scale-105"
                          : "bg-gray-50 hover:bg-pink-100"
                      }`}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botones finales */}
        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={guardarBloques}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow font-semibold"
          >
            Guardar disponibilidad
          </button>

          <button
            onClick={borrarSemanaCompleta}
            className="bg-pink-600 text-white px-5 py-2 rounded-lg shadow font-semibold border border-pink-700 hover:bg-pink-700"
          >
            Borrar semana
          </button>
        </div>
      </div>
    </main>
  );
}
