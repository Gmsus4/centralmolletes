import { Images } from "@/components/about/Images"
import { AboutDetails } from "@/components/shared/AboutDetails"
import { TitlePage } from "@/components/ui/TitlePage"
import { Titles } from "@/data/titles"
import { Metadata } from "next"
import { Button } from "@/components/ui/Button"
import { socialMedia } from "@/data/socialMedia"

import dynamic from "next/dynamic"
import { NavbarServer } from "@/components/shared/NavbarServer"

const StatsGrid    = dynamic(() => import("@/components/about/StatsGrid").then(m => ({ default: m.StatsGrid })))
const BenefitsPanel = dynamic(() => import("@/components/about/BenefitsPanel").then(m => ({ default: m.BenefitsPanel })))
const OrderOnline  = dynamic(() => import("@/components/shared/OrderOnline").then(m => ({ default: m.OrderOnline })))
const MarqueeStrip = dynamic(() => import("@/components/ui/MarqueeStrip").then(m => ({ default: m.MarqueeStrip })))
const FooterServer       = dynamic(() => import("@/components/shared/FooterServer").then(m => ({ default: m.FooterServer })))

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
        <TitlePage title={Titles.aboutUs.title} subtitle={Titles.aboutUs.subtitle} />
        <section aria-labelledby="about-story-title" className="relative bg-bg-body w-full overflow-hidden py-20 px-6 sm:px-10 lg:px-20">
          <div className="relative max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
              <div className="flex-1 flex flex-col gap-7 lg:max-w-lg">
                <h2 className="about-title font-title text-4xl sm:text-5xl lg:text-6xl text-text-titles leading-tight">El Sabor Que Siempre Recuerdas</h2>
                <div className="about-body flex flex-col gap-4 text-text-main text-sm sm:text-base leading-relaxed">
                  <p>
                    En Central Molletes creemos que un buen desayuno lo cambia todo. Desde 2020 
                    despertamos Etzatlán con molletes recién hechos, café de especialidad y ese 
                    cariño que solo se nota cuando algo está hecho con ganas. Cada platillo sale 
                    de nuestra cocina como si fuera para nuestra propia familia.
                  </p>
                </div>
                <div className="about-cta flex flex-col xs:flex-row gap-3 pt-2">
                  <Button title="Contáctanos" url="/contact" />
                  <Button title="Visítanos en Instagram" url={socialMedia.facebook.href} isFilled={false} target="_blank" className="text-darkWarm"/>
                </div>
              </div>

              <div className="flex-1 relative flex items-center justify-center w-full min-h-[320px] sm:min-h-[420px]">
                {/* <Images /> */}
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Estadísticas" className="bg-bg-body w-full overflow-hidden py-20 px-6 sm:px-10 lg:px-20">
          <StatsGrid />
        </section>  
        <BenefitsPanel />
        <AboutDetails />
        <OrderOnline />
        <MarqueeStrip />
      </main>

      <FooterServer />
    </>
  )
}
