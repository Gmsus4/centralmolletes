import { getIcon } from "@/lib/getIcon"
import { getSectionContent } from "@/lib/siteContent"
import { getSiteImages } from "@/lib/siteImages"
import Image from "next/image"

type Benefit = {
  icon: React.ReactNode
  title: string
  description: string
  pattern: string
}

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const HeartHandshakeIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const LeafIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 22c0 0 6-8 14-10S22 2 22 2s-8 6-10 14S2 22 2 22z" />
  </svg>
)

// Patrones SVG únicos por card — todos usan stroke con opacidad baja sobre brand-primary
const PatternDots = () => (
  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dots" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.5" fill="currentColor" className="text-text-titles/20" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
)

const PatternLines = () => (
  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="lines" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
        <path d="M0 12 L12 0" stroke="currentColor" strokeWidth="1" className="text-text-titles/15" fill="none" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#lines)" />
  </svg>
)

const PatternGrid = () => (
  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-text-titles/15" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
)

export const BenefitsPanel = async () => {
  const featuresImages = await getSiteImages("features")
  const img = featuresImages[0]
  const benefitsContent = await getSectionContent("benefits")

  const benefits = [
  {
    icon: getIcon(benefitsContent["benefits.icon.1"]   ?? "Users"),
    title: benefitsContent["benefits.card1.title"] ?? "Title1",
    description: benefitsContent["benefits.card1.subtitle"] ?? "Description1",
    Pattern: PatternDots,
  },
  {
    icon: getIcon(benefitsContent["benefits.icon.2"]   ?? "Users"),
    title: benefitsContent["benefits.card2.title"] ?? "Title1",
    description: benefitsContent["benefits.card2.subtitle"] ?? "Description1",
    Pattern: PatternLines,
  },
  {
    icon: getIcon(benefitsContent["benefits.icon.3"]   ?? "Users"),
    title: benefitsContent["benefits.card3.title"] ?? "Title1",
    description: benefitsContent["benefits.card3.subtitle"] ?? "Description1",
    Pattern: PatternGrid,
  },
]

  return (
    <div className="bg-bg-body py-16 md:py-24 px-6 flex flex-col items-center gap-10">
      <div className="max-w-7xl w-full flex flex-col gap-10">

        {/* Título centrado */}
        <div className="flex flex-col items-center text-center gap-3">
          <h2 className="text-text-titles font-title text-3xl md:text-6xl leading-tight max-w-md">
            El corazón de lo que hacemos
          </h2>
        </div>

        {/* 3 cards */}
        <div className="grid grid-cols-1 xs:grid-cols-3 gap-4">
          {benefits.map(({ icon: Icon, title, description, Pattern }) => (
            <div
              key={title}
              className="rounded-radius overflow-hidden border border-black/8 flex flex-col"
            >
              {/* Franja superior — brand-primary + patrón + ícono */}
              <div className="bg-brand-primary relative px-6 pt-6 pb-5 flex items-end justify-between overflow-hidden min-h-[100px]">
                <Pattern />
                {/* Círculo decorativo difuso en esquina */}
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-text-titles/10" />
                {/* Ícono centrado sobre el patrón */}
                <div className="relative z-10 w-12 h-12 rounded-radius bg-bg-body/25 grid place-items-center">
                  <Icon className="text-text-titles" />
                </div>
              </div>

              {/* Separador */}
              <div className="h-px w-full bg-black/6" />

              {/* Cuerpo */}
              <div className="flex flex-col gap-2 px-6 py-5 bg-bg-body flex-1">
                <p className="text-base font-semibold text-text-titles">{title}</p>
                <p className="text-sm text-text-main/65 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Imagen ancha */}
        {img?.src && (
          <div className="rounded-radius overflow-hidden relative w-full h-[340px] md:h-[420px]">
            <Image
              fill
              priority
              loading="eager"
              quality={100}
              sizes="100vw"
              src={img.src}
              alt={img.alt ?? "El corazón de lo que hacemos"}
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />

            <div className="absolute inset-0 flex items-end justify-between p-8 md:p-12">
              <div className="flex flex-col gap-2 max-w-xs">
                <p className="text-[11px] tracking-[0.16em] uppercase text-white/55 font-medium">
                  {benefitsContent["benefits.image.content.title"]}
                </p>
                <p className="font-title text-white text-2xl md:text-3xl leading-snug">
                  {benefitsContent["benefits.image.content.subtitle"]}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}