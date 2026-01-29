
import { NextResponse } from "next/server";
import { resend } from "@/lib/resendClient";

const FROM = process.env.EMAIL_FROM || "onboarding@resend.dev";

function templates(type, payload) {
  switch (type) {
    case "cliente_nueva_reserva":
      return {
        subject: "Confirmación de tu cita",
        html: `
          <h2>Tu cita ha sido reservada</h2>
          <p>Hola ${payload.nombreCliente},</p>
          <p>Hemos confirmado tu reserva.</p>
          <ul>
            <li><strong>Fecha:</strong> ${payload.fecha}</li>
            <li><strong>Hora:</strong> ${payload.hora}</li>
            <li><strong>Servicio:</strong> ${payload.servicio}</li>
          </ul>
        `,
      };

    case "profesional_nueva_reserva":
      return {
        subject: `Nueva cita reservada: ${payload.nombreCliente}`,
        html: `
          <h2>Nueva cita reservada</h2>
          <p>${payload.nombreProfesional},</p>
          <p>Un paciente ha reservado una nueva cita.</p>
          <ul>
            <li><strong>Cliente:</strong> ${payload.nombreCliente}</li>
            <li><strong>Fecha:</strong> ${payload.fecha}</li>
            <li><strong>Hora:</strong> ${payload.hora}</li>
            <li><strong>Servicio:</strong> ${payload.servicio}</li>
          </ul>
        `,
      };

    case "cliente_recordatorio_24h":
      return {
        subject: "Recordatorio de cita (24 horas antes)",
        html: `
          <h2>Recordatorio de cita</h2>
          <p>Hola ${payload.nombreCliente},</p>
          <p>Te recordamos que tienes una cita mañana.</p>
          <ul>
            <li><strong>Fecha:</strong> ${payload.fecha}</li>
            <li><strong>Hora:</strong> ${payload.hora}</li>
            <li><strong>Servicio:</strong> ${payload.servicio}</li>
          </ul>
        `,
      };

    default:
      throw new Error("Tipo de email no válido");
  }
}

export async function POST(req) {
  try {
    const { to, type, payload } = await req.json();

    const t = templates(type, payload);

    const data = await resend.emails.send({
      from: FROM,
      to,
      subject: t.subject,
      html: t.html,
    });

    return NextResponse.json({ success: true, data });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Email send error:", err.message);
    }
    return NextResponse.json({ success: false, error: err.message });
  }
}
