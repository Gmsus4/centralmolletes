import Image from "next/image"
import { getSectionContentWithIds } from "@/lib/siteContent"
import { AdminEditWrapper } from "../shared/AdminEditWrapper"
import { AdminImageWrapperFill } from "../shared/AdminImageWrapperFill"
import { getSiteImages } from "@/lib/siteImages"

interface TitleProps {
  section: "locations" | "about" | "blog" | "contact"
  isBgprimaryColor?: boolean
  isMarquee?: boolean
  className?: string
}

const sectionMap = {
  blog: {
    titleKey: "headings.blog.title",
    subtitleKey: "headings.blog.subtitle",
  },
  locations: {
    titleKey: "headings.locations.title",
    subtitleKey: "headings.locations.subtitle",
  },
  about: {
    titleKey: "headings.about.title",
    subtitleKey: "headings.about.subtitle",
  },
  contact: {
    titleKey: "headings.contact.title",
    subtitleKey: "headings.contact.subtitle",
  },
} as const satisfies Record<TitleProps["section"], { titleKey: string; subtitleKey: string }>

export const TitlePage = async ({
  section,
  isBgprimaryColor = true,
  className = "",
  isMarquee = true,
}: TitleProps) => {
  const titles = await getSectionContentWithIds("headings")
  const statsImages = await getSiteImages("inner_header")

  const config = sectionMap[section]

  const titleItem = titles[config.titleKey]
  const subtitleItem = titles[config.subtitleKey]

  return (
    <>
      <section
        className={`${isBgprimaryColor ? "bg-bg-dark" : "bg-bg-body"} min-h-70 pt-14 w-full overflow-hidden ${className} grid place-items-center px-10 relative`}
      >
        <AdminImageWrapperFill href={`/admin/site-images/${statsImages[0].id}`}>
          <Image
            src={statsImages[0]?.src ?? "/hero.webp"}
            alt="Hero background"
            fill
            priority
            className="object-cover object-[70%_center] sm:object-center"
            style={{ opacity: 0.25 }}
          />
        </AdminImageWrapperFill>

        <div className="flex flex-col gap-4">
          <AdminEditWrapper href={`/admin/site-content/${titleItem?.id}`} tooltip="Editar título">
            <h1
              className={`title-enter font-title xs:text-6xl text-5xl ${
                isBgprimaryColor ? "text-brand-primary" : "text-bg-body"
              } z-10 text-center transition-all duration-700 ease-out`}
            >
              {titleItem?.value ?? ""}
            </h1>
          </AdminEditWrapper>

          <AdminEditWrapper href={`/admin/site-content/${subtitleItem?.id}`} tooltip="Editar subtítulo" className="z-10">
            <p
              className={`text-center text-sm ${
                isBgprimaryColor ? "text-brand-primary" : "text-bg-body"
              } transition-all z-10 duration-700 delay-200 ease-out`}
            >
              {subtitleItem?.value ?? ""}
            </p>
          </AdminEditWrapper>
        </div>
      </section>
    </>
  )
}
