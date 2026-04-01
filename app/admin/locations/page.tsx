export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma"
import Link from "next/link"
import { IconEdit, IconPlus, IconMapPin } from "@tabler/icons-react"
import Toast from "@/components/ui/Toast"
import { Suspense } from "react"
import { Metadata } from "next"
// import DeleteLocationButton from "./DeleteLocationButton"

export const metadata: Metadata = {
  title: "Admin | Locaciones",
}


export default async function AdminLocationsPage() {
  const raw = await prisma.location.findMany({ orderBy: { createdAt: "asc" } })
  const locations = raw.map((l) => ({ ...l, gallery: JSON.parse(l.gallery) as string[] }))

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Suspense>
          <Toast message="Ubicación guardada correctamente" type="success" triggerParam="success"/>
          <Toast message="Ubicación eliminada correctamente" type="success" triggerParam="deleted"/>
        </Suspense>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-stone-400" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400">Admin · Locaciones</span>
            </div>
            <h1 className="font-titleText text-stone-900 uppercase text-4xl sm:text-5xl leading-none">
              Sucursales
            </h1>
            <p className="text-sm text-stone-400 mt-1">
              {locations.length} {locations.length === 1 ? "sucursal registrada" : "sucursales registradas"}
            </p>
          </div>
          <Link
            href="/admin/locations/new"
            className="inline-flex items-center gap-2 bg-stone-900 text-white px-5 py-3 text-[11px] uppercase tracking-[0.3em] font-semibold hover:bg-stone-700 transition-colors duration-200"
          >
            <IconPlus size={14} strokeWidth={2.5} /> Nueva sucursal
          </Link>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-10">
          <span className="flex-1 h-px bg-stone-200" />
          <span className="w-1 h-1 rounded-full bg-stone-300" />
          <span className="flex-1 h-px bg-stone-200" />
        </div>

        {/* Empty state */}
        {locations.length === 0 ? (
          <div className="py-32 flex flex-col items-center gap-4 border border-dashed border-stone-200 bg-white">
            <div className="w-12 h-12 rounded-full bg-stone-100 grid place-items-center">
              <IconMapPin size={20} className="text-stone-400" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-stone-600 text-sm font-medium">Sin sucursales</p>
              <p className="text-stone-400 text-xs">Agrega tu primera ubicación</p>
            </div>
            <Link
              href="/admin/locations/new"
              className="mt-2 text-[10px] uppercase tracking-[0.2em] text-stone-500 hover:text-stone-900 border-b border-stone-300 hover:border-stone-900 pb-px transition-colors"
            >
              Crear primera
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="group bg-white border border-stone-200 hover:border-stone-300 transition-colors duration-200"
              >
                <div className="flex items-stretch gap-0">

                  {/* Imagen */}
                  <div className="w-28 sm:w-36 shrink-0 overflow-hidden bg-stone-100">
                    {loc.image ? (
                      <img
                        src={loc.image}
                        alt={loc.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full min-h-[96px] grid place-items-center">
                        <IconMapPin size={20} className="text-stone-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 items-center justify-between gap-4 px-5 py-4 min-w-0">
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-stone-900">{loc.name}</span>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-stone-400 bg-stone-100 px-2 py-0.5">
                          {loc.city}
                        </span>
                      </div>
                      <span className="text-xs text-stone-400 truncate">{loc.address}</span>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-mono text-stone-300">{loc.slug}</span>
                        {loc.gallery.length > 0 && (
                          <span className="text-[10px] text-stone-300">
                            {loc.gallery.length} foto{loc.gallery.length !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Link
                        href={`/locations/${loc.slug}`}
                        target="_blank"
                        className="px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-stone-400 hover:text-stone-700 border border-stone-200 hover:border-stone-400 transition-colors duration-150"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/admin/locations/${loc.id}`}
                        className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                      >
                        <IconEdit size={15} />
                      </Link>
                      {/* <DeleteLocationButton id={loc.id} /> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}