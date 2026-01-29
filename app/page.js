"use client";
import dynamic from "next/dynamic";
import Header from "@/components/layout/header"
import { useAuthModal } from "@/hooks/useAuthModal";

// Cargar componentes pesados de forma diferida
const Hero = dynamic(() => import("@/components/layout/hero"), {
  loading: () => <div className="min-h-screen" />,
});

const Features = dynamic(() => import("@/components/layout/features"), {
  loading: () => <div className="py-20" />,
});

const CTA = dynamic(() => import("@/components/layout/cta"), {
  loading: () => <div className="py-20" />,
});

const Footer = dynamic(() => import("@/components/layout/footer"));

export default function Home() {
  const { openLogin, openRegister } = useAuthModal();

  return (
    <main>
      <Header 
        openLogin={openLogin}
        openRegister={openRegister}
      />
      <Hero openLogin={openLogin} openRegister={openRegister} />
      <Features />
      <CTA openLogin={openLogin} openRegister={openRegister} />
      <Footer />
    </main>
  );
}