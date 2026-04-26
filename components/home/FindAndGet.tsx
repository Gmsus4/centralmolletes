// FindAndGet.tsx
import Link from "next/link"
import { getSectionContentWithIds } from "@/lib/siteContent"
import { AdminEditWrapper } from "@/components/shared/AdminEditWrapper"
import { FindAndGetCarousel } from "./FindAndGetCarousel"
import { IconPencilCode } from "@tabler/icons-react"

export type CategoryItem = {
  name: string
  img: string
}

export const FindAndGet = async ({ categories }: { categories: CategoryItem[] }) => {
  const content = await getSectionContentWithIds("menu_cta")

  const title     = content["menu_cta.title"]?.value      ?? "¿Qué se te antoja hoy?"
  const buttonTxt = content["menu_cta.button.txt"]?.value ?? "Ver menú completo"
  const badge     = content["menu_cta.badge"]?.value      ?? "Menú completo"
  const titleId     = content["menu_cta.title"]?.id
  const buttonTxtId = content["menu_cta.button.txt"]?.id
  const badgeId     = content["menu_cta.badge"]?.id

  return (
    <div className="bg-background w-full py-16 md:py-24 flex flex-col items-center gap-10 md:gap-14 overflow-hidden">

      {/* Título */}
      <div className="flex flex-col items-center gap-3 px-6 text-center">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px bg-background/25" />
          <AdminEditWrapper href={`/admin/site-content/${badgeId}`} tooltip="Editar badge">
            <span className="text-[10px] uppercase tracking-[0.25em] opacity-90">
              {badge}
            </span>
          </AdminEditWrapper>
          <span className="w-8 h-px bg-background/25" />
        </div>

        <AdminEditWrapper href={`/admin/site-content/${titleId}`} tooltip="Editar título">
          <h2 className="font-title text-3xl md:text-6xl leading-tight">
            {title}
          </h2>
        </AdminEditWrapper>
      </div>

      {/* Carrusel — único motivo para tener cliente */}
      <FindAndGetCarousel categories={categories} />

      {/* Botón */}
      <div className="relative">
        <Link href="/menu" className="text-[11px] uppercase tracking-[0.25em] hover:opacity-60 transition-opacity flex items-center gap-2">
          <span className="w-6 h-px bg-background/60" />
          {buttonTxt}
          <span className="w-6 h-px bg-background/60" />
        </Link>
        <AdminEditWrapper href={`/admin/site-content/${buttonTxtId}`} tooltip="Editar botón" className="absolute -right-10 top-0" hideWhenNotAdmin>
          <IconPencilCode className="" size={18} />
        </AdminEditWrapper>
      </div>

    </div>
  )
}