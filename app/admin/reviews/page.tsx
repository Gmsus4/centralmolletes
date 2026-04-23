export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma"
import { Suspense } from "react"
import { Metadata } from "next"
import Toast from "@/components/ui/Toast"
import { LayoutAdminSection } from "../components/LayoutAdminSection"
import { EmptyState } from "@/components/ui/EmptyState"
import { IconStar, IconEye, IconEyeOff } from "@tabler/icons-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Admin | Reseñas",
}

const STAR = "★"

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({ orderBy: { order: "asc" } })

  const totalVisible = reviews.filter((r) => r.status === "visible").length
  const totalHidden  = reviews.filter((r) => r.status === "hidden").length

  return (
    <>
      <LayoutAdminSection
        namePage="Reseñas"
        maxWidth="max-w-4xl"
        link={{ label: "Nueva reseña", href: "/admin/reviews/new" }}
      >
        {/* Contadores */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-sm text-muted-foreground">
            {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"}
          </span>
          {totalVisible > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              {totalVisible} visible{totalVisible !== 1 ? "s" : ""}
            </span>
          )}
          {totalHidden > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />
              {totalHidden} oculta{totalHidden !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="max-w-4xl mx-auto py-6 sm:py-12">
          <Suspense>
            <Toast message="Reseña guardada correctamente"  type="success" triggerParam="success" />
            <Toast message="Reseña eliminada correctamente" type="success" triggerParam="deleted" />
          </Suspense>

          {reviews.length === 0 ? (
            <EmptyState
              icon={IconStar}
              label="Sin reseñas todavía"
              description="Agrega testimonios de clientes para mostrarlos en tu sitio web."
              actionLabel="Nueva reseña"
              actionHref="/admin/reviews/new"
              className="min-h-[420px]"
            />
          ) : (
            <div className="flex flex-col gap-3">
              {reviews.map((review) => (
                <Link
                  key={review.id}
                  href={`/admin/reviews/${review.id}`}
                  className="group flex rounded-2xl items-start gap-4 p-5 bg-card border border-border hover:border-foreground/40 transition-colors"
                >
                  {/* Foto */}
                  <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-muted border border-border">
                    {review.photo ? (
                      <img
                        src={review.photo}
                        alt={review.author}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-lg font-medium uppercase">
                        {review.author.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-foreground truncate">
                        {review.author}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate">
                        {review.role}
                      </span>
                    </div>

                    {/* Estrellas */}
                    <div className="flex gap-0.5 mb-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${i < review.rating ? "text-amber-400" : "text-border"}`}
                        >
                          {STAR}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">{review.body}</p>
                  </div>

                  {/* Status + orden */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                      className={`flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] px-2 py-1 ${
                        review.status === "visible"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {review.status === "visible" ? (
                        <IconEye size={10} />
                      ) : (
                        <IconEyeOff size={10} />
                      )}
                      {review.status === "visible" ? "Visible" : "Oculta"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">#{review.order}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </LayoutAdminSection>
    </>
  )
}