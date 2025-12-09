'use client'
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AuthModalProvider } from "@/hooks/useAuthModal";
import AuthModal from "@/components/Modal/AuthModal";
const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
import Header from "@/components/layout/header";



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
