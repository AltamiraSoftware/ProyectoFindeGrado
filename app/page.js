"use client";
import Header from "@/components/layout/header"
import Hero from "@/components/layout/hero"
import Features from "@/components/layout/features"

import CTA from "@/components/layout/cta"
import Footer from "@/components/layout/footer"
import AuthModal from "@/components/Modal/AuthModal"

import { useAuthModal } from "@/hooks/useAuthModal";

export default function Home() {
  const { openLogin, openRegister } = useAuthModal(); // 👉 IMPORTANTE

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