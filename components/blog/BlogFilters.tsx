"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  IconEdit, IconEye, IconEyeOff, IconClock, IconArticle,
  IconSearch, IconX, IconChevronDown, IconArrowUp, IconArrowDown,
} from "@tabler/icons-react"
import type { BlogSection } from "@/lib/validators/blog"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Post {
  id: string
  title: string
  subtitle: string | null
  slug: string
  status: string | null
  category: string
  coverImage: string | null
  publishedAt: Date
  author: string | null
  metaDescription: string | null
  tags: string[]
  sections: BlogSection[]
  readMins: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  published: { label: "Publicado",  dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  draft:     { label: "Borrador",   dot: "bg-stone-400",   text: "text-stone-500",   bg: "bg-stone-100"  },
  scheduled: { label: "Programado", dot: "bg-amber-400",   text: "text-amber-700",   bg: "bg-amber-50"   },
} as const

type Status = keyof typeof STATUS_CONFIG

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as Status] ?? STATUS_CONFIG.draft
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

// ─── Date range options ────────────────────────────────────────────────────────

const DATE_RANGES = [
  { label: "Cualquier fecha", value: "all" },
  { label: "Últimos 7 días",  value: "7d"  },
  { label: "Último mes",      value: "30d" },
  { label: "Últimos 3 meses", value: "90d" },
  { label: "Este año",        value: "1y"  },
] as const

type DateRange = typeof DATE_RANGES[number]["value"]

