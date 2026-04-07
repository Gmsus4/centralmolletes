export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma"
import Link from "next/link"
import Toast from "@/components/ui/Toast"
import { Suspense } from "react"
import { Metadata } from "next"
import { LayoutAdminSection } from "../components/LayoutAdminSection"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Pencil, ExternalLink, Images } from "lucide-react"
import { EmptyState } from "@/components/ui/EmptyState"

export const metadata: Metadata = {
  title: "Admin | Locaciones",
}

export default async function AdminLocationsPage() {
  const raw = await prisma.location.findMany({ orderBy: { createdAt: "asc" } })
  const locations = raw.map((l) => ({
    ...l,
    gallery: JSON.parse(l.gallery) as string[],
  }))

  return (
    <LayoutAdminSection namePage="Sucursales" maxWidth="max-w-6xl" link={{ label: "Nueva sucursal", href: "/admin/locations/new" }}>
      <Suspense>
        <Toast message="Ubicación guardada correctamente" type="success" triggerParam="success" />
        <Toast message="Ubicación eliminada correctamente" type="success" triggerParam="deleted" />
      </Suspense>

      {locations.length === 0 ? (
        <EmptyState
          icon={MapPin}
          label="Ubicación no configurada"
          description="Aún no has añadido una dirección física. Ayuda a tus clientes a encontrarte en el mapa."
          actionLabel="Nuevo sucursal"
          actionHref="/admin/locations/new"
          className="min-h-[420px]"
        />
      ) : (
        /* ── Location list ── */
        <div className="flex flex-col gap-3">
          {locations.map((loc) => (
            <div key={loc.id} className="group flex flex-col sm:flex-row items-stretch border rounded-lg bg-card overflow-hidden hover:shadow-sm transition-shadow duration-200">
              {/* Image */}
              <div className="w-full h-40 sm:w-36 sm:h-auto shrink-0 bg-muted overflow-hidden">
                {loc.image ? (
                  <img src={loc.image} alt={loc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full min-h-[96px] grid place-items-center">
                    <MapPin className="w-6 h-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:px-5 min-w-0">
                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                  {/* Name + city */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{loc.name}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {loc.city}
                    </Badge>
                  </div>

                  {/* Address */}
                  <span className="text-xs text-muted-foreground truncate">{loc.address}</span>

                  {/* Meta */}
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] font-mono text-muted-foreground/50">/{loc.slug}</span>
                    {loc.gallery.length > 0 && (
                      <>
                        <Separator orientation="vertical" className="h-3" />
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                          <Images className="w-3 h-3" />
                          {loc.gallery.length} foto{loc.gallery.length !== 1 ? "s" : ""}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none gap-1.5">
                    <Link href={`/locations/${loc.slug}`} target="_blank">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="sm:hidden">Ver sucursal</span>
                      <span className="hidden sm:inline">Ver</span>
                    </Link>
                  </Button>
                  <Button asChild variant="default" size="sm" className="flex-1 sm:flex-none gap-1.5">
                    <Link href={`/admin/locations/${loc.id}`}>
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </LayoutAdminSection>
  )
}
