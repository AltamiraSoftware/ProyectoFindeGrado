"use client";

export default function CTA({ openLogin }) {
  return (
    <section
      id="contacto"
      className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 min-h-screen"
    >
      
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-500/10 to-pink-500/10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

      <div className="container mx-auto max-w-4xl px-6 relative z-10">
        <div className="text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-extrabold !text-gray-900">
            ¿Listo para digitalizar y automatizar tu empresa?
          </h2>

          <p className="text-lg !text-gray-600 max-w-2xl mx-auto">
           PsyClinic ha sido desarrollado por AltamiraSoftware. Es un proyecto dedicado a crear soluciones a SaaS (Software como Servicio).
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
            <button
             onClick={openLogin}
              className="
                px-8 py-4 text-lg font-semibold
                bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500
                text-white rounded-xl shadow-lg
                hover:opacity-90 transition
              "
            >
              Prueba este software
            </button>

           
          </div>

          {/* INFO BLOCKS */}
          <div className="grid md:grid-cols-3 gap-8 pt-12 border-t border-gray-300/60">
            
            {/* Teléfono */}
            <div className="space-y-2">
              <TelephoneIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-lg text-gray-900 text-center">
                Teléfono
              </p>
              <p className="text-gray-600 text-center">+34 667810234</p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <MailIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="font-semibold text-lg text-gray-900 text-center">
                Email
              </p>
              <p className="text-gray-600 text-center">joaquiga@ucm.es</p>
            </div>

            {/* Ubicación */}
            <div className="space-y-2">
              <LocationIcon className="w-8 h-8 text-pink-500 mx-auto mb-2" />
              <p className="font-semibold text-lg text-gray-900 text-center">
                Ubicación
              </p>
              <p className="text-gray-600 text-center">Madrid, España</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============================
   ICONOS SVG LIGEROS & MODERNOS
   ============================= */

function TelephoneIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2 5.5C3.5 11 8 15.5 13.5 17c1 .5 2-.5 3-1.5l2-2c.5-.5.5-1.5-.5-2.5l-2-1.5c-.5-.5-1.5-.5-2 .5L12 12c-2-1-4-3-5-5l1.5-2c.5-.5.5-1.5 0-2l-2-2C5-.5 4-.5 3.5 0.5l-1.5 2C1 4 2 5.5 2 5.5Z"
      />
    </svg>
  );
}

function MailIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5h18v14H3V5Zm18 0-9 7L3 5"
      />
    </svg>
  );
}

function LocationIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2a7 7 0 0 1 7 7c0 6-7 13-7 13S5 15 5 9a7 7 0 0 1 7-7Zm0 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
      />
    </svg>
  );
}
