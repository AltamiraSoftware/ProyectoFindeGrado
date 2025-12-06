import { createClient } from '@supabase/supabase-js';

export default async function CitasCliente() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: citas } = await supabase
    .from("citas_sesiones")
    .select("id, hora_inicio, hora_fin, estado_cita, servicios(nombre)")
    .eq("id_cliente", user.id)
    .order("hora_inicio", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Mis citas</h1>

      <table className="w-full bg-white rounded-xl shadow-md">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left">Fecha</th>
            <th className="p-4 text-left">Servicio</th>
            <th className="p-4 text-left">Estado</th>
          </tr>
        </thead>

        <tbody>
          {citas?.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="p-4">
                {new Date(c.hora_inicio).toLocaleString()}
              </td>
              <td className="p-4">{c.servicios?.nombre}</td>
              <td className="p-4">{c.estado_cita}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

