import { images } from "@/data/images"
import { getSiteImages } from "@/lib/siteImages"
import { IconHeart, IconLeaf, IconSparkles } from "@tabler/icons-react"
import Image from "next/image"

type Benefit = {
  icon: React.ComponentType<{ height?: number; width?: number; className?: string }>
  title: string
  description: string
}

const benefits: Benefit[] = [
  {
    icon: IconHeart,
    title: "Pasión Artesanal",
    description: "Hecho a mano, sin procesos industriales.",
  },
  {
    icon: IconLeaf,
    title: "Ingredientes de Calidad",
    description: "Proveedores locales, frescura garantizada.",
  },
  {
    icon: IconSparkles,
    title: "Hecho al Momento",
    description: "Cada platillo sale de la cocina recién preparado.",
  },
]

export const BenefitsPanel = async() => {
  const featuresImages = await getSiteImages("features")
  return (
    <section aria-labelledby="benefits-title" className="bg-bg-body py-20 px-6 sm:px-10 lg:px-20">
      <h2 className="text-center xs:text-6xl text-4xl w-2/3 m-auto font-title text-text-titles mb-12 scroll-mt-20">
       Lo Que Nos Hace Únicos
      </h2>
      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {benefits.map(({ icon: Icon, title, description }) => (
          <div key={title} className="grid place-items-center rounded-radius p-10 bg-bg-body shadow-md">
            <div className="aspect-square w-14 grid place-items-center bg-bg-dark rounded-full mb-4">
              <Icon className="text-brand-primary"  aria-hidden="true" height={30} width={30} />
            </div>
            <h3 className="text-text-titles font-bold mb-2 text-2xl xs:text-xl text-center">{title}</h3>
            <p className="text-text-muted text-center font-title">{description}</p>
          </div>
        ))}
        <div className="rounded-radius w-full overflow-hidden md:col-span-3 col-span-1">
          {
            featuresImages.length > 0 && (
              <Image className="w-full" width={1200} height={600} quality={90} sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1200px" src={featuresImages[0]?.src} alt={featuresImages[0]?.alt} loading="lazy"/>
            )
          }
          {/* {
            featuresImages.map((f) => (
              <Image className="w-full" width={1200} height={600} quality={90} sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1200px" src={f.src} alt={f?.alt} loading="lazy"/>
            ))
          } */}
        </div>
      </div>
    </section>
  )
}