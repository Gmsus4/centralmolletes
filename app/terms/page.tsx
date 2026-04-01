
import { TermsAndConditions } from "@/components/legal/Terms";
import { FooterServer } from "@/components/shared/FooterServer";
import { NavbarServer } from "@/components/shared/NavbarServer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Conoce los términos y condiciones del servicio de Central Molletes Cafetería.",
  openGraph: {
    title: "Términos y Condiciones — Central Molletes",
    description: "Conoce los términos y condiciones del servicio de Central Molletes Cafetería.",
    url: "/terminos",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
}

export default function Terms() {
    return (
        <>
            <NavbarServer />
            <TermsAndConditions />
            <FooterServer />
        </>
    )
}