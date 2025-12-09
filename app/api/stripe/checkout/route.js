import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { userId, serviceId, franjaId } = await req.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // 1. Obtener servicio de Supabase
  const { data: servicio, error: servErr } = await supabase
    .from("servicios")
    .select("id, nombre, precio")
    .eq("id", serviceId)
    .single();

  if (servErr)
    return NextResponse.json({ error: servErr.message }, { status: 500 });

  // 2. Crear sesión de Stripe con METADATA
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: servicio.nombre,
          },
          unit_amount: servicio.precio * 100,
        },
        quantity: 1,
      },
    ],

    // ---------------------------
    // 🔥 METADATA IMPORTANTE 🔥
    // ---------------------------
    metadata: {
      userId: userId.toString(),
      franjaId: franjaId.toString(),
      serviceId: serviceId.toString(),
    },

    success_url: `${process.env.NEXT_PUBLIC_WEB_URL}/cliente?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_WEB_URL}/cliente`,
  });

  return NextResponse.json({ url: session.url });
}
