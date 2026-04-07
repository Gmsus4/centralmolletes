export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma"
import Link from "next/link"
import Toast from "@/components/ui/Toast"
import { Suspense } from "react"
import { Metadata } from "next"
import type { BlogSection } from "@/lib/validators/blog"
import BlogFilters from "@/components/blog/BlogFilters"
import { LayoutAdminSection } from "../components/LayoutAdminSection"
import { autoPublishScheduled } from "@/lib/blog"
import { EmptyState } from "@/components/ui/EmptyState"
import { IconArticle } from "@tabler/icons-react"

export const metadata: Metadata = {
  title: "Admin | Blog",
}

function readingTime(sections: BlogSection[]): number {
  const text = sections.map((s) => ("body" in s ? (s.body ?? "") : "")).join(" ")
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export default async function AdminBlogPage() {
  await autoPublishScheduled()
  const raw = await prisma.blog.findMany({ orderBy: { publishedAt: "desc" } })
  const posts = raw.map((p) => {
    const sections = JSON.parse(p.sections) as BlogSection[]
    return {
      ...p,
      tags: JSON.parse(p.tags) as string[],
      sections,
      readMins: readingTime(sections),
    }
  })

  const totalPublished = posts.filter((p) => p.status === "published").length
  const totalDraft = posts.filter((p) => p.status === "draft").length
  const totalScheduled = posts.filter((p) => p.status === "scheduled").length

  return (
    <>
      <LayoutAdminSection namePage="Artículos" maxWidth="max-w-6xl" link={{ label: "Nuevo artículo", href: "/admin/blog/new" }}>
        {/* Contadores por status */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-sm text-stone-400">
            {posts.length} {posts.length === 1 ? "artículo" : "artículos"}
          </span>
          {totalPublished > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              {totalPublished} publicado{totalPublished !== 1 ? "s" : ""}
            </span>
          )}
          {totalScheduled > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-amber-600">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              {totalScheduled} programado{totalScheduled !== 1 ? "s" : ""}
            </span>
          )}
          {totalDraft > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-stone-400">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400 shrink-0" />
              {totalDraft} borrador{totalDraft !== 1 ? "es" : ""}
            </span>
          )}
        </div>

        <div className="">
          <div className="max-w-6xl mx-auto py-6 sm:py-12">
            <Suspense>
              <Toast message="Artículo guardado correctamente" type="success" triggerParam="success" />
              <Toast message="Artículo eliminado correctamente" type="success" triggerParam="deleted" />
            </Suspense>

            {posts.length === 0 ? (
              <EmptyState
                icon={IconArticle}
                label="Tu blog está vacío"
                description="Aún no has redactado ninguna entrada. Comparte tus conocimientos y conecta con tu audiencia hoy mismo."
                actionLabel="Nuevo artículo"
                actionHref="/admin/blog/new"
                className="min-h-[420px]"
              />
            ) : (
              <BlogFilters posts={posts} />
            )}
          </div>
        </div>
      </LayoutAdminSection>
    </>
  )
}
