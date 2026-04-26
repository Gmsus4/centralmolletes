import { getSectionContentWithIds } from "@/lib/siteContent"
import { getSiteImages } from "@/lib/siteImages"
import { AdminEditWrapper } from "../shared/AdminEditWrapper"
import { ButtonCustom } from "../ui/ButtonCustom"
import Image from "next/image"
import { AdminImageWrapperFill } from "../shared/AdminImageWrapperFill"
import { AdminImageWrapper } from "../shared/AdminImageWrapper"

export const AboutInfo = async () => {
  const statsImages = await getSiteImages("stats")
  const data = await getSectionContentWithIds("about")

  return (
    <div className="relative max-w-7xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
        <div className="flex-1 flex flex-col gap-7 lg:max-w-lg">
          <AdminEditWrapper href={`/admin/site-content/${data["about.title"]?.id}`} tooltip="Editar icono">
            <h2 className="about-title font-title text-4xl sm:text-5xl lg:text-6xl leading-tight">{data["about.title"]?.value}</h2>
          </AdminEditWrapper>
          <div className="about-body flex flex-col gap-4 text-sm sm:text-base leading-relaxed">
            <AdminEditWrapper href={`/admin/site-content/${data["about.subtitle"]?.id}`} tooltip="Editar texto">
              <p>{data["about.subtitle"]?.value}</p>
            </AdminEditWrapper>
          </div>
          <div className="about-cta flex flex-col xs:flex-row gap-3 pt-2">
            <ButtonCustom title="Contáctanos" url="/contact" />
            {/* <ButtonCustom title="Visítanos en Instagram" url={socialMedia.facebook.href} isFilled={false} target="_blank" className="text-darkWarm" /> */}
          </div>
        </div>

        <div className="flex-1 relative flex items-center justify-center w-full min-h-[320px] sm:min-h-[420px]">
          <AdminImageWrapper href={`/admin/site-images/${statsImages[0]?.id}`}>
            <Image src={statsImages[0]?.src} width={1920} height={1080} alt={statsImages[0]?.alt} className="rounded-radius"/>
          </AdminImageWrapper>
        </div>
      </div>
    </div>
  )
}
