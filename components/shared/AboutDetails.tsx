import { images } from "@/data/images"
import { IconCoffee, IconHeartHandshake, IconMapPin, IconFlame } from "@tabler/icons-react"
import Image from "next/image"

type Feature = {
  icon: React.ComponentType<{ className?: string }>
  label: string
  border?: string
}

const features: Feature[] = [
  {
    icon: IconCoffee,
    label: "Café de especialidad",
    border: "xs:border-r xs:border-b",
  },
  {
    icon: IconFlame,
    label: "Hecho al momento",
    border: "xs:border-b",
  },
  {
    icon: IconMapPin,
    label: "Orgullo etzatlense",
    border: "xs:border-r",
  },
  {
    icon: IconHeartHandshake,
    label: "Atención con cariño",
  },
]

export const AboutDetails = () => {
  return (
    <div className="bg-bg-body xs:min-h-[calc(100dvh-4rem)] md:py-26 py-16 flex flex-col items-center justify-center md:gap-16 gap-12 px-6">
      <div className="relative max-w-7xl">
        <div className="min-h-[600px] grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="grid gap-4">
            <div className="grid lg:gap-0 gap-4">
              <h2 className="text-text-titles font-title text-3xl md:text-6xl leading-tight">Nuestra Forma <br /> de Trabajar</h2>
              <p className="text-base text-text-main/70 leading-relaxed">
                Desde 2020 despertando Etzatlán con molletes, buen café y mucho cariño. Cada platillo sale de la cocina con el mismo entusiasmo del primer día.
              </p>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 place-items-center pt-4 gap-0 self-start">
              {features.map(({ icon: Icon, label, border }) => (
                <div
                  key={label}
                  className={`w-full xs:justify-center flex items-center xs:flex-col gap-2 col-span-1 xs:py-6 py-2 xs:border-black/10 ${border ?? ""}`}
                >
                  <div className="bg-brand-primary rounded-radius w-12 h-12 grid place-items-center">
                    <Icon className="text-text-titles" />
                  </div>
                  <p className="text-base text-text-main text-center">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid xs:grid-cols-2 grid-cols-1 gap-6">
            <div className="rounded-radius overflow-hidden h-full">
              <Image priority loading="eager" quality={100} width={800} height={1000} sizes="(max-width: 768px) 100vw, 50vw" src={images.aboutDetails[0].src} alt="Interior de Central Molletes" className="h-full object-cover" />
            </div>
            <div className="grid grid-rows-2 gap-6 h-full">
              <div className="rounded-radius overflow-hidden">
                <Image loading="lazy" width={800} height={1000} sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw" src={images.aboutDetails[1].src} alt="Platillos de Central Molletes" className="h-full object-cover" />
              </div>
              <div className="rounded-radius overflow-hidden">
                <Image loading="lazy" width={800} height={1000} sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw" src={images.aboutDetails[2].src} alt="Café de especialidad" className="h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}