import { MarqueeStrip } from "@/components/ui/MarqueeStrip";
import { Hero } from "@/components/home/Hero";
import dynamic from "next/dynamic";
import { FindAndGetServer } from "@/components/home/FindAndGetServer";
import { NavbarServer } from "@/components/shared/NavbarServer";
import { BottomBar } from "@/components/ui/BottomBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Central Molletes — Cafetería en Etzatlán, Jalisco",
  description: "Cafetería en Etzatlán desde 2020. Molletes, café y más. Visítanos o haz tu pedido en línea.",
  openGraph: {
    title: "Central Molletes — Cafetería en Etzatlán, Jalisco",
    description: "Cafetería en Etzatlán desde 2020. Molletes, café y más. Visítanos o haz tu pedido en línea.",
    url: "/",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
}

export const revalidate = 3600 

const OnlyCategory  = dynamic(() => import("@/components/home/OnlyCategory").then(m => ({ default: m.OnlyCategory })))
const AboutDetails  = dynamic(() => import("@/components/shared/AboutDetails").then(m => ({ default: m.AboutDetails })))
const Testimonials  = dynamic(() => import("@/components/home/Testimonials").then(m => ({ default: m.Testimonials })))
const LocationsHome = dynamic(() => import("@/components/home/LocationsHome").then(m => ({ default: m.LocationsHome })))
const OrderOnline   = dynamic(() => import("@/components/shared/OrderOnline").then(m => ({ default: m.OrderOnline })))
const FooterServer        = dynamic(() => import("@/components/shared/FooterServer").then(m => ({ default: m.FooterServer })))

export default function Home() {
  return (
    <div>
        <NavbarServer />
        <main>
          <Hero />
          <MarqueeStrip />
          <FindAndGetServer />
          <OnlyCategory />
          <AboutDetails />
          <Testimonials />
          <LocationsHome />
          <OrderOnline />
          <MarqueeStrip />
        </main>
        <FooterServer />
        <BottomBar />
    </div>
  );
}
