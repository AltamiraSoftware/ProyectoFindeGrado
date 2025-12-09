"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { addDays, startOfWeek, addWeeks, format } from "date-fns";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/hooks/useUser";
import {
  CheckCircleIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";

/* ============================================================
   1. FETCH — leer disponibilidad desde Supabase
   ============================================================ */
async function fetchFranjasDB(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("franjas_disponibilidad")
    .select("id, hora_inicio, hora_fin, esta_disponible, tiene_cita")
    .eq("id_profesional", userId)
    .order("hora_inicio");

  if (error) {
    console.error("Error cargando franjas:", error);
    return [];
  }

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

  // Bloques marcados por el usuario en la UI (sin guardar aún)
  const [bloquesUsuario, setBloquesUsuario] = useState({});

  const [mesSeleccionado, setMesSeleccionado] = useState(() => {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  // Semana base: siempre lunes
  const [semanaBase, setSemanaBase] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  // Toasts de feedback
  const [feedbackGuardar, setFeedbackGuardar] = useState(false);
  const [feedbackRestablecer, setFeedbackRestablecer] = useState(false);
  const [feedbackBorrarSemana, setFeedbackBorrarSemana] = useState(false);

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const horas = Array.from({ length: 13 }, (_, i) => 8 + i); // 8:00–20:00

  /* ============================================================
     2. CARGA INICIAL + PROTECCIÓN DE RUTA
     ============================================================ */
  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (user.rol !== "profesional") {
      router.replace("/");
      return;
    }

    async function cargar() {
      setLoadingFranjas(true);
      const data = await fetchFranjasDB(user.id);
      setFranjas(data);
      setBloquesUsuario({});
      setLoadingFranjas(false);
    }

    cargar();
  }, [isLoading, user, router]);

  /* ============================================================
     3. ESTADO DERIVADO — franjas reales → cuadrícula
     ------------------------------------------------------------
     Creamos un mapa de claves:
       key = `${año}-${mes}-${día}-${dow}-${hora}`
     donde dow = 0–6 (getDay()).
     ============================================================ */
  const bloquesReales = useMemo(() => {
    const nuevos = {};

    franjas.forEach((f) => {
      const ini = new Date(f.hora_inicio);
      const fin = new Date(f.hora_fin);

      // Solo franjas dentro de la semana visible
      if (ini >= semanaBase && ini < addDays(semanaBase, 7)) {
        const dow = ini.getDay(); // 0–6
        for (let h = ini.getHours(); h < fin.getHours(); h++) {
          const key = `${ini.getFullYear()}-${ini.getMonth()}-${ini.getDate()}-${dow}-${h}`;
          nuevos[key] = true;
        }
      }
    });

    return nuevos;
  }, [franjas, semanaBase]);

  /* ============================================================
     4. BLOQUES FINALES → mezcla BD + selección del usuario
     ============================================================ */
  const bloques = useMemo(() => {
    const resultado = {};
    const keys = new Set([
      ...Object.keys(bloquesReales),
      ...Object.keys(bloquesUsuario),
    ]);

    keys.forEach((k) => {
      resultado[k] =
        bloquesUsuario[k] !== undefined ? bloquesUsuario[k] : bloquesReales[k];
    });

    return resultado;
  }, [bloquesReales, bloquesUsuario]);

  /* ============================================================
     5. TOGGLE CELDA
     ============================================================ */
  function toggleBloque(indiceDia, hora) {
    const fecha = addDays(semanaBase, indiceDia); // 0 = lunes, 6 = domingo
    const dow = fecha.getDay(); // 0–6
    const key = `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}-${dow}-${hora}`;

    setBloquesUsuario((prev) => ({
      ...prev,
      [key]: !(prev[key] ?? bloquesReales[key]),
    }));
  }

  /* ============================================================
     6. CONTROLES SEMANALES
     ============================================================ */
  function cambiarSemana(offset) {
    setSemanaBase((p) => addWeeks(p, offset));
    setBloquesUsuario({});
  }

  function irHoy() {
    setSemanaBase(startOfWeek(new Date(), { weekStartsOn: 1 }));
    setBloquesUsuario({});
  }

  /* ============================================================
     7. GUARDAR SEMANA — NO toca franjas con cita
     ============================================================ */
  async function guardarBloques() {
    if (!user) return;

    // 1) Borrar solo franjas SIN cita de esta semana
    const semanaIdsSinCita = franjas
      .filter((f) => {
        const ini = new Date(f.hora_inicio);
        return (
          ini >= semanaBase &&
          ini < addDays(semanaBase, 7) &&
          !f.tiene_cita
        );
      })
      .map((f) => f.id);

    if (semanaIdsSinCita.length) {
      const { error: delError } = await supabase
        .from("franjas_disponibilidad")
        .delete()
        .in("id", semanaIdsSinCita);

      if (delError) {
        console.error("Error borrando franjas sin cita:", delError);
      }
    }

    // 2) Insertar nuevas franjas según bloques marcados
    const nuevas = [];

    for (let i = 0; i < 7; i++) {
      const fecha = addDays(semanaBase, i);
      const dow = fecha.getDay();

      for (let h = 8; h < 20; h++) {
        const key = `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}-${dow}-${h}`;
        if (!bloques[key]) continue;

        // No crear franja donde exista una franja con cita (seguridad extra)
        const existeConCita = franjas.some((f) => {
          const ini = new Date(f.hora_inicio);
          return (
            ini.getFullYear() === fecha.getFullYear() &&
            ini.getMonth() === fecha.getMonth() &&
            ini.getDate() === fecha.getDate() &&
            ini.getHours() === h &&
            f.tiene_cita
          );
        });

        if (existeConCita) continue;

        const ini = new Date(fecha);
        ini.setHours(h, 0, 0, 0);

        const fin = new Date(fecha);
        fin.setHours(h + 1, 0, 0, 0);

        nuevas.push({
          id_profesional: user.id,
          hora_inicio: ini.toISOString(),
          hora_fin: fin.toISOString(),
          esta_disponible: true,
          tiene_cita: false,
        });
      }
    }

    if (nuevas.length) {
      const { error: insError } = await supabase
        .from("franjas_disponibilidad")
        .insert(nuevas);

      if (insError) {
        console.error("Error insertando nuevas franjas:", insError);
      }
    }

    const data = await fetchFranjasDB(user.id);
    setFranjas(data);
    setBloquesUsuario({});

    setFeedbackGuardar(true);
    setTimeout(() => setFeedbackGuardar(false), 1500);
  }

  /* ============================================================
     8. BORRAR SEMANA — NO toca franjas con cita
     ============================================================ */
  async function borrarSemanaCompleta() {
    if (!user) return;

    const semanaIdsSinCita = franjas
      .filter((f) => {
        const ini = new Date(f.hora_inicio);
        return (
          ini >= semanaBase &&
          ini < addDays(semanaBase, 7) &&
          !f.tiene_cita
        );
      })
      .map((f) => f.id);

    if (semanaIdsSinCita.length) {
      const { error: delError } = await supabase
        .from("franjas_disponibilidad")
        .delete()
        .in("id", semanaIdsSinCita);

      if (delError) {
        console.error("Error borrando semana sin cita:", delError);
      }
    }

    setBloquesUsuario({});
    const data = await fetchFranjasDB(user.id);
    setFranjas(data);

    setFeedbackBorrarSemana(true);
    setTimeout(() => setFeedbackBorrarSemana(false), 1500);
  }

  /* ============================================================
     9. RESTABLECER MES — NO toca franjas con cita
     ============================================================ */
  async function restablecerHorarioEstandar() {
    if (!user) return;

    const [anio, mes] = mesSeleccionado.split("-").map(Number);
    const ultimoDia = new Date(anio, mes, 0); // último día del mes

    // Borrar solo las franjas SIN cita del mes
    const borrarIds = franjas
      .filter((f) => {
        const ini = new Date(f.hora_inicio);
        const sameMonth =
          ini.getFullYear() === anio && ini.getMonth() === mes - 1;
        return sameMonth && !f.tiene_cita;
      })
      .map((f) => f.id);

    if (borrarIds.length) {
      const { error: delError } = await supabase
        .from("franjas_disponibilidad")
        .delete()
        .in("id", borrarIds);

      if (delError) {
        console.error("Error borrando mes sin cita:", delError);
      }
    }

    const nuevas = [];

    // Lunes–viernes, 10:00–18:00
    for (let d = 1; d <= ultimoDia.getDate(); d++) {
      const dia = new Date(anio, mes - 1, d);
      const dow = dia.getDay(); // 0–6

      if (dow >= 1 && dow <= 5) {
        for (let h = 10; h < 18; h++) {
          const existeConCita = franjas.some((f) => {
            const ini = new Date(f.hora_inicio);
            return (
              ini.getFullYear() === dia.getFullYear() &&
              ini.getMonth() === dia.getMonth() &&
              ini.getDate() === dia.getDate() &&
              ini.getHours() === h &&
              f.tiene_cita
            );
          });

          if (existeConCita) continue;

          const ini = new Date(dia);
          ini.setHours(h, 0, 0, 0);

          const fin = new Date(dia);
          fin.setHours(h + 1, 0, 0, 0);

          nuevas.push({
            id_profesional: user.id,
            hora_inicio: ini.toISOString(),
            hora_fin: fin.toISOString(),
            esta_disponible: true,
            tiene_cita: false,
          });
        }
      }
    }

    if (nuevas.length) {
      const { error: insError } = await supabase
        .from("franjas_disponibilidad")
        .insert(nuevas);

      if (insError) {
        console.error("Error insertando horario estándar:", insError);
      }
    }

    const data = await fetchFranjasDB(user.id);
    setFranjas(data);

    setFeedbackRestablecer(true);
    setTimeout(() => setFeedbackRestablecer(false), 1500);
  }

  /* ============================================================
     10. REALTIME
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  /* ============================================================
     11. UI FINAL
     ============================================================ */
  if (isLoading || !user || loadingFranjas) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <p className="text-gray-600">Cargando disponibilidad…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 flex flex-col items-center">
      {/* TOASTS */}
      {feedbackGuardar && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white border border-green-200 shadow-md px-6 py-3 rounded-xl z-50 flex items-center gap-2">
          <CheckCircleIcon className="w-6 h-6 text-green-500" />
          <span className="text-green-700 font-semibold">
            ¡Disponibilidad guardada!
          </span>
        </div>
      )}

      {feedbackRestablecer && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white border border-blue-200 shadow-md px-6 py-3 rounded-xl z-50 flex items-center gap-2">
          <CheckCircleIcon className="w-6 h-6 text-blue-500" />
          <span className="text-blue-700 font-semibold">
            ¡Horario estándar aplicado al mes!
          </span>
        </div>
      )}

      {feedbackBorrarSemana && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white border border-red-200 shadow-md px-6 py-3 rounded-xl z-50 flex items-center gap-2">
          <CheckCircleIcon className="w-6 h-6 text-red-500" />
          <span className="text-red-700 font-semibold">
            Semana borrada correctamente (solo franjas sin cita).
          </span>
        </div>
      )}

      {/* TARJETA PRINCIPAL */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
        {/* ENCABEZADO CORPORATIVO */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 p-8">
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <CalendarDaysIcon className="w-8 h-8 !text-white drop-shadow" />
            Disponibilidad semanal
          </h2>
          <p className="text-white/80 text-sm mt-1">
            Marca las horas en las que estás disponible para tus pacientes. Las
            franjas con cita aparecen en rojo y no se pueden modificar.
          </p>
        </div>

        {/* INPUT MES + BOTÓN RESTABLECER */}
        <div className="px-8 pb-4 pt-6 flex items-center justify-center flex-wrap gap-4">
          <input
            type="month"
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(e.target.value)}
            className="px-4 py-2 rounded-md shadow border border-purple-300 bg-white text-purple-700 font-semibold"
          />

          <button
            onClick={restablecerHorarioEstandar}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:opacity-90 transition"
          >
            Restablecer mes estándar
          </button>
        </div>

        {/* NAVEGACIÓN DE SEMANA */}
        <div className="px-8 py-4 flex items-center justify-center gap-4">
          <button
            onClick={() => cambiarSemana(-1)}
            className="px-4 py-2 rounded-lg bg-white border shadow text-purple-600 hover:bg-purple-50 transition"
          >
            ← Semana anterior
          </button>

          <button
            onClick={irHoy}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white shadow hover:bg-purple-700 transition"
          >
            Hoy
          </button>

          <button
            onClick={() => cambiarSemana(1)}
            className="px-4 py-2 rounded-lg bg-white border shadow text-purple-600 hover:bg-purple-50 transition"
          >
            Semana siguiente →
          </button>
        </div>

        {/* RANGO DE FECHAS */}
        <p className="text-center text-gray-600 font-semibold mb-2">
          {format(semanaBase, "d MMM yyyy")} –{" "}
          {format(addDays(semanaBase, 6), "d MMM yyyy")}
        </p>

        {/* LEYENDA */}
        <div className="flex items-center justify-center gap-6 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-gray-200" />
            <span>No disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-red-300" />
            <span>Franja con cita (no modificable)</span>
          </div>
        </div>

        {/* TABLA */}
        <div className="px-8 pb-8 flex flex-col items-center">
          <div className="overflow-x-auto">
            <table className="border-separate border-spacing-1 mx-auto">
              <thead>
                <tr>
                  <th />
                  {diasSemana.map((label, index) => (
                    <th
                      key={index}
                      className="text-center text-purple-700 font-semibold w-16 py-2"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {horas.map((h) => (
                  <tr key={h}>
                    <td className="text-right pr-3 text-purple-600 font-semibold">
                      {h}:00
                    </td>

                    {diasSemana.map((_, indexDia) => {
                      const fecha = addDays(semanaBase, indexDia);
                      const dow = fecha.getDay();
                      const key = `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}-${dow}-${h}`;

                      const franja = franjas.find((f) => {
                        const ini = new Date(f.hora_inicio);
                        return (
                          ini.getFullYear() === fecha.getFullYear() &&
                          ini.getMonth() === fecha.getMonth() &&
                          ini.getDate() === fecha.getDate() &&
                          ini.getHours() === h
                        );
                      });

                      const activo = !!bloques[key];
                      const tieneCita = franja?.tiene_cita === true;

                      return (
                        <td
                          key={key}
                          onClick={() =>
                            !tieneCita && toggleBloque(indexDia, h)
                          }
                          className={`w-16 h-10 rounded-lg cursor-pointer transition
                            ${
                              tieneCita
                                ? "bg-red-300 text-white cursor-not-allowed opacity-80"
                                : activo
                                ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-md"
                                : "bg-gray-100 hover:bg-gray-200"
                            }
                          `}
                          title={
                            tieneCita
                              ? "Franja con cita — no se puede modificar"
                              : ""
                          }
                        />
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BOTONES */}
          <div className="mt-8 flex justify-center gap-6">
            <button
              onClick={borrarSemanaCompleta}
              className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
            >
              Borrar semana (sin citas)
            </button>

            <button
              onClick={guardarBloques}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
            >
              Guardar disponibilidad
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
