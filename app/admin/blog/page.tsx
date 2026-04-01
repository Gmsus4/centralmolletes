export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma"
import Link from "next/link"
import { IconPlus } from "@tabler/icons-react"
import Toast from "@/components/ui/Toast"
import { Suspense } from "react"
import { Metadata } from "next"
import type { BlogSection } from "@/lib/validators/blog"
import BlogFilters from "@/components/blog/BlogFilters"

export const metadata: Metadata = {
  title: "Admin | Blog",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readingTime(sections: BlogSection[]): number {
  const text  = sections.map((s) => ("body" in s ? (s.body ?? "") : "")).join(" ")
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminBlogPage() {
  const raw   = await prisma.blog.findMany({ orderBy: { publishedAt: "desc" } })
  const posts = raw.map((p) => {
    const sections = JSON.parse(p.sections) as BlogSection[]
    return {
      ...p,
      tags:     JSON.parse(p.tags) as string[],
      sections,
      readMins: readingTime(sections),
    }
  })

  const totalPublished = posts.filter((p) => p.status === "published").length
  const totalDraft     = posts.filter((p) => p.status === "draft").length
  const totalScheduled = posts.filter((p) => p.status === "scheduled").length

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Suspense>
          <Toast message="Artículo guardado correctamente"  type="success" triggerParam="success" />
          <Toast message="Artículo eliminado correctamente" type="success" triggerParam="deleted" />
        </Suspense>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-stone-400" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400">Admin · Blog</span>
            </div>
            <h1 className="font-titleText text-stone-900 uppercase text-4xl sm:text-5xl leading-none">
              Artículos
            </h1>
            {/* Contadores por status */}
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="text-sm text-stone-400">
                {posts.length} {posts.length === 1 ? "artículo" : "artículos"}
              </span>
              {totalPublished > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {totalPublished} publicado{totalPublished !== 1 ? "s" : ""}
                </span>
              )}
              {totalScheduled > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-amber-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {totalScheduled} programado{totalScheduled !== 1 ? "s" : ""}
                </span>
              )}
              {totalDraft > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-stone-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                  {totalDraft} borrador{totalDraft !== 1 ? "es" : ""}
                </span>
              )}
            </div>
          </div>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 bg-stone-900 text-white px-5 py-3 text-[11px] uppercase tracking-[0.3em] font-semibold hover:bg-stone-700 transition-colors duration-200"
          >
            <IconPlus size={14} strokeWidth={2.5} /> Nuevo artículo
          </Link>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-8">
          <span className="flex-1 h-px bg-stone-200" />
          <span className="w-1 h-1 rounded-full bg-stone-300" />
          <span className="flex-1 h-px bg-stone-200" />
        </div>

        {/* Filters + List (client) */}
        {posts.length === 0 ? (
          <div className="py-32 flex flex-col items-center gap-4 border border-dashed border-stone-200 bg-white">
            <div className="w-12 h-12 rounded-full bg-stone-100 grid place-items-center">
              <span className="text-stone-400 text-xl">✦</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-stone-600 text-sm font-medium">Sin artículos</p>
              <p className="text-stone-400 text-xs">Crea tu primer artículo de blog</p>
            </div>
            <Link
              href="/admin/blog/new"
              className="mt-2 text-[10px] uppercase tracking-[0.2em] text-stone-500 hover:text-stone-900 border-b border-stone-300 hover:border-stone-900 pb-px transition-colors"
            >
              Crear primero
            </Link>
          </div>
        ) : (
          <BlogFilters posts={posts} />
        )}
      </div>
    </div>
  )
}