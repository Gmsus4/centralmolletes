import { getIcon } from "@/lib/getIcon"
import { getSectionContent } from "@/lib/siteContent"
import { getSiteImages } from "@/lib/siteImages"
import { IconCoffee, IconHeartHandshake, IconMapPin, IconFlame } from "@tabler/icons-react"
import Image from "next/image"

type Feature = {
  icon: React.ComponentType<{ className?: string }>
  label: string
  border?: string
}

export const AboutDetails = async() => {
  const aboutImages = await getSiteImages("about")
  const about = await getSectionContent("about")

  const features: Feature[] = [
  {
    icon: getIcon(about["about.features.icon.1"] ?? "Users"),
    label: about["about.features.label.1"] ?? "Label 1",
    border: "xs:border-r xs:border-b",
  },
  {
    icon: getIcon(about["about.features.icon.2"]   ?? "Users"),
    label: about["about.features.label.2"] ?? "Label 2",
    border: "xs:border-b",
  },
  {
    icon: getIcon(about["about.features.icon.3"]   ?? "Users"),
    label: about["about.features.label.3"] ?? "Label 3",
    border: "xs:border-r",
  },
  {
    icon: getIcon(about["about.features.icon.4"]   ?? "Users"),
    label: about["about.features.label.4"] ?? "Label 4",
  },
]

  return (
    <div className="bg-bg-body xs:min-h-[calc(100dvh-4rem)] md:py-26 py-16 flex flex-col items-center justify-center md:gap-16 gap-12 px-6">
      <div className="relative max-w-7xl">
        <div className="min-h-[600px] grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="grid gap-4">
            <div className="grid lg:gap-0 gap-4">
              <h2 className="text-text-titles font-title text-3xl md:text-6xl leading-tight">{about["about.title"] }</h2>
              <p className="text-base text-text-main/70 leading-relaxed">
                {about["about.description"]}
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

          <div className="grid grid-cols-1 xs:grid-cols-2 gap-6 h-auto xs:h-[640px]">
            {/* Imagen grande izquierda */}
            <div className="rounded-radius overflow-hidden aspect-[4/3] xs:aspect-auto xs:h-full relative">
              {aboutImages[0]?.src && (
                <Image 
                  fill
                  priority 
                  loading="eager" 
                  quality={100} 
                  sizes="(max-width: 480px) 100vw, 50vw"
                  src={aboutImages[0].src} 
                  alt={aboutImages[0].alt ?? "Interior de Central Molletes"} 
                  className="object-cover"
                />
              )}
            </div>

            {/* Columna derecha - dos imágenes */}
            <div className="grid grid-rows-2 gap-6 h-auto xs:h-full">
              
              {/* Imagen superior derecha */}
              <div className="rounded-radius overflow-hidden aspect-[4/3] xs:aspect-auto xs:h-full relative">
                {aboutImages[1]?.src && (
                  <Image 
                    fill
                    loading="lazy" 
                    sizes="(max-width: 480px) 100vw, 50vw"
                    src={aboutImages[1].src} 
                    alt={aboutImages[1].alt ?? "Platillos de Central Molletes"} 
                    className="object-cover"
                  />
                )}
              </div>

              {/* Imagen inferior derecha */}
              <div className="rounded-radius overflow-hidden aspect-[4/3] xs:aspect-auto xs:h-full relative">
                {aboutImages[2]?.src && (
                  <Image 
                    fill
                    loading="lazy" 
                    sizes="(max-width: 480px) 100vw, 50vw"
                    src={aboutImages[2].src} 
                    alt={aboutImages[2].alt ?? "Café de especialidad"} 
                    className="object-cover"
                  />
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}