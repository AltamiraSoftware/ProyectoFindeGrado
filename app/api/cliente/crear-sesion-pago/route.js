
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Body inválido" },
        { status: 400 }
      );
    }

    const { id_cliente, id_servicio, id_franja } = body;

    if (!id_cliente || !id_servicio || !id_franja) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    // 1. Obtener servicio
    const { data: servicio, error: servError } = await supabaseAdmin
      .from("servicios")
      .select("id, nombre, precio")
      .eq("id", id_servicio)
      .single();

    if (servError || !servicio) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

    // 2. Obtener franja
    const { data: franja, error: frError } = await supabaseAdmin
      .from("franjas_disponibilidad")
      .select("id, hora_inicio, hora_fin, id_profesional, esta_disponible")
      .eq("id", id_franja)
      .single();

    if (frError || !franja) {
      return NextResponse.json(
        { error: "Franja no encontrada" },
        { status: 404 }
      );
    }

    if (!franja.esta_disponible) {
      return NextResponse.json(
        { error: "La franja ya no está disponible" },
        { status: 409 }
      );
    }

    // 3. Crear sesión Stripe
    const successUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/cliente?success=true&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/cliente?canceled=true`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(servicio.precio * 100),
            product_data: {
              name: servicio.nombre,
            },
          },
          quantity: 1,
        },
      ],

      success_url: successUrl,
      cancel_url: cancelUrl,

      /* -------------- 👇 CORREGIDO 👇 ---------------- */
      metadata: {
        id_cliente,
        id_profesional: franja.id_profesional,
        id_servicio,
        id_franja_disponibilidad: id_franja,   // ← Nombre exacto de tu BD
        precio_acordado: servicio.precio
      }
    });

    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error("❌ Error creando sesión Stripe:", err);
    return NextResponse.json(
      { error: err.message ?? "Error desconocido" },
      { status: 500 }
    );
  }
}
