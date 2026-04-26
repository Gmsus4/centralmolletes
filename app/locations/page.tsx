
import { Locations } from "@/components/locations/Locations";
import { FooterServer } from "@/components/shared/FooterServer";
import { NavbarServer } from "@/components/shared/NavbarServer";
import { TitlePage } from "@/components/ui/TitlePage";
import { Titles } from "@/data/titles";
import prisma from "@/lib/prisma";
import { Metadata } from "next";

import dynamic from "next/dynamic"
const MarqueeStrip = dynamic(() => import("@/components/ui/MarqueeStrip").then(m => ({ default: m.MarqueeStrip })))
const Footer = dynamic(() => import("@/components/shared/Footer").then(m => ({ default: m.Footer })))

export const metadata: Metadata = {
  title: "Ubicación",
  description: "Visítanos en Ocampo 63, Centro, Etzatlán, Jalisco.",
  openGraph: {
    title: "Ubicación — Central Molletes",
    description: "Visítanos en Ocampo 63, Centro, Etzatlán, Jalisco.",
    url: "/locations",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
}

export const revalidate = 3600

export default async function LocationsPage() {
    const location = await prisma.location.findMany({
        orderBy: [{ createdAt: "desc"}]
    })
    return (
        <>
            <NavbarServer />
            <main>
                <TitlePage section="locations" isMarquee={false}/>
                <div className="bg-background px-6">
                    <Locations className="lg:py-20 py-4" locations={location}/>
                </div>
                <MarqueeStrip />
            </main>
            <FooterServer />
        </>
    )
}