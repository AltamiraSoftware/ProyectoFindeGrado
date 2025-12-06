"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutButtom from "@/components/LogoutButtom";
import { supabase } from "@/lib/supabaseClient";
import "@/app/globals.css";
import  ServiceManagerModal from"@/components/ServiceManagerModal";
import CalendarSection from "@/components/CalendarSection";
import DayAppoinments from "@/components/DayAppoinments";
import CreateAppoinmentModal from "@/components/CreateAppoinmentModal";
import AppointmentDetailsModal from "@/components/AppointmentDetailsModal";
import WeekSummary from "@/components/WeekSummary";

export default function DashboardPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [citas, setCitas] = useState([]);
  const [loadingCitas, setLoadingCitas] = useState(true);

  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [franjasDisponibles, setFranjasDisponibles] = useState([]);

  const [modalCitaAbierto, setModalCitaAbierto] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  const [showNuevoPaciente, setShowNuevoPaciente] = useState(false);
  const [formNuevoPaciente, setFormNuevoPaciente] = useState({
    nombre_completo: "",
    email: "",
    telefono: "",
  });
  const [creandoPaciente, setCreandoPaciente] = useState(false);

  const [formCita, setFormCita] = useState({
    cliente: "",
    servicio: "",
    franja: "",
    notas: "",
  });
  const [modalServicios, setModalServicios] = useState(false);

  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(false);
  const [detalleCita, setDetalleCita] = useState(null);

  // PROTECCIÓN DE RUTA
  useEffect(() => {
    if (!isLoading) {
      if (!user) router.replace("/auth/login");
      else if (user.rol !== "profesional") router.replace("/");
    }
  }, [user, isLoading, router]);

  // CARGAR CITAS DEL MES
  useEffect(() => {
    if (!user || user.rol !== "profesional") return;

    async function fetchCitas() {
      setLoadingCitas(true);

      const startOfMonth = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0,
        23,
        59,
        59
      );

      const { data, error } = await supabase
        .from("citas_sesiones")  // ⚠️ si el nombre real es "citas_sesiones", corrígelo aquí
        .select(
          "id, id_cliente, hora_inicio, hora_fin, estado_cita, notas_cliente, id_franja_disponibilidad"
        )
        .eq("id_profesional", user.id)
        .gte("hora_inicio", startOfMonth.toISOString())
        .lte("hora_inicio", endOfMonth.toISOString());

      if (!error) {
        setCitas(data || []);
      }
      setLoadingCitas(false);
    }

    fetchCitas();
  }, [user, selectedDate]);

  // CARGAR CLIENTES
  useEffect(() => {
    if (!user || user.rol !== "profesional") return;

    async function fetchClientes() {
      const { data } = await supabase
        .from("perfiles_usuarios")
        .select("id, nombre_completo")
        .eq("rol", "cliente");

      setClientes(data || []);
    }

    fetchClientes();
  }, [user]);

  // CARGAR SERVICIOS / FRANJAS (solo cuando abrimos modal)
  useEffect(() => {
    if (!modalCitaAbierto || !user) return;

    async function fetchData() {
      setLoadingModal(true);

      const { data: ser } = await supabase
        .from("servicios")
        .select("id, nombre, precio")
        .eq("esta_activo", true);

      const { data: fran } = await supabase
        .from("franjas_disponibilidad")
        .select("id, hora_inicio, hora_fin")
        .eq("id_profesional", user.id)
        .eq("esta_disponible", true);

      setServicios(ser || []);
      setFranjasDisponibles(fran || []);
      setLoadingModal(false);
    }

    fetchData();
  }, [modalCitaAbierto, user]);

  // EVENTOS PARA FULLCALENDAR
  const eventos = citas.map((c) => ({
    id: c.id,
    title:
      c.estado_cita.charAt(0).toUpperCase() + c.estado_cita.slice(1),
    start: c.hora_inicio,
    end: c.hora_fin,
    backgroundColor:
      c.estado_cita === "confirmada"
        ? "#22c55e"
        : c.estado_cita === "pendiente"
        ? "#facc15"
        : c.estado_cita === "cancelada"
        ? "#ef4444"
        : "#2563eb",
    borderColor:
      c.estado_cita === "confirmada"
        ? "#22c55e"
        : c.estado_cita === "pendiente"
        ? "#facc15"
        : c.estado_cita === "cancelada"
        ? "#ef4444"
        : "#2563eb",
    textColor: "#fff",
    extendedProps: { ...c },
  }));

  // CITAS DEL DÍA
  const citasDelDia = citas.filter((c) => {
    const d = new Date(c.hora_inicio);
    return (
      d.getFullYear() === selectedDate.getFullYear() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getDate() === selectedDate.getDate()
    );
  });

  // RESUMEN SEMANA
  function getStartOfWeek(date) {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function getEndOfWeek(date) {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay() + 6);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  const startOfWeek = getStartOfWeek(selectedDate);
  const endOfWeek = getEndOfWeek(selectedDate);

  const citasSemana = citas.filter((c) => {
    const d = new Date(c.hora_inicio);
    return d >= startOfWeek && d <= endOfWeek;
  });

  const resumenSemana = {
    total: citasSemana.length,
    confirmadas: citasSemana.filter((c) => c.estado_cita === "confirmada")
      .length,
    pendientes: citasSemana.filter((c) => c.estado_cita === "pendiente")
      .length,
    canceladas: citasSemana.filter((c) => c.estado_cita === "cancelada")
      .length,
  };

  // HANDLERS ---------------------

  async function handleCrearCita(e) {
    e.preventDefault();
    if (!user) return;

    setLoadingModal(true);

    const franja = franjasDisponibles.find(
      (f) => f.id == formCita.franja
    );
    const servicio = servicios.find(
      (s) => s.id == formCita.servicio
    );

    if (!franja || !servicio) {
      setLoadingModal(false);
      return;
    }

    await supabase.from("citas_sesiones").insert({
      id_cliente: formCita.cliente,
      id_profesional: user.id,
      id_franja_disponibilidad: franja.id,
      id_servicio: servicio.id,
      hora_inicio: franja.hora_inicio,
      hora_fin: franja.hora_fin,
      precio_acordado: servicio.precio || 0,
      estado_cita: "reservada",
      estado_pago: "pendiente",
      notas_cliente: formCita.notas,
    });

    await supabase
      .from("franjas_disponibilidad")
      .update({ esta_disponible: false })
      .eq("id", franja.id);

    setModalCitaAbierto(false);
    setFormCita({ cliente: "", servicio: "", franja: "", notas: "" });
    window.location.reload();
  }

  async function handleCancelarCita(id, idFranja) {
    await supabase
      .from("citas_sesiones")
      .update({ estado_cita: "cancelada" })
      .eq("id", id);

    if (idFranja) {
      await supabase
        .from("franjas_disponibilidad")
        .update({ esta_disponible: true })
        .eq("id", idFranja);
    }

    window.location.reload();
  }

  async function handleCrearNuevoPaciente() {
    if (!user) return;

    setCreandoPaciente(true);

    const { data: authData, error: authError } =
      await supabase.auth.signUp({
        email: formNuevoPaciente.email,
        password: "tempPassword123",
      });

    if (authError) {
      alert("Error al crear el usuario: " + authError.message);
      setCreandoPaciente(false);
      return;
    }

    if (authData.user) {
      const { error: perfilError } = await supabase
        .from("perfiles_usuarios")
        .insert({
          id: authData.user.id,
          nombre_completo: formNuevoPaciente.nombre_completo,
          email: formNuevoPaciente.email,
          telefono: formNuevoPaciente.telefono,
          rol: "cliente",
        });

      if (perfilError) {
        alert("Error al crear el perfil: " + perfilError.message);
        setCreandoPaciente(false);
        return;
      }

      const { data: nuevosClientes } = await supabase
        .from("perfiles_usuarios")
        .select("id, nombre_completo")
        .eq("rol", "cliente");

      setClientes(nuevosClientes || []);
      setFormCita((f) => ({ ...f, cliente: authData.user.id }));

      setShowNuevoPaciente(false);
      setFormNuevoPaciente({
        nombre_completo: "",
        email: "",
        telefono: "",
      });

      alert("Paciente creado exitosamente");
    }

    setCreandoPaciente(false);
  }

  function abrirDetallesCita(datos) {
    setDetalleCita(datos);
    setModalDetallesAbierto(true);
  }

  function cerrarDetallesCita() {
    setModalDetallesAbierto(false);
    setDetalleCita(null);
  }

  if (isLoading || !user) return <div className="p-8">Cargando...</div>;
  if (user.rol !== "profesional") return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-6">
      {/* CABECERA */}
      <div className="w-full max-w-6xl mx-auto mb-6 flex flex-col md:flex-row items-center justify-between">
        <div className="rounded-xl shadow-lg bg-white p-0 flex-1 flex flex-col md:flex-row items-center justify-between mb-4 border border-gray-100">
          <div className="w-full rounded-t-xl bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 p-6 flex flex-col md:flex-row items-center justify-between">
            <h1 className="text-3xl font-bold text-white drop-shadow">
              Calendario de Citas
            </h1>
            <span className="text-white text-lg font-semibold mt-2 md:mt-0">
              Gestiona tus citas de psicología de manera eficiente
            </span>
          </div>
        </div>
        <a
          href="/dashboard/disponibilidad"
          className="mt-4 md:mt-0 ml-0 md:ml-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow transition"
        >
          Gestionar Disponibilidad
        </a>
        <button
  onClick={() => setModalServicios(true)}
  className="mt-4 md:mt-0 ml-0 md:ml-3 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-semibold shadow transition"
>
  Gestionar Servicios
</button>

      </div>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full max-w-6xl mx-auto">
        <CalendarSection
          selectedDate={selectedDate}
          onChangeSelectedDate={setSelectedDate}
          eventos={eventos}
        />

        <DayAppoinments
          selectedDate={selectedDate}
          citasDelDia={citasDelDia}
          clientes={clientes}
          loadingCitas={loadingCitas}
          onOpenCreateModal={() => setModalCitaAbierto(true)}
          onCancelarCita={handleCancelarCita}
          onVerDetalles={abrirDetallesCita}
        />
      </div>

      {/* RESUMEN SEMANAL */}
      <WeekSummary resumenSemana={resumenSemana} />

      <div className="flex justify-end w-full max-w-5xl mx-auto mt-4">
        <LogoutButtom />
      </div>

      {/* MODAL CREAR CITA */}
      <CreateAppoinmentModal
        open={modalCitaAbierto}
        onClose={() => setModalCitaAbierto(false)}
        clientes={clientes}
        servicios={servicios}
        franjasDisponibles={franjasDisponibles}
        formCita={formCita}
        setFormCita={setFormCita}
        loadingModal={loadingModal}
        onSubmit={handleCrearCita}
        showNuevoPaciente={showNuevoPaciente}
        setShowNuevoPaciente={setShowNuevoPaciente}
        formNuevoPaciente={formNuevoPaciente}
        setFormNuevoPaciente={setFormNuevoPaciente}
        creandoPaciente={creandoPaciente}
        onCrearNuevoPaciente={handleCrearNuevoPaciente}
      />
      

      {/* MODAL DETALLES CITA */}
      <AppointmentDetailsModal
        open={modalDetallesAbierto}
        detalleCita={detalleCita}
        onClose={cerrarDetallesCita}
      />
        <ServiceManagerModal
  open={modalServicios}
  onClose={() => setModalServicios(false)}
/>


    </main>
  );
}
