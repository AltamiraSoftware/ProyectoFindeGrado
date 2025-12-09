// app/api/webhooks/stripe/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { resend } from "@/lib/resendClient";

export const runtime = "nodejs";     // 🔥 NECESARIO PARA WEBHOOKS
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Convierte ReadableStream (App Router) en Buffer
async function getRawBody(req) {
  const reader = req.body.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export async function POST(req) {
  let event;
  let rawBody;

  try {
    rawBody = await getRawBody(req);
  } catch (err) {
    console.error("❌ No se pudo leer el body del webhook:", err);
    return new NextResponse("Bad Request", { status: 400 });
  }

  const signature = req.headers.get("stripe-signature");

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⛔ Firma inválida:", err.message);
    return new NextResponse("Signature error", { status: 400 });
  }

  // Solo nos interesa cuando el pago se ha completado
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object;

 // 1. Metadata (coherente con crear-sesion-pago)
 const {
  id_cliente,
  id_profesional,
  id_servicio,
  id_franja_disponibilidad
} = session.metadata || {};


if (!id_cliente || !id_profesional || !id_servicio || !id_franja_disponibilidad) {
  
  return NextResponse.json({ error: "Metadata incompleta" }, { status: 400 });
}


  const supabase = supabaseAdmin;

  // 2. Obtener franja (y su profesional)
  const { data: franja, error: frError } = await supabase
    .from("franjas_disponibilidad")
    .select("*")
    .eq("id", id_franja_disponibilidad)

    .single();

  if (frError || !franja) {
    console.error("❌ Franja no encontrada:", frError);
    return NextResponse.json({ error: "Franja no encontrada" }, { status: 400 });
  }

  

  // 3. Obtener servicio
  const { data: servicio, error: servError } = await supabase
    .from("servicios")
    .select("*")
    .eq("id", id_servicio)
    .single();

  if (servError || !servicio) {
    console.error("❌ Servicio no encontrado:", servError);
    return NextResponse.json({ error: "Servicio no encontrado" }, { status: 400 });
  }

  // 4. Crear cita
  const { data: cita, error: citaError } = await supabase
  .from("citas_sesiones")
  .insert({
    id_cliente,
    id_profesional,
    id_servicio,
    id_franja_disponibilidad,
    hora_inicio: franja.hora_inicio,
    hora_fin: franja.hora_fin,
    precio_acordado: servicio.precio,
    estado_cita: "confirmada",
    estado_pago: "pagado",
    notas_cliente: "",
  })
  .select()
  .single();

  if (citaError) {
    console.error("❌ Error creando cita:", citaError);
    return NextResponse.json({ error: "Error creando cita" }, { status: 500 });
  }

  // 5. Bloquear franja
  await supabase
    .from("franjas_disponibilidad")
    .update({ esta_disponible: false })
    .eq("id", id_franja_disponibilidad)

  // 6. Registrar pago
  await supabase.from("pagos").insert({
    id_cliente,
    id_cita_sesion: cita.id,
    cantidad: servicio.precio,
    metodo: "stripe",
    estado_pago: "pagado",
    stripe_session_id: session.id,
  });

  // 7. Emails
  const { data: cliente } = await supabase
    .from("perfiles_usuarios")
    .select("nombre_completo, email")
    .eq("id", id_cliente)
    .single();

  const { data: profesional } = await supabase
    .from("perfiles_usuarios")
    .select("nombre_completo, email")
    .eq("id", id_profesional)
    .single();

  const fecha = new Date(franja.hora_inicio).toLocaleDateString("es-ES");
  const hora = new Date(franja.hora_inicio).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (cliente?.email) {
    resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: cliente.email,
      subject: "Cita confirmada",
      html: `
        <h2>Cita Confirmada</h2>
        <p>Hola ${cliente.nombre_completo},</p>
        <p>Tu cita de <strong>${servicio.nombre}</strong> ha sido confirmada.</p>
        <p><strong>${fecha} — ${hora}</strong></p>
      `,
    });
  }

  if (profesional?.email) {
    resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: profesional.email,
      subject: "Nueva cita reservada (pago completado)",
      html: `
        <h2>Nueva cita reservada</h2>
        <p><strong>Paciente:</strong> ${cliente?.nombre_completo}</p>
        <p><strong>Servicio:</strong> ${servicio.nombre}</p>
        <p><strong>${fecha} — ${hora}</strong></p>
        <p>Estado del pago: <strong>PAGADO</strong></p>
      `,
    });
  }

  return NextResponse.json({ received: true });
}
