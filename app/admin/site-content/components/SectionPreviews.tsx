import * as LucideIcons from "lucide-react"

type LucideComponent = React.ComponentType<{ size?: number; className?: string }>

type SiteContentItem = { id: string; key: string; label: string; value: string; section: string; type: string }

function getLucideIcon(key: string): LucideComponent | null {
  return (LucideIcons as unknown as Record<string, LucideComponent>)[key] ?? null
}

export function StatsPreview({ items }: { items: SiteContentItem[] }) {
  const slugs = [...new Set(
    items
      .map((i) => i.key.match(/^stats\.(\w+)\./)?.[1])
      .filter(Boolean)
  )] as string[]

  if (slugs.length === 0) return null

  return (
    <div className="mb-4 flex flex-wrap gap-3">
      {slugs.map((slug) => {
        const get = (suffix: string) =>
          items.find((i) => i.key === `stats.${slug}.${suffix}`)?.value ?? ""

        const value      = get("value")
        const label      = get("label")
        const iconTopKey = get("icon.top-right")
        const iconBotKey = get("icon.bottom-left")
        const IconTop    = iconTopKey ? getLucideIcon(iconTopKey) : null
        const IconBot    = iconBotKey ? getLucideIcon(iconBotKey) : null

        return (
          <div
            key={slug}
            className="relative w-36 h-24 rounded bg-brand-primary flex flex-col items-center justify-center gap-0.5 overflow-hidden shrink-0"
          >
            {IconTop && <IconTop size={13} className="absolute top-2 right-2 text-brand-contrast" />}
            {IconBot && <IconBot size={13} className="absolute bottom-2 left-2 text-brand-contrast" />}
            <span className="text-xl font-medium text-brand-contrast leading-none">{value || "—"}</span>
            <span className="text-[10px] text-brand-contrast text-center px-3 leading-tight">{label || "Sin label"}</span>
          </div>
        )
      })}
    </div>
  )
}

export function AboutFeaturesPreview({ items }: { items: SiteContentItem[] }) {
  const slugs = ["1", "2", "3", "4"]

  const hasAny = slugs.some((s) =>
    items.find((i) => i.key === `about.features.icon.${s}` || i.key === `about.features.label.${s}`)
  )
  if (!hasAny) return null

  const borders: Record<string, string> = {
    "1": "border-r border-b",
    "2": "border-b",
    "3": "border-r",
    "4": "",
  }

  return (
    <div className="mb-4 inline-flex border border-stone-200 rounded overflow-hidden bg-white">
      <div className="grid grid-cols-2 w-72">
        {slugs.map((s) => {
          const iconKey = items.find((i) => i.key === `about.features.icon.${s}`)?.value ?? ""
          const label   = items.find((i) => i.key === `about.features.label.${s}`)?.value ?? `Feature ${s}`
          const Icon    = iconKey ? getLucideIcon(iconKey) : null

          return (
            <div
              key={s}
              className={`flex flex-col items-center justify-center gap-1.5 py-4 px-3 border-stone-100 ${borders[s]}`}
            >
              <span className="flex items-center justify-center w-8 h-8 rounded bg-brand-primary shrink-0">
                {Icon
                  ? <Icon size={15} className="text-brand-contrast" />
                  : <span className="text-[9px] text-brand-contrast font-mono">{iconKey || "?"}</span>
                }
              </span>
              <span className="text-[10px] text-brand-contrast text-center leading-tight">{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function BenefitsPreview({ items }: { items: SiteContentItem[] }) {
  const slugs = ["1", "2", "3"]

  const hasAny = slugs.some((s) =>
    items.find((i) => i.key === `benefits.card${s}.title` || i.key === `benefits.icon.${s}`)
  )
  if (!hasAny) return null

  const imageTitle    = items.find((i) => i.key === "benefits.image.content.title")?.value ?? ""
  const imageSubtitle = items.find((i) => i.key === "benefits.image.content.subtitle")?.value ?? ""

  return (
    <div className="mb-4 flex flex-col gap-3">
      {/* 3 cards */}
      <div className="inline-flex gap-2">
        {slugs.map((s) => {
          const iconKey     = items.find((i) => i.key === `benefits.icon.${s}`)?.value ?? ""
          const title       = items.find((i) => i.key === `benefits.card${s}.title`)?.value ?? `Card ${s}`
          const description = items.find((i) => i.key === `benefits.card${s}.subtitle`)?.value ?? ""
          const Icon        = iconKey ? getLucideIcon(iconKey) : null

          return (
            <div
              key={s}
              className="w-36 rounded overflow-hidden border border-stone-200 flex flex-col shrink-0"
            >
              {/* Franja superior */}
              <div className="bg-brand-primary h-12 flex items-center justify-center">
                <span className="flex items-center justify-center w-7 h-7 rounded bg-white/20">
                  {Icon
                    ? <Icon size={13} className="text-brand-contrast" />
                    : <span className="text-[8px] text-brand-contrast font-mono">{iconKey || "?"}</span>
                  }
                </span>
              </div>
              {/* Cuerpo */}
              <div className="px-2.5 py-2.5 bg-white flex flex-col gap-1 flex-1">
                <p className="text-[10px] font-semibold text-stone-700 leading-tight line-clamp-1">{title}</p>
                <p className="text-[9px] text-stone-400 leading-tight line-clamp-2">{description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Preview de la imagen con su texto */}
      {(imageTitle || imageSubtitle) && (
        <div className="inline-flex w-[calc(3*9rem+2*0.5rem)] rounded overflow-hidden border border-stone-200 bg-stone-800 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="relative z-10 flex flex-col gap-1 p-3">
            {imageTitle && (
              <p className="text-[8px] uppercase tracking-[0.15em] text-white/50 font-medium">{imageTitle}</p>
            )}
            {imageSubtitle && (
              <p className="text-[10px] text-white font-medium leading-tight line-clamp-2">{imageSubtitle}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}