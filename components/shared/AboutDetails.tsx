import { getIcon } from "@/lib/getIcon"
import { getSectionContentWithIds } from "@/lib/siteContent"
import { getSiteImages } from "@/lib/siteImages"
import Image from "next/image"
import { AdminEditWrapper } from "./AdminEditWrapper"
import { AdminImageWrapper } from "./AdminImageWrapper"

type Feature = {
  icon: React.ComponentType<{ className?: string }>
  iconId?: string
  label: string
  labelId?: string
  border?: string
}

export const AboutDetails = async () => {
  const aboutImages = await getSiteImages("about")
  const about = await getSectionContentWithIds("about")

  const features: Feature[] = [
    { icon: getIcon(about["about.features.icon.1"]?.value ?? "Users"), iconId: about["about.features.icon.1"]?.id, label: about["about.features.label.1"]?.value ?? "Label 1", labelId: about["about.features.label.1"]?.id, border: "xs:border-r xs:border-b" },
    { icon: getIcon(about["about.features.icon.2"]?.value ?? "Users"), iconId: about["about.features.icon.2"]?.id, label: about["about.features.label.2"]?.value ?? "Label 2", labelId: about["about.features.label.2"]?.id, border: "xs:border-b" },
    { icon: getIcon(about["about.features.icon.3"]?.value ?? "Users"), iconId: about["about.features.icon.3"]?.id, label: about["about.features.label.3"]?.value ?? "Label 3", labelId: about["about.features.label.3"]?.id, border: "xs:border-r" },
    { icon: getIcon(about["about.features.icon.4"]?.value ?? "Users"), iconId: about["about.features.icon.4"]?.id, label: about["about.features.label.4"]?.value ?? "Label 4", labelId: about["about.features.label.4"]?.id },
  ]

  return (
    <div className="bg-bg-body xs:min-h-[calc(100dvh-4rem)] md:py-26 py-16 flex flex-col items-center justify-center md:gap-16 gap-12 px-6">
      <div className="relative max-w-7xl">
        <div className="min-h-[600px] grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="grid gap-4">
            <div className="grid lg:gap-0 gap-4">
              <AdminEditWrapper href={`/admin/site-content/${about["about.title"]?.id}`} tooltip="Editar título">
                <h2 className="text-text-titles font-title text-3xl md:text-6xl leading-tight">
                  {about["about.title"]?.value}
                </h2>
              </AdminEditWrapper>
              <AdminEditWrapper href={`/admin/site-content/${about["about.description"]?.id}`} tooltip="Editar descripción">
                <p className="text-base text-text-main/70 leading-relaxed">
                  {about["about.description"]?.value}
                </p>
              </AdminEditWrapper>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 place-items-center pt-4 gap-0 self-start">
              {features.map(({ icon: Icon, iconId, label, labelId, border }) => (
                <div key={label} className={`w-full xs:justify-center flex items-center xs:flex-col gap-2 col-span-1 xs:py-6 py-2 xs:border-black/10 ${border ?? ""}`}>
                  <div className="bg-brand-primary rounded-radius w-12 h-12 grid place-items-center">
                    <AdminEditWrapper href={`/admin/site-content/${iconId}`} tooltip="Editar icono">
                      <Icon className="text-text-titles" />
                    </AdminEditWrapper>
                  </div>
                  <AdminEditWrapper href={`/admin/site-content/${labelId}`} tooltip="Editar texto">
                    <p className="text-base text-text-main text-center">{label}</p>
                  </AdminEditWrapper>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 gap-6 h-auto xs:h-[640px]">
            <div className="rounded-radius overflow-hidden aspect-[4/3] xs:aspect-auto xs:h-full relative">
              {aboutImages[0]?.src && (
                <AdminImageWrapper href={`/admin/site-images/${aboutImages[0].id}`}>
                  <Image fill priority loading="eager" quality={100} sizes="(max-width: 480px) 100vw, 50vw" src={aboutImages[0].src} alt={aboutImages[0].alt ?? ""} className="object-cover" />
                </AdminImageWrapper>
              )}
            </div>
            <div className="grid grid-rows-2 gap-6 h-auto xs:h-full">
              <div className="rounded-radius overflow-hidden aspect-[4/3] xs:aspect-auto xs:h-full relative">
                {aboutImages[1]?.src && (
                  <AdminImageWrapper href={`/admin/site-images/${aboutImages[1].id}`}>
                    <Image fill loading="lazy" sizes="(max-width: 480px) 100vw, 50vw" src={aboutImages[1].src} alt={aboutImages[1].alt ?? ""} className="object-cover" />
                  </AdminImageWrapper>
                )}
              </div>
              <div className="rounded-radius overflow-hidden aspect-[4/3] xs:aspect-auto xs:h-full relative">
                {aboutImages[2]?.src && (
                  <AdminImageWrapper href={`/admin/site-images/${aboutImages[2].id}`}>
                    <Image fill loading="lazy" sizes="(max-width: 480px) 100vw, 50vw" src={aboutImages[2].src} alt={aboutImages[2].alt ?? ""} className="object-cover" />
                  </AdminImageWrapper>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}