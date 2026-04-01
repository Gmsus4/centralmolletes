import { ContactPage } from "@/components/contact/Contact";
import { FooterServer } from "@/components/shared/FooterServer";
import { NavbarServer } from "@/components/shared/NavbarServer";
import { TitlePage } from "@/components/ui/TitlePage";
import { Titles } from "@/data/titles";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contáctanos para pedidos personalizados, eventos o cualquier duda. Encuéntranos en Etzatlán, Jalisco.",
  openGraph: {
    title: "Contacto — Central Molletes",
    description: "Contáctanos para pedidos personalizados, eventos o cualquier duda.",
    url: "/contacto",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
}

export const revalidate = 3600

export default async function Contact(){
      const contact = await prisma.contactInfo.findFirst({
        include: { socialLinks: true }
      })

      const horarios = await prisma.schedule.findMany({
        where: { isActive: true },
        include: { shifts: true },
        orderBy: { dayOfWeek: "asc" },
      })
    
    return(
        <>
            <Suspense >
                <NavbarServer />
            </Suspense>
            <TitlePage title={Titles.contact.title} subtitle={Titles.contact.subtitle}/>
            <ContactPage contact={contact} horarios={horarios}/>
            <FooterServer />
        </>
    )
}