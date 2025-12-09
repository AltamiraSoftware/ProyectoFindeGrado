"use client";

const icons = {
  calendar: (
    <svg
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
    </svg>
  ),

  bell: (
    <svg
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 21a4 4 0 01-8 0" />
      <path d="M4 16h20l-2-5c-1-3-1-4-1-6a7 7 0 10-14 0c0 2 0 3-1 6l-2 5z" />
    </svg>
  ),

  shield: (
    <svg
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l9 4v6c0 5-3 10-9 12C6 23 3 18 3 13V7l9-4z" />
    </svg>
  ),

  clock: (
    <svg
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),

  chart: (
    <svg
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 18h18" />
      <path d="M7 18V10" />
      <path d="M12 18V6" />
      <path d="M17 18v-7" />
    </svg>
  ),

  chat: (
    <svg
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 15a6 6 0 00-6-6H8a6 6 0 000 12h1v4l4-4h1a6 6 0 006-6z" />
    </svg>
  ),
};

const features = [
  {
    icon: icons.calendar,
    title: "Reserva tu cita en segundos",
    description:
      "Sistema intuitivo de reservas con disponibilidad en tiempo real del profesional",
  },
  {
    icon: icons.bell,
    title: "Recordatorios automáticos",
    description:
      "Notificaciones por email y SMS para que nunca olvides tu cita.",
  },
  {
    icon: icons.shield,
    title: "Privacidad garantizada",
    description:
      "Tus datos protegidos con encriptación de nivel empresarial.",
  },
  {
    icon: icons.clock,
    title: "Disponibilidad 24/7",
    description:
      "Agrega o modifica tus citas en cualquier momento del día.",
  },
  {
    icon: icons.chart,
    title: "Gestión eficiente",
    description:
      "Panel de control completo para organizar tu horario, Automaticaciones de emails",
  },
  {
    icon: icons.chat,
    title: "Comunicación directa",
    description:
      "Contacta directamente con el profesional para consultas.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-24 md:py-32 min-h-screen;
                 bg-gradient-to-br from-[#f3e8ff] via-[#e7d6ff] to-[#ffe4f3]"
    >
      <div className="container mx-auto max-w-7xl px-4">

        {/* TITLE */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold !text-gray-900">
            Características diseñadas para ti
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Todo lo que necesitas para una experiencia fluida y confortable.
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, i) => (
            <div
              key={i}
              className="
                relative p-8 rounded-2xl backdrop-blur-lg
                bg-white/70 shadow-lg overflow-hidden
                transition-all duration-300 cursor-pointer
                hover:-translate-y-2 hover:shadow-2xl
              "
              style={{
                border: "2px solid transparent",
                backgroundImage:
                  "linear-gradient(white, white), linear-gradient(90deg,#2563eb,#7c3aed,#ec4899)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}
            >

              {/* OVERLAY INTERIOR (siempre visible, más fuerte al hover) */}
              <div
  className="
    absolute inset-0 rounded-2xl 
    bg-blue-300/30
    mix-blend-multiply
    transition-all duration-300
    hover:bg-blue-400/50
  "
></div>


              {/* CONTENT */}
              <div className="relative z-10">
                {/* ICON */}
                <div
                  className="
                    w-16 h-16 flex items-center justify-center mx-auto mb-6
                    rounded-xl shadow-lg
                    bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500
                    text-white
                  "
                >
                  {feature.icon}
                </div>

                <h3 className="text-xl font-semibold !text-gray-900 text-center mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-700 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
