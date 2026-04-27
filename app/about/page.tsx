import { AboutDetails } from "@/components/shared/AboutDetails"
import { TitlePage } from "@/components/ui/TitlePage"
import { Metadata } from "next"

import dynamic from "next/dynamic"
import { NavbarServer } from "@/components/shared/NavbarServer"
import { AboutInfo } from "@/components/about/AboutInfo"

const StatsGrid = dynamic(() => import("@/components/about/StatsGrid").then((m) => ({ default: m.StatsGrid })))
const BenefitsPanel = dynamic(() => import("@/components/about/BenefitsPanel").then((m) => ({ default: m.BenefitsPanel })))
const OrderOnline = dynamic(() => import("@/components/shared/OrderOnline").then((m) => ({ default: m.OrderOnline })))
const MarqueeStrip = dynamic(() => import("@/components/ui/MarqueeStrip").then((m) => ({ default: m.MarqueeStrip })))
const FooterServer = dynamic(() => import("@/components/shared/FooterServer").then((m) => ({ default: m.FooterServer })))

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce la historia de Central Molletes...",
  openGraph: {
    title: "Nosotros — Central Molletes",
    description: "Cafetería en Etzatlán desde 2020.",
    url: "/about",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
}

export default function AboutUs() {
  return (
    <>
      <NavbarServer />
      <main>
        <div className="min-h-svh flex flex-col">
          <TitlePage section="about" />
          <section aria-labelledby="about-story-title" className="relative w-full overflow-hidden px-6 py-8 lg:py-20 sm:px-10 lg:px-20 flex-1 grid place-items-center">
            <AboutInfo />
          </section>
        </div>

        <section aria-label="Estadísticas" className="bg-background w-full overflow-hidden py-8 lg:py-20 px-6 sm:px-10 lg:px-20">
          <StatsGrid />
        </section>
        <BenefitsPanel />
        <AboutDetails />
        {/* <OrderOnline /> */}
        {/* <MarqueeStrip /> */}
      </main>

      <FooterServer />
    </>
  )
}
