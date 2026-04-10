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
import * as LucideIcons from "lucide-react"
import { AboutFeaturesPreview, BenefitsPreview, StatsPreview } from "./components/SectionPreviews"

export const metadata: Metadata = { title: "Admin | Contenido del sitio" }

const TYPE_BADGE: Record<string, string> = {
  text:     "bg-stone-100 text-stone-500",
  textarea: "bg-green-50 text-green-700",
  icon:     "bg-amber-50 text-amber-700",
}

type LucideComponent = React.ComponentType<{ size?: number; className?: string }>

function getLucideIcon(key: string): LucideComponent | null {
  return (LucideIcons as unknown as Record<string, LucideComponent>)[key] ?? null
}

/** Renders a Lucide icon by key with amber tint */
function IconPreview({ value }: { value: string }) {
  const Component = getLucideIcon(value)
  if (Component) {
    return (
      <span className="flex items-center gap-2 shrink-0">
        <span className="flex items-center justify-center w-7 h-7 rounded bg-amber-50 shrink-0">
          <Component size={15} className="text-amber-600" />
        </span>
        <span className="text-[11px] text-stone-400 font-mono hidden lg:block">{value}</span>
      </span>
    )
  }
  return (
    <span className="text-[11px] text-stone-400 font-mono truncate max-w-[160px]">
      {value}
    </span>
  )
}

type SiteContentItem = { id: string; key: string; label: string; value: string; section: string; type: string }

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
                {/* Section header */}
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-semibold">
                    {group.label}
                  </span>
                  <span className="flex-1 h-px bg-stone-200" />
                  <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                    {group.items.length}
                  </span>
                  <Link
                    href={`/admin/site-content/new?section=${group.value}`}
                    className="text-[9px] uppercase tracking-[0.2em] text-stone-400 hover:text-stone-700 border border-stone-200 hover:border-stone-400 px-2.5 py-1 transition-colors"
                  >
                    + Agregar
                  </Link>
                </div>
                <p className="text-[11px] text-stone-400 mb-4">{group.description}</p>

                {/* Stats section gets a visual preview of the cards */}
                {group.value === "stats" && group.items.length > 0 && (
                  <StatsPreview items={group.items} />
                )}

                {group.value === "about" && group.items.length > 0 && (
                  <AboutFeaturesPreview items={group.items} />
                )}

                {group.value === "benefits" && group.items.length > 0 && (
                  <BenefitsPreview items={group.items} />
                )}

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
                  <div className="flex flex-col divide-y divide-stone-100 border border-stone-200 rounded-sm">
                    {group.items.map((item) => (
                      <Link
                        key={item.id}
                        href={`/admin/site-content/${item.id}`}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-stone-50 transition-colors group"
                      >
                        {/* Type badge */}
                        <span
                          className={`text-[9px] uppercase tracking-[0.15em] font-semibold px-2 py-0.5 shrink-0 ${TYPE_BADGE[item.type] ?? "bg-stone-100 text-stone-500"}`}
                        >
                          {item.type}
                        </span>

                        {/* Label (human name) + key */}
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[12px] font-medium text-stone-700 truncate leading-snug">
                            {item.label}
                          </span>
                          <span className="text-[10px] font-mono text-stone-400 truncate leading-snug">
                            {item.key}
                          </span>
                        </div>

                        {/* Value preview — icon renders visually, text truncates */}
                        <div className="hidden sm:flex items-center max-w-[260px] shrink-0">
                          {item.type === "icon" ? (
                            <IconPreview value={item.value} />
                          ) : (
                            <span className="text-[12px] text-stone-400 truncate">
                              {item.value}
                            </span>
                          )}
                        </div>

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