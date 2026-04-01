export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma"
import Link from "next/link"
import { IconPlus } from "@tabler/icons-react"
import Toast from "@/components/ui/Toast"
import { Suspense } from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin | Anuncios",
}

const TYPE_META: Record<string, { label: string; accent: string; dot: string }> = {
  PROMO:   { label: "Promoción",   accent: "bg-violet-50 text-violet-700 border-violet-200", dot: "bg-violet-400" },
  INFO:    { label: "Información", accent: "bg-sky-50 text-sky-700 border-sky-200",          dot: "bg-sky-400"    },
  WARNING: { label: "Aviso",       accent: "bg-amber-50 text-amber-700 border-amber-200",    dot: "bg-amber-400"  },
  CLOSED:  { label: "Cerrado",     accent: "bg-rose-50 text-rose-700 border-rose-200",       dot: "bg-rose-400"   },
}

function formatDate(date: Date | null | undefined) {
  if (!date) return null
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(new Date(date))
}

function getStatus(a: { isActive: boolean; startsAt: Date; endsAt: Date | null }) {
  const now = new Date()
  if (!a.isActive)                          return { label: "Inactivo",  cls: "text-stone-400" }
  if (a.endsAt && new Date(a.endsAt) < now) return { label: "Expirado",  cls: "text-stone-400" }
  if (new Date(a.startsAt) > now)           return { label: "Pendiente", cls: "text-amber-500" }
  return                                           { label: "Activo",    cls: "text-emerald-500" }
}

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { startsAt: "desc" },
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Suspense>
        <Toast message="Anuncio guardado correctamente"  type="success" triggerParam="edit" />
        <Toast message="Anuncio eliminado correctamente" type="success" triggerParam="deleted" />
      </Suspense>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-stone-400" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Admin</span>
          </div>
          <h1 className="font-titleText text-stone-900 uppercase text-4xl sm:text-5xl leading-none">
            Anuncios
          </h1>
        </div>
        <Link
          href="/admin/announcements/new"
          className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 text-[11px] uppercase tracking-[0.3em] font-semibold hover:opacity-90 active:opacity-75 transition-opacity duration-200"
        >
          <IconPlus size={13} />
          Nuevo anuncio
        </Link>
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3 mb-8">
        <span className="flex-1 h-px bg-stone-200" />
        <span className="w-1 h-1 rounded-full bg-stone-300" />
        <span className="flex-1 h-px bg-stone-200" />
      </div>

      {announcements.length === 0 && (
        <p className="text-[11px] uppercase tracking-[0.25em] text-stone-400 py-10 text-center">
          Sin anuncios registrados
        </p>
      )}

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {announcements.map((announcement) => {
          const meta   = TYPE_META[announcement.type]
          const status = getStatus(announcement)
          const desde  = formatDate(announcement.startsAt)
          const hasta  = formatDate(announcement.endsAt)

          return (
            <Link
              key={announcement.id}
              href={`/admin/announcements/${announcement.id}`}
              className="group relative flex flex-col bg-white border border-stone-200 hover:border-stone-800 hover:shadow-[4px_4px_0px_0px_#1c1917] transition-all duration-200 p-5 gap-4"
            >
              {/* Top row: tipo + status */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-medium border px-2.5 py-1 ${meta.accent}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                  {meta.label}
                </span>
                <span className={`text-[10px] uppercase tracking-[0.2em] font-semibold ${status.cls}`}>
                  {status.label}
                </span>
              </div>

              {/* Title */}
              <div className="flex-1">
                <p className="font-titleText text-stone-900 text-xl uppercase leading-tight group-hover:text-stone-700 transition-colors">
                  {announcement.title}
                </p>
                {announcement.message && (
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed line-clamp-2">
                    {announcement.message}
                  </p>
                )}
              </div>

              {/* Bottom: fechas */}
              <div className="flex items-end justify-between pt-3 border-t border-stone-100">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-stone-400">Desde</p>
                  <p className="text-[11px] text-stone-600 font-medium">{desde}</p>
                </div>
                <div className="text-right">
                  {hasta ? (
                    <>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-stone-400">Hasta</p>
                      <p className="text-[11px] text-stone-600 font-medium">{hasta}</p>
                    </>
                  ) : (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-stone-300">Sin expiración</span>
                  )}
                </div>
              </div>

              {/* Hover arrow */}
              <span className="absolute top-4 right-4 text-[9px] uppercase tracking-[0.2em] text-stone-300 group-hover:text-stone-600 transition-colors">
                Editar →
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}