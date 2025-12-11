import "./globals.css"
import { AuthModalProvider } from "@/hooks/useAuthModal";
import AuthModal from "@/components/Modal/AuthModal";
import { Inter } from "next/font/google";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "PsyClinic",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={inter.className}>
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
