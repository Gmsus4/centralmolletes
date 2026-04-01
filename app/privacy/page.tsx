import { Privacy } from "@/components/legal/Privacy";
import { FooterServer } from "@/components/shared/FooterServer";
import { NavbarServer } from "@/components/shared/NavbarServer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso de Privacidad",
  description: "Conoce cómo recopilamos, usamos y protegemos tus datos personales conforme a la LFPDPPP.",
  openGraph: {
    title: "Aviso de Privacidad — Central Molletes",
    description: "Conoce cómo recopilamos, usamos y protegemos tus datos personales conforme a la LFPDPPP.",
    url: "/privacidad",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
}

export default function Terms() {
    return (
        <>
            <NavbarServer />
            <Privacy />
            <FooterServer />
        </>
    )
}