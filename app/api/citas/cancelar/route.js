import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  try {
    const { id_cita } = await req.json();

    if (!id_cita) {
      throw new Error("Falta id_cita");
    }

    const supabase = supabaseAdmin;

    /* ==============================
       1. OBTENER CITA
    =============================== */
    const { data: cita, error: citaError } = await supabase
      .from("citas_sesiones")
      .select("id, id_franja_disponibilidad, estado_cita")
      .eq("id", id_cita)
      .single();

    if (citaError || !cita) {
      throw new Error("Cita no encontrada");
    }

    /* ==============================
       2. CANCELAR CITA
    =============================== */
    await supabase
      .from("citas_sesiones")
      .update({ estado_cita: "cancelada" })
      .eq("id", id_cita);

    /* ==============================
       3. LIBERAR FRANJA
    =============================== */
    await supabase
      .from("franjas_disponibilidad")
      .update({
        esta_disponible: true,
        tiene_cita: false,
      })
      .eq("id", cita.id_franja_disponibilidad);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ ERROR en cancelar cita:", err);
    return NextResponse.json(
      { success: false, error: err.message ?? "Error interno" },
      { status: 500 }
    );
  }
}