function isWithinRange(date: Date, range: DateRange): boolean {
  if (range === "all") return true
  const now  = Date.now()
  const days = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365
  return now - date.getTime() <= days * 24 * 60 * 60 * 1000
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BlogFilters({ posts }: { posts: Post[] }) {
  const [search,    setSearch]    = useState("")
  const [status,    setStatus]    = useState<Status | "all">("all")
  const [dateRange, setDateRange] = useState<DateRange>("all")
  const [dateOpen,  setDateOpen]  = useState(false)
  const [sortDir,   setSortDir]   = useState<"desc" | "asc">("desc")

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const result = posts.filter((p) => {
      if (q) {
        const inTitle    = p.title.toLowerCase().includes(q)
        const inSubtitle = p.subtitle?.toLowerCase().includes(q) ?? false
        if (!inTitle && !inSubtitle) return false
      }
      if (status !== "all" && p.status !== status) return false
      if (!isWithinRange(new Date(p.publishedAt), dateRange)) return false
      return true
    })
    return result.sort((a, b) => {
      const diff = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      return sortDir === "desc" ? -diff : diff
    })
  }, [posts, search, status, dateRange, sortDir])

  const hasFilters = search !== "" || status !== "all" || dateRange !== "all"

  function clearAll() {
    setSearch("")
    setStatus("all")
    setDateRange("all")
    setSortDir("desc")
  }

  const selectedDateLabel = DATE_RANGES.find((r) => r.value === dateRange)?.label ?? "Cualquier fecha"

  return (
    <>
      {/* ── Filter bar ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">

        {/* Search */}
        <div className="relative flex-1">
          <IconSearch
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Buscar por título o subtítulo…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-8 pr-9 text-xs bg-white border border-stone-200 text-stone-800
                       placeholder:text-stone-300 focus:outline-none focus:border-stone-400
                       transition-colors duration-150"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-600 transition-colors"
            >
              <IconX size={12} />
            </button>
          )}
        </div>

        {/* Status pills */}
        <div className="flex items-center gap-1 shrink-0">
          {(["all", "published", "draft", "scheduled"] as const).map((s) => {
            const isAll  = s === "all"
            const cfg    = isAll ? null : STATUS_CONFIG[s]
            const active = status === s
            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`inline-flex items-center gap-1.5 px-3 h-9 text-[9px] uppercase tracking-[0.2em] font-medium
                            border transition-colors duration-150
                            ${active
                              ? "bg-stone-900 border-stone-900 text-white"
                              : "bg-white border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-700"
                            }`}
              >
                {!isAll && cfg && (
                  <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-white/70" : cfg.dot}`} />
                )}
                {isAll ? "Todos" : cfg!.label}
              </button>
            )
          })}
        </div>

        {/* Date range dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setDateOpen((v) => !v)}
            className={`inline-flex items-center gap-2 px-3 h-9 text-[9px] uppercase tracking-[0.2em] font-medium
                        border transition-colors duration-150 w-full sm:w-auto
                        ${dateRange !== "all"
                          ? "bg-stone-900 border-stone-900 text-white"
                          : "bg-white border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-700"
                        }`}
          >
            <IconClock size={11} />
            {selectedDateLabel}
            <IconChevronDown
              size={10}
              className={`ml-auto transition-transform duration-200 ${dateOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dateOpen && (
            <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-stone-200 shadow-sm min-w-[170px]">
              {DATE_RANGES.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setDateRange(opt.value); setDateOpen(false) }}
                  className={`w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-[0.15em]
                              transition-colors duration-100
                              ${dateRange === opt.value
                                ? "bg-stone-900 text-white"
                                : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
                              }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort direction toggle */}
        <button
          onClick={() => setSortDir((d) => d === "desc" ? "asc" : "desc")}
          title={sortDir === "desc" ? "Ordenado: más reciente primero" : "Ordenado: más antiguo primero"}
          className={`inline-flex items-center gap-2 px-3 h-9 text-[9px] uppercase tracking-[0.2em] font-medium
                      border transition-colors duration-150 shrink-0
                      ${sortDir === "asc"
                        ? "bg-stone-900 border-stone-900 text-white"
                        : "bg-white border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-700"
                      }`}
        >
          {sortDir === "desc"
            ? <><IconArrowDown size={11} /> Reciente</>
            : <><IconArrowUp   size={11} /> Antiguo</>
          }
        </button>
      </div>

      {/* ── Active filter summary + clear ───────────────────────────────── */}
      {hasFilters && (
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] text-stone-400">
            {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
            {search && <> para <em className="not-italic font-medium text-stone-600">"{search}"</em></>}
          </span>
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] text-stone-400
                       hover:text-stone-700 transition-colors border-b border-transparent hover:border-stone-400 pb-px"
          >
            <IconX size={9} /> Limpiar filtros
          </button>
        </div>
      )}

      {/* ── Post list ───────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-3 border border-dashed border-stone-200 bg-white">
          <div className="w-10 h-10 rounded-full bg-stone-100 grid place-items-center">
            <IconSearch size={16} className="text-stone-300" />
          </div>
          <p className="text-stone-400 text-xs">Sin resultados para los filtros aplicados</p>
          <button
            onClick={clearAll}
            className="text-[9px] uppercase tracking-[0.2em] text-stone-400 hover:text-stone-700
                       border-b border-stone-200 hover:border-stone-500 pb-px transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((post) => (
            <div
              key={post.id}
              className="group bg-white border border-stone-200 hover:border-stone-300 transition-colors duration-200 overflow-hidden"
            >
              <div className="flex items-stretch">

                {/* Cover */}
                <div className="w-28 sm:w-36 shrink-0 overflow-hidden bg-stone-100 relative">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[96px] grid place-items-center">
                      <IconArticle size={20} className="text-stone-300" />
                    </div>
                  )}
                  {post.status !== "published" && (
                    <div className="absolute inset-0 bg-stone-900/40 grid place-items-center">
                      {post.status === "draft"
                        ? <IconEyeOff size={18} className="text-white/80" />
                        : <IconClock  size={18} className="text-white/80" />
                      }
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 items-center justify-between gap-4 px-5 py-4 min-w-0">
                  <div className="flex flex-col gap-1.5 min-w-0">

                    {/* Title + badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-stone-900 truncate">{post.title}</span>
                      <StatusBadge status={post.status ?? "published"} />
                      <span className="text-[9px] uppercase tracking-[0.2em] text-stone-400 bg-stone-100 px-2 py-0.5 shrink-0">
                        {post.category}
                      </span>
                    </div>

                    {/* Subtitle */}
                    <span className="text-xs text-stone-400 truncate max-w-full block">
                      {post.subtitle}
                    </span>

                    {/* Meta description */}
                    {post.metaDescription && (
                      <span className="text-[10px] text-stone-300 truncate max-w-full block italic">
                        SEO: {post.metaDescription}
                      </span>
                    )}

                    {/* Meta row */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[10px] font-mono text-stone-300">{post.slug}</span>
                      <span className="text-[10px] text-stone-300">
                        {new Date(post.publishedAt).toLocaleDateString("es-MX", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </span>
                      <span className="text-[10px] text-stone-300">{post.readMins} min</span>
                      {post.author && (
                        <span className="text-[10px] text-stone-300">por {post.author}</span>
                      )}
                      {post.tags.length > 0 && (
                        <span className="text-[10px] text-stone-300">
                          {post.tags.slice(0, 3).join(", ")}
                          {post.tags.length > 3 ? ` +${post.tags.length - 3}` : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {post.status !== "draft" && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 text-stone-400 hover:text-stone-700 transition-colors"
                        title="Ver en el sitio"
                      >
                        <IconEye size={15} />
                      </Link>
                    )}
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                      title="Editar"
                    >
                      <IconEdit size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}