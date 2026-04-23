export const dynamic = "force-dynamic"

import Link from "next/link"
import prisma from "@/lib/prisma"
import { IconCheck, IconPaint } from "@tabler/icons-react"
import { Suspense } from "react"
import Toast from "@/components/ui/Toast"
import { Metadata } from "next"
import { EmptyState } from "@/components/ui/EmptyState"
import { LayoutAdminSection } from "../components/LayoutAdminSection"

export const metadata: Metadata = {
  title: "Admin | Temas",
}

export default async function ThemesPage() {
  const themes = await prisma.theme.findMany({
    orderBy: { createdAt: "asc" },
  })

  return (
    <>
      <LayoutAdminSection namePage="Themes" maxWidth="max-w-6xl" link={{ label: "Nuevo tema", href: "/admin/theme/new" }}>
        <Suspense>
          <Toast message="Tema activado" type="success" triggerParam="activated" />
          <Toast message="Tema eliminado correctamente" type="success" triggerParam="deleted" />
          <Toast message="Tema agregado correctamente" type="success" triggerParam="add" />
          <Toast message="Tema editado correctamente" type="success" triggerParam="edit" />
        </Suspense>

        {themes.length === 0 ? (
          <EmptyState
            icon={IconPaint}
            label="Usando tema predeterminado"
            description="Tu página tiene el estilo estándar. Dale un toque único personalizando los colores, tipografías y el logo de tu negocio."
            actionLabel="Personalizar diseño"
            actionHref="/admin/theme/new"
            className="min-h-[420px]"
          />
        ) : (
          <div className="grid gap-3">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className={`relative flex items-center justify-between gap-4 px-5 py-4 border transition-colors ${
                  theme.isActive
                    ? "border-foreground bg-muted"
                    : "border-border bg-background hover:border-foreground/40"
                }`}
              >
                {/* Indicador activo — barra izquierda */}
                {theme.isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-foreground" />
                )}

                <div className="flex items-center gap-4">
                  {/* Preview de colores */}
                  <div
                    className="w-10 h-10 flex-shrink-0 border border-border"
                    style={{
                      background: `linear-gradient(135deg, ${theme.brandPrimary} 50%, ${theme.brandContrast} 50%)`,
                      borderRadius: theme.radius,
                    }}
                  />

                  {/* Info */}
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{theme.name}</span>
                      {theme.isActive && (
                        <span className="flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 dark:text-green-400 dark:bg-green-950 dark:border-green-800">
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
                            className="w-3 h-3 rounded-full border border-border"
                            style={{ background: color }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {theme.fontTitle.split(",")[0]} / {theme.fontBody.split(",")[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acción */}
                <Link
                  href={`/admin/theme/${theme.id}`}
                  className="shrink-0 text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground border-b border-border hover:border-foreground pb-px transition-colors"
                >
                  Editar
                </Link>
              </div>
            ))}
          </div>
        )}
      </LayoutAdminSection>
    </>
  )
}