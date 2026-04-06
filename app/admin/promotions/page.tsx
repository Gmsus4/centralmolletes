export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma"
import Link from "next/link"
import Toast from "@/components/ui/Toast"
import { Suspense } from "react"
import { Metadata } from "next"
import { LayoutAdminSection } from "../components/LayoutAdminSection"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tag, Megaphone, TriangleAlert, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Admin | Promociones",
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_META: Record<string, {
  label: string
  icon: React.ElementType
  badge: string
}> = {
  DISCOUNT: {
    label: "Descuento",
    icon:  Tag,
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  ANNOUNCE: {
    label: "Anuncio",
    icon:  Megaphone,
    badge: "bg-sky-50 text-sky-700 border-sky-200",
  },
  WARNING: {
    label: "Aviso",
    icon:  TriangleAlert,
    badge: "bg-rose-50 text-rose-700 border-rose-200",
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(new Date(date))
}

function getStatus(promotion: { isActive: boolean; startsAt: Date; endsAt: Date }) {
  const now = new Date()
  if (!promotion.isActive)                return { label: "Inactiva",  variant: "secondary"    } as const
  if (new Date(promotion.endsAt) < now)   return { label: "Expirada",  variant: "secondary"    } as const
  if (new Date(promotion.startsAt) > now) return { label: "Pendiente", variant: "outline"      } as const
  return                                         { label: "Activa",    variant: "default"      } as const
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PromotionsPage() {
  const promotions = await prisma.promotion.findMany({
    orderBy: { startsAt: "desc" },
    include: { products: true },
  })

  return (
    <LayoutAdminSection
      namePage="Promociones"
      maxWidth="max-w-6xl"
      link={{ label: "Nueva promoción", href: "/admin/promotions/new" }}
    >
      <Suspense>
        <Toast message="Promoción guardada correctamente"  type="success" triggerParam="edit" />
        <Toast message="Promoción eliminada correctamente" type="success" triggerParam="deleted" />
      </Suspense>

      {promotions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Tag className="w-8 h-8 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">Sin promociones registradas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {promotions.map((promotion) => {
            const meta   = TYPE_META[promotion.type]
            const status = getStatus(promotion)
            const Icon   = meta.icon

            return (
              <Link
                key={promotion.id}
                href={`/admin/promotions/${promotion.id}`}
                className="group flex flex-col gap-4 p-5 border rounded-lg bg-card hover:shadow-md transition-all duration-200"
              >
                {/* Top row: tipo + status */}
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant="outline"
                    className={`gap-1.5 text-[10px] uppercase tracking-wide font-medium ${meta.badge}`}
                  >
                    <Icon className="w-3 h-3" />
                    {meta.label}
                  </Badge>
                  <Badge variant={status.variant} className="text-[10px]">
                    {status.label}
                  </Badge>
                </div>

                {/* Title + description */}
                <div className="flex-1">
                  <p className="font-titleText text-foreground text-xl uppercase leading-tight group-hover:text-muted-foreground transition-colors">
                    {promotion.title}
                  </p>
                  {promotion.description && (
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">
                      {promotion.description}
                    </p>
                  )}
                </div>

                <Separator />

                {/* Bottom: descuento + fechas */}
                <div className="flex items-end justify-between">
                  <div>
                    {promotion.discount != null ? (
                      <p className="text-3xl font-black text-foreground leading-none tabular-nums">
                        {promotion.discount}
                        <span className="text-base font-medium text-muted-foreground">%</span>
                      </p>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        Sin descuento
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground mb-0.5">
                      Vigencia
                    </p>
                    <p className="text-[11px] text-foreground font-medium tabular-nums">
                      {formatDate(promotion.startsAt)} — {formatDate(promotion.endsAt)}
                    </p>
                  </div>
                </div>

                {/* Footer: productos + arrow */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    {promotion.products.length} producto{promotion.products.length !== 1 ? "s" : ""}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all duration-200" />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </LayoutAdminSection>
  )
}