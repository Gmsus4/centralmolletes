export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma"
import Link from "next/link"
import Toast from "@/components/ui/Toast"
import { Suspense } from "react"
import { Metadata } from "next"
import { LayoutAdminSection } from "../components/LayoutAdminSection"
import { EmptyState } from "@/components/ui/EmptyState"
import { IconFileText } from "@tabler/icons-react"
import { SITE_CONTENT_SECTIONS } from "@/lib/validators/siteContent"

export const metadata: Metadata = { title: "Admin | Contenido del sitio" }

const TYPE_BADGE: Record<string, string> = {
  text:     "bg-stone-100 text-stone-500",
  textarea: "bg-green-50 text-green-700",
  icon:     "bg-amber-50 text-amber-700",
}

export default async function AdminSiteContentPage() {
  const items = await prisma.siteContent.findMany({
    orderBy: [{ section: "asc" }, { key: "asc" }],
  })

  const grouped = SITE_CONTENT_SECTIONS.map((s) => ({
    ...s,
    items: items.filter((i) => i.section === s.value),
  }))

  return (
    <LayoutAdminSection
      namePage="Contenido del sitio"
      maxWidth="max-w-5xl"
      link={{ label: "Nuevo item", href: "/admin/site-content/new" }}
    >
      <div className="flex items-center gap-2 mt-1">
        <span className="text-sm text-stone-400">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="max-w-5xl mx-auto py-6 sm:py-12">
        <Suspense>
          <Toast message="Contenido guardado correctamente" type="success" triggerParam="success" />
          <Toast message="Item eliminado correctamente"     type="success" triggerParam="deleted" />
        </Suspense>

        {items.length === 0 ? (
          <EmptyState
            icon={IconFileText}
            label="Sin contenido aún"
            description="Agrega los textos e íconos del sitio y gestiónalos desde aquí."
            actionLabel="Nuevo item"
            actionHref="/admin/site-content/new"
            className="min-h-[420px]"
          />
        ) : (
          <div className="flex flex-col gap-10">
            {grouped.map((group) => (
              <div key={group.value}>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-semibold">
                    {group.label}
                  </span>
                  <span className="flex-1 h-px bg-stone-200" />
                  <span className="text-[10px] text-stone-400">{group.items.length}</span>
                  <Link
                    href={`/admin/site-content/new?section=${group.value}`}
                    className="text-[9px] uppercase tracking-[0.2em] text-stone-400 hover:text-stone-700 border border-stone-200 hover:border-stone-400 px-2.5 py-1 transition-colors"
                  >
                    + Agregar
                  </Link>
                </div>
                <p className="text-[11px] text-stone-400 mb-4">{group.description}</p>

                {group.items.length === 0 ? (
                  <p className="text-[11px] text-stone-300 italic py-4 border border-dashed border-stone-200 text-center">
                    Sin items en esta sección.{" "}
                    <Link
                      href={`/admin/site-content/new?section=${group.value}`}
                      className="underline underline-offset-2 hover:text-stone-500 transition-colors"
                    >
                      Agregar
                    </Link>
                  </p>
                ) : (
                  <div className="flex flex-col divide-y divide-stone-100 border border-stone-200">
                    {group.items.map((item) => (
                      <Link
                        key={item.id}
                        href={`/admin/site-content/${item.id}`}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-stone-50 transition-colors group"
                      >
                        <span
                          className={`text-[9px] uppercase tracking-[0.15em] font-semibold px-2 py-0.5 shrink-0 ${TYPE_BADGE[item.type] ?? "bg-stone-100 text-stone-500"}`}
                        >
                          {item.type}
                        </span>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[11px] font-mono text-stone-500 truncate">
                            {item.key}
                          </span>
                          <span className="text-[11px] text-stone-400 truncate">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-[12px] text-stone-600 truncate max-w-[280px] hidden sm:block">
                          {item.value}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.15em] text-stone-300 group-hover:text-stone-500 transition-colors shrink-0">
                          Editar →
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </LayoutAdminSection>
  )
}