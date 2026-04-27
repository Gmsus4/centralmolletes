import { getTopReviews } from "@/lib/reviews"
import { getSiteImages } from "@/lib/siteImages"
import { getSectionContentWithIds } from "@/lib/siteContent"
import { IconQuote } from "@tabler/icons-react"
import Image from "next/image"

import { IconPencilCode } from "@tabler/icons-react"
import { AdminEditWrapper } from "../shared/AdminEditWrapper"
import { AdminImageWrapper } from "../shared/AdminImageWrapper"

export const Testimonials = async () => {
  const [testimonials, decorativeImages, content] = await Promise.all([
    getTopReviews(),
    getSiteImages("testimonials"),
    getSectionContentWithIds("testimonials"),
  ])

  const imageFirstByIndex = [false, true, false]

  return (
    <section
      aria-labelledby="testimonials-title"
      className="w-full bg-backgroundMin xs:min-h-[calc(100dvh-4rem)] md:py-26 py-16 flex flex-col items-center justify-center md:gap-16 gap-12 px-6"
    >
      <AdminEditWrapper href={`/admin/site-content/${content["testimonials.title"]?.id}`} tooltip="Editar título">
        <h2 className="font-title text-3xl md:text-6xl leading-tight text-center">
          {content["testimonials.title"]?.value ?? "Nos alegra el día leerlos"}
        </h2>
      </AdminEditWrapper>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {testimonials.map((t, i) => {
          const dbImage = decorativeImages[i]
          const src = dbImage?.src ?? ""
          const imageFirst = imageFirstByIndex[i] ?? false

          const imageBlock = dbImage?.src && (
            <AdminImageWrapper
              href={`/admin/site-images/${dbImage.id}`}
              className="flex-1 lg:min-h-96 min-h-60 rounded-radius overflow-hidden"
            >
              <Image
                loading="lazy"
                width={1920}
                height={1080}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                src={src}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
              />
            </AdminImageWrapper>
          )

          return (
            <div key={t.id} className={`flex gap-4 ${imageFirst ? "lg:flex-col md:flex-row flex-col-reverse" : "lg:flex-col md:flex-row flex-col"}`}>
              {imageFirst && imageBlock}
              <div className="border-1 rounded-radius bg-background/15 md:flex-1 lg:flex-none">
                <blockquote className="font-light text-base p-7 flex flex-col h-full justify-between gap-4">
                  <IconQuote size={30} />
                  <p>{t.body}</p>
                  <footer className="flex items-center gap-3 mt-4">
                    {t.photo && (
                      <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                        <Image src={t.photo} alt={t.author} width={36} height={36} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex gap-2 flex-1">
                      <cite className=" font-semibold font-titleText">{t.author}</cite>
                      <span>—</span>
                      <span className="text-brand-contrast dark:text-brand-primary font-semibold font-titleText">{t.role}</span>
                    </div>
                    <AdminEditWrapper href={`/admin/reviews/${t.id}`} tooltip="Editar reseña" className="shrink-0" hideWhenNotAdmin>
                      <IconPencilCode className=" hover:opacity-60 transition-opacity" size={18} />
                    </AdminEditWrapper>
                  </footer>
                </blockquote>
              </div>
              {!imageFirst && imageBlock}
            </div>
          )
        })}
      </div>
    </section>
  )
}