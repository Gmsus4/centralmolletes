export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma"
import Link from "next/link"
import Toast from "@/components/ui/Toast"
import { Suspense } from "react"
import { Metadata } from "next"
import { LayoutAdminSection } from "../components/LayoutAdminSection"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Megaphone, Info, TriangleAlert, XCircle, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Admin | Anuncios",
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_META: Record<string, {
  label: string
  icon: React.ElementType
  badge: string
}> = {
  PROMO:   { label: "Promoción",   icon: Megaphone,     badge: "bg-violet-50 text-violet-700 border-violet-200" },
  INFO:    { label: "Información", icon: Info,          badge: "bg-sky-50 text-sky-700 border-sky-200"          },
  WARNING: { label: "Aviso",       icon: TriangleAlert, badge: "bg-amber-50 text-amber-700 border-amber-200"    },
  CLOSED:  { label: "Cerrado",     icon: XCircle,       badge: "bg-rose-50 text-rose-700 border-rose-200"       },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date | null | undefined) {
  if (!date) return null
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(new Date(date))
}

function getStatus(a: { isActive: boolean; startsAt: Date; endsAt: Date | null }) {
  const now = new Date()
  if (!a.isActive)                          return { label: "Inactivo",  variant: "secondary" } as const
  if (a.endsAt && new Date(a.endsAt) < now) return { label: "Expirado",  variant: "secondary" } as const
  if (new Date(a.startsAt) > now)           return { label: "Pendiente", variant: "outline"   } as const
  return                                           { label: "Activo",    variant: "default"   } as const
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { startsAt: "desc" },
  })

  return (
    <LayoutAdminSection
      namePage="Anuncios"
      maxWidth="max-w-6xl"
      link={{ label: "Nuevo anuncio", href: "/admin/announcements/new" }}
    >
      <Suspense>
        <Toast message="Anuncio guardado correctamente"  type="success" triggerParam="edit" />
        <Toast message="Anuncio eliminado correctamente" type="success" triggerParam="deleted" />
      </Suspense>

      {announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Megaphone className="w-8 h-8 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">Sin anuncios registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {announcements.map((announcement) => {
            const meta   = TYPE_META[announcement.type]
            const status = getStatus(announcement)
            const Icon   = meta.icon
            const desde  = formatDate(announcement.startsAt)
            const hasta  = formatDate(announcement.endsAt)

            return (
              <Link
                key={announcement.id}
                href={`/admin/announcements/${announcement.id}`}
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

                {/* Title + message */}
                <div className="flex-1">
                  <p className="font-titleText text-foreground text-xl uppercase leading-tight group-hover:text-muted-foreground transition-colors">
                    {announcement.title}
                  </p>
                  {announcement.message && (
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">
                      {announcement.message}
                    </p>
                  )}
                </div>

                <Separator />

                {/* Bottom: fechas */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground mb-0.5">Desde</p>
                    <p className="text-[11px] text-foreground font-medium tabular-nums">{desde}</p>
                  </div>
                  <div className="text-right">
                    {hasta ? (
                      <>
                        <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground mb-0.5">Hasta</p>
                        <p className="text-[11px] text-foreground font-medium tabular-nums">{hasta}</p>
                      </>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        Sin expiración
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer: arrow */}
                <div className="flex items-center justify-end">
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