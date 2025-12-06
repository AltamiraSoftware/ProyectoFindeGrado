import { supabase } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";

export default async function DashboardCliente() {
  const supabase = createClient();

  // Usuario actual
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const idCliente = user.id;

  // Obtenemos próxima cita del cliente
  const { data: citas } = await supabase
    .from("citas_sesiones")
    .select("id, hora_inicio, hora_fin, estado_cita, servicios(nombre)")
    .eq("id_cliente", idCliente)
    .order("hora_inicio", { ascending: true });

  const proximaCita = citas?.find(
    (c) => new Date(c.hora_inicio) > new Date()
  );

  // Obtenemos pagos pendientes
  const { data: pagosPendientes } = await supabase
    .from("pagos")
    .select("id, monto, estado_pago")
    .eq("id_cliente", idCliente)
    .eq("estado_pago", "pendiente");

  return (
    <div>

      <h1 className="text-3xl font-semibold mb-6">Tu Panel</h1>

      {/* Tarjetas estadísticas */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium">Próxima cita</h3>
          <p className="mt-2 text-gray-600">
            {proximaCita
              ? new Date(proximaCita.hora_inicio).toLocaleString()
              : "No tienes citas próximas"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium">Pagos pendientes</h3>
          <p className="mt-2 text-gray-600">
            {pagosPendientes?.length || 0} pagos
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium">Citas totales</h3>
          <p className="mt-2 text-gray-600">{citas?.length || 0}</p>
        </div>

      </div>

      {/* Botón para ver citas */}
      <a
        href="/dashboard/cliente/citas"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg inline-block"
      >
        Ver mis citas →
      </a>

    </div>
  );
}
