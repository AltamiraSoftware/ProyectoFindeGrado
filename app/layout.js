import "./globals.css"
import { AuthModalProvider } from "@/hooks/useAuthModal";
import AuthModal from "@/components/Modal/AuthModal";
import { Inter } from "next/font/google";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap", // Mejora el rendimiento de fuentes
});

export const metadata = {
  title: "PsyManage — Gestión inteligente de clínicas de psicología",
  description: "Sistema completo de gestión para clínicas de psicología. Gestiona citas, disponibilidad, pagos y comunicación con tus pacientes desde una única plataforma segura.",
  keywords: "gestión clínica psicología, reserva citas online, software psicología, gestión pacientes",
  openGraph: {
    title: "PsyManage — Gestión inteligente de clínicas de psicología",
    description: "Sistema completo de gestión para clínicas de psicología",
    type: "website",
    url: "https://altamirasoftware.eu",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={inter.className}>
      <head>
      <meta name="description" content="Sistema completo de gestión para clínicas de psicología. Gestiona citas, disponibilidad, pagos y comunicación con tus pacientes desde una única plataforma segura." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://kfdvyxvyhjfyjcvuglfn.supabase.co" />
      </head>
      <body>
        <AuthModalProvider>
          {children}
          <AuthModal />
        </AuthModalProvider>
        <div id="video-root"></div>
      </body>
    </html>
  );
}
