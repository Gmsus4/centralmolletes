import { getIcon } from "@/lib/getIcon"
import { getSectionContentWithIds } from "@/lib/siteContent"
import { getSiteImages } from "@/lib/siteImages"
import Image from "next/image"
import { AdminEditWrapper } from "../shared/AdminEditWrapper"
import { AdminImageWrapper } from "../shared/AdminImageWrapper"

const PatternDots = () => (
  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id="dots" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.5" fill="currentColor" className="text-text-titles/20" /></pattern></defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
)
const PatternLines = () => (
  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id="lines" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 12 L12 0" stroke="currentColor" strokeWidth="1" className="text-text-titles/15" fill="none" /></pattern></defs>
    <rect width="100%" height="100%" fill="url(#lines)" />
  </svg>
)
const PatternGrid = () => (
  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id="grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-text-titles/15" /></pattern></defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
)

export const BenefitsPanel = async () => {
  const featuresImages = await getSiteImages("features")
  const img = featuresImages[0]
  const benefitsContent = await getSectionContentWithIds("benefits")

  const benefits = [
    { icon: getIcon(benefitsContent["benefits.icon.1"]?.value ?? "Users"), iconId: benefitsContent["benefits.icon.1"]?.id, title: benefitsContent["benefits.card1.title"]?.value ?? "Title1", titleId: benefitsContent["benefits.card1.title"]?.id, description: benefitsContent["benefits.card1.subtitle"]?.value ?? "Description1", descId: benefitsContent["benefits.card1.subtitle"]?.id, Pattern: PatternDots },
    { icon: getIcon(benefitsContent["benefits.icon.2"]?.value ?? "Users"), iconId: benefitsContent["benefits.icon.2"]?.id, title: benefitsContent["benefits.card2.title"]?.value ?? "Title1", titleId: benefitsContent["benefits.card2.title"]?.id, description: benefitsContent["benefits.card2.subtitle"]?.value ?? "Description1", descId: benefitsContent["benefits.card2.subtitle"]?.id, Pattern: PatternLines },
    { icon: getIcon(benefitsContent["benefits.icon.3"]?.value ?? "Users"), iconId: benefitsContent["benefits.icon.3"]?.id, title: benefitsContent["benefits.card3.title"]?.value ?? "Title1", titleId: benefitsContent["benefits.card3.title"]?.id, description: benefitsContent["benefits.card3.subtitle"]?.value ?? "Description1", descId: benefitsContent["benefits.card3.subtitle"]?.id, Pattern: PatternGrid },
  ]

  return (
    <div className="bg-background py-16 md:py-24 px-6 flex flex-col items-center gap-10">
      <div className="max-w-7xl w-full flex flex-col gap-10">

        <div className="flex flex-col items-center text-center gap-3">
          <AdminEditWrapper href={`/admin/site-content/${benefitsContent["benefits.title"]?.id}`} tooltip="Editar título">
            <h2 className="font-title text-3xl md:text-6xl leading-tight max-w-md">
              {benefitsContent["benefits.title"]?.value ?? "El corazón de lo que hacemos"}
            </h2>
          </AdminEditWrapper>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-4">
          {benefits.map(({ icon: Icon, iconId, title, titleId, description, descId, Pattern }) => (
            <div key={title} className="rounded-radius overflow-hidden border flex flex-col">
              <div className="bg-brand-primary relative px-6 pt-6 pb-5 flex items-end justify-between overflow-hidden min-h-[100px]">
                <Pattern />
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-text-titles/10" />
                <div className="relative z-10 w-12 h-12 rounded-radius bg-bg-body/25 grid place-items-center">
                  <AdminEditWrapper href={`/admin/site-content/${iconId}`} tooltip="Editar icono">
                    <Icon className="text-text-titles" />
                  </AdminEditWrapper>
                </div>
              </div>
              <div className="h-px w-full bg-black/6" />
              <div className="flex flex-col gap-2 px-6 py-5 bg-background flex-1">
                <AdminEditWrapper href={`/admin/site-content/${titleId}`} tooltip="Editar título" side="left">
                  <p className="text-base font-semibold">{title}</p>
                </AdminEditWrapper>
                <AdminEditWrapper href={`/admin/site-content/${descId}`} tooltip="Editar descripción" side="left">
                  <p className="text-sm leading-relaxed opacity-65">{description}</p>
                </AdminEditWrapper>
              </div>
            </div>
          ))}
        </div>

        {img?.src && (
          <div className="rounded-radius overflow-hidden relative w-full h-[340px] md:h-[420px]">
            <AdminImageWrapper href={`/admin/site-images/${img.id}`}>
              <Image fill priority loading="eager" quality={100} sizes="100vw" src={img.src} alt={img.alt ?? "El corazón de lo que hacemos"} className="object-cover object-center" />
            </AdminImageWrapper>
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20 pointer-events-none" />
            <div className="absolute inset-0 flex items-end justify-between p-8 md:p-12 pointer-events-none">
              <div className="flex flex-col gap-2 max-w-xs pointer-events-auto">
                <AdminEditWrapper href={`/admin/site-content/${benefitsContent["benefits.image.content.title"]?.id}`} tooltip="Editar texto" side="left">
                  <p className="text-[11px] tracking-[0.16em] uppercase text-white/55 font-medium">
                    {benefitsContent["benefits.image.content.title"]?.value}
                  </p>
                </AdminEditWrapper>
                <AdminEditWrapper href={`/admin/site-content/${benefitsContent["benefits.image.content.subtitle"]?.id}`} tooltip="Editar texto" side="left">
                  <p className="font-title text-white text-2xl md:text-3xl leading-snug">
                    {benefitsContent["benefits.image.content.subtitle"]?.value}
                  </p>
                </AdminEditWrapper>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}