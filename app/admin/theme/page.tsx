export const dynamic = "force-dynamic"

import Link from "next/link"
import prisma from "@/lib/prisma"
import { IconPlus, IconCheck } from "@tabler/icons-react"
import { Suspense } from "react"
import Toast from "@/components/ui/Toast"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin | Temas",
}

export default async function ThemesPage() {
  const themes = await prisma.theme.findMany({
    orderBy: { createdAt: "asc" },
  })

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Suspense>
         <Toast message="Tema activado" type="success" triggerParam="activated"/>
         <Toast message="Tema eliminado correctamente" type="success" triggerParam="deleted"/>
         <Toast message="Tema agregado correctamente" type="success" triggerParam="add"/>
         <Toast message="Tema editado correctamente" type="success" triggerParam="edit"/>
      </Suspense>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-stone-400" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Admin</span>
          </div>
          <h1 className="font-titleText text-stone-900 uppercase text-4xl sm:text-5xl leading-none">
            Themes
          </h1>
        </div>

        <Link
          href="/admin/theme/new"
          className="flex items-center gap-2 bg-stone-900 text-white px-5 py-3 text-[11px] uppercase tracking-[0.3em] font-semibold hover:opacity-90 transition-opacity"
        >
          <IconPlus size={14} />
          Nuevo tema
        </Link>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-8">
        <span className="flex-1 h-px bg-stone-200" />
        <span className="w-1 h-1 rounded-full bg-stone-300" />
        <span className="flex-1 h-px bg-stone-200" />
      </div>

      {/* Lista */}
      {themes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-stone-400 text-sm tracking-wide">No hay themes registrados.</p>
          <Link
            href="/admin/theme/new"
            className="mt-4 inline-block text-[10px] uppercase tracking-[0.25em] text-stone-500 hover:text-stone-900 border-b border-stone-300 hover:border-stone-900 pb-px transition-colors"
          >
            Agregar el primero
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`relative flex items-center justify-between gap-4 px-5 py-4 border transition-colors ${
                theme.isActive
                  ? "border-stone-900 bg-stone-50"
                  : "border-stone-200 bg-white hover:border-stone-300"
              }`}
            >
              {/* Indicador activo — barra izquierda */}
              {theme.isActive && (
                <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-stone-900" />
              )}

              <div className="flex items-center gap-4">
                {/* Preview de colores */}
                <div
                  className="w-10 h-10 flex-shrink-0 border border-stone-200"
                  style={{
                    background: `linear-gradient(135deg, ${theme.brandPrimary} 50%, ${theme.brandContrast} 50%)`,
                    borderRadius: theme.radius,
                  }}
                />

                {/* Info */}
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-stone-900">{theme.name}</span>
                    {theme.isActive && (
                      <span className="flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5">
                        <IconCheck size={9} strokeWidth={2.5} />
                        Activo
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Swatches */}
                    <div className="flex items-center gap-1">
                      {[theme.bgBody, theme.brandPrimary, theme.brandContrast, theme.textMuted, theme.bgDark].map((color, i) => (
                        <span
                          key={i}
                          className="w-3 h-3 rounded-full border border-stone-200"
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-stone-400">
                      {theme.fontTitle.split(",")[0]} / {theme.fontBody.split(",")[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Acción */}
              <Link
                href={`/admin/theme/${theme.id}`}
                className="shrink-0 text-[10px] uppercase tracking-[0.25em] text-stone-400 hover:text-stone-900 border-b border-stone-200 hover:border-stone-900 pb-px transition-colors"
              >
                Editar
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}