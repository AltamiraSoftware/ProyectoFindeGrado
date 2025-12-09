import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AuthModalProvider } from "@/hooks/useAuthModal";
import AuthModal from "@/components/Modal/AuthModal";
const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
import Header from "@/components/layout/header";

export const metadata = {
  title: "Software de gestión",
  description: "Gestiona tus citas de psicología de manera eficiente con disponibilidad en tiempo real",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({ children }) {
  return (
    <html>
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
