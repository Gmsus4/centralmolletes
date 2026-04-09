export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma"
import Link from "next/link"
import Toast from "@/components/ui/Toast"
import { Suspense } from "react"
import { Metadata } from "next"
import { LayoutAdminSection } from "../components/LayoutAdminSection"
import { EmptyState } from "@/components/ui/EmptyState"
import { IconPhoto } from "@tabler/icons-react"
import { SITE_IMAGE_SECTIONS } from "@/lib/validators/siteImage"
import { SiteImageList } from "./SiteImageList"

export const metadata: Metadata = {
  title: "Admin | Imágenes del sitio",
}

export default async function AdminSiteImagesPage() {
  const images = await prisma.siteImage.findMany({
    orderBy: [{ section: "asc" }, { order: "asc" }],
  })

  // Agrupar por sección
  const grouped = SITE_IMAGE_SECTIONS.map((s) => ({
    ...s,
    images: images.filter((img) => img.section === s.value),
  }))

  return (
    <LayoutAdminSection namePage="Imágenes del sitio" maxWidth="max-w-6xl" link={{ label: "Nueva imagen", href: "/admin/site-images/new" }}>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-sm text-stone-400">
          {images.length} {images.length === 1 ? "imagen" : "imágenes"}
        </span>
      </div>

      <div className="max-w-6xl mx-auto py-6 sm:py-12">
        <Suspense>
          <Toast message="Imagen guardada correctamente" type="success" triggerParam="success" />
          <Toast message="Imagen eliminada correctamente" type="success" triggerParam="deleted" />
        </Suspense>

        {images.length === 0 ? (
          <EmptyState
            icon={IconPhoto}
            label="Sin imágenes aún"
            description="Agrega imágenes para cada sección del sitio y gestiónalas desde aquí."
            actionLabel="Nueva imagen"
            actionHref="/admin/site-images/new"
            className="min-h-[420px]"
          />
        ) : (
          <div className="flex flex-col gap-10">
            {grouped.map((group) => (
              <div key={group.value}>
                {/* Encabezado de sección */}
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-semibold">{group.label}</span>
                  <span className="flex-1 h-px bg-stone-200" />
                  <span className="text-[10px] text-stone-400">{group.images.length}</span>
                  <Link
                    href={`/admin/site-images/new?section=${group.value}`}
                    className="text-[9px] uppercase tracking-[0.2em] text-stone-400 hover:text-stone-700 border border-stone-200 hover:border-stone-400 px-2.5 py-1 transition-colors"
                  >
                    + Agregar
                  </Link>
                </div>
                <p className="text-[11px] text-stone-400 mb-4">{group.description}</p>

                {group.images.length === 0 ? (
                  <p className="text-[11px] text-stone-300 italic py-4 border border-dashed border-stone-200 text-center">
                    Sin imágenes en esta sección.{" "}
                    <Link href={`/admin/site-images/new?section=${group.value}`} className="underline underline-offset-2 hover:text-stone-500 transition-colors">
                      Agregar
                    </Link>
                  </p>
                ) : (
                  <SiteImageList images={group.images} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </LayoutAdminSection>
  )
}
