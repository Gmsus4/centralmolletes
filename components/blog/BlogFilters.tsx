"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { IconEdit, IconEye, IconEyeOff, IconClock, IconArticle, IconSearch, IconX, IconChevronDown, IconArrowUp, IconArrowDown } from "@tabler/icons-react"
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
  published: { label: "Publicado", dot: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950" },
  draft:     { label: "Borrador",  dot: "bg-muted-foreground", text: "text-muted-foreground", bg: "bg-muted" },
  scheduled: { label: "Programado", dot: "bg-amber-400", text: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950" },
} as const

type Status = keyof typeof STATUS_CONFIG

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as Status] ?? STATUS_CONFIG.draft
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] uppercase tracking-[0.2em] font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
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

type DateRange = (typeof DATE_RANGES)[number]["value"]

function isWithinRange(date: Date, range: DateRange): boolean {
  if (range === "all") return true
  const now = Date.now()
  const days = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365
  return now - date.getTime() <= days * 24 * 60 * 60 * 1000
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BlogFilters({ posts }: { posts: Post[] }) {
  const [search,    setSearch]   = useState("")
  const [status,    setStatus]   = useState<Status | "all">("all")
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

  const filterBtn = (active: boolean) =>
    `inline-flex items-center gap-1.5 px-3 h-9 text-[9px] uppercase tracking-[0.2em] font-medium
     rounded-lg border transition-colors duration-150 whitespace-nowrap shrink-0
     ${active
       ? "bg-foreground border-foreground text-background"
       : "bg-background border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
     }`

  return (
    <>
      {/* ── Filter bar ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 mb-6">
        {/* Fila 1: Search */}
        <div className="relative w-full">
          <IconSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por título o subtítulo…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-8 pr-9 text-xs bg-background border border-border rounded-lg
                       text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40
                       transition-colors duration-150"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              <IconX size={12} />
            </button>
          )}
        </div>

        {/* Fila 2: Pills + fecha + sort */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status pills */}
          {(["all", "published", "draft", "scheduled"] as const).map((s) => {
            const isAll = s === "all"
            const cfg   = isAll ? null : STATUS_CONFIG[s]
            const active = status === s
            return (
              <button key={s} onClick={() => setStatus(s)} className={filterBtn(active)}>
                {!isAll && cfg && (
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? "bg-background/70" : cfg.dot}`} />
                )}
                {isAll ? "Todos" : cfg!.label}
              </button>
            )
          })}

          <span className="w-px h-5 bg-border shrink-0" />

          {/* Date range dropdown */}
          <div className="relative shrink-0">
            <button onClick={() => setDateOpen((v) => !v)} className={filterBtn(dateRange !== "all")}>
              <IconClock size={11} />
              {selectedDateLabel}
              <IconChevronDown size={10} className={`transition-transform duration-200 ${dateOpen ? "rotate-180" : ""}`} />
            </button>

            {dateOpen && (
              <div className="absolute left-0 top-full mt-1 z-20 bg-popover border border-border shadow-sm rounded-lg overflow-hidden min-w-[170px]">
                {DATE_RANGES.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setDateRange(opt.value)
                      setDateOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-[0.15em]
                                transition-colors duration-100
                                ${dateRange === opt.value
                                  ? "bg-foreground text-background"
                                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
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
            onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
            title={sortDir === "desc" ? "Más reciente primero" : "Más antiguo primero"}
            className={filterBtn(sortDir === "asc")}
          >
            {sortDir === "desc" ? (
              <><IconArrowDown size={11} /> Reciente</>
            ) : (
              <><IconArrowUp size={11} /> Antiguo</>
            )}
          </button>
        </div>
      </div>

      {/* ── Active filter summary + clear ───────────────────────────────── */}
      {hasFilters && (
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
            {search && (
              <>
                {" "}
                para <em className="not-italic font-medium text-foreground">"{search}"</em>
              </>
            )}
          </span>
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground
                       hover:text-foreground transition-colors border-b border-transparent hover:border-foreground/40 pb-px"
          >
            <IconX size={9} /> Limpiar filtros
          </button>
        </div>
      )}

      {/* ── Post list ───────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-3 border border-dashed border-border rounded-xl bg-background">
          <div className="w-10 h-10 rounded-full bg-muted grid place-items-center">
            <IconSearch size={16} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-xs">Sin resultados para los filtros aplicados</p>
          <button
            onClick={clearAll}
            className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground
                       border-b border-border hover:border-foreground/40 pb-px transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((post) => (
            <Link
              href={`/admin/blog/${post.id}`}
              key={post.id}
              className="group bg-card border border-border hover:border-foreground/40 rounded-xl transition-colors duration-200 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-stretch">
                {/* Cover */}
                <div className="w-full aspect-[16/7] sm:aspect-auto sm:w-36 shrink-0 overflow-hidden bg-muted relative">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full min-h-[80px] grid place-items-center">
                      <IconArticle size={24} className="text-muted-foreground" />
                    </div>
                  )}
                  {post.status !== "published" && (
                    <div className="absolute inset-0 bg-foreground/40 grid place-items-center">
                      {post.status === "draft"
                        ? <IconEyeOff size={18} className="text-background/80" />
                        : <IconClock   size={18} className="text-background/80" />
                      }
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 items-start sm:items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 min-w-0">
                  <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                    {/* Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <StatusBadge status={post.status ?? "published"} />
                      <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground bg-muted px-2 py-0.5 rounded-md shrink-0">
                        {post.category}
                      </span>
                    </div>

                    {/* Title */}
                    <span className="font-medium text-foreground text-sm leading-snug line-clamp-2 sm:line-clamp-1">
                      {post.title}
                    </span>

                    {/* Subtitle */}
                    {post.subtitle && (
                      <span className="text-xs text-muted-foreground line-clamp-2 sm:line-clamp-1">
                        {post.subtitle}
                      </span>
                    )}

                    {/* Meta description — solo desktop */}
                    {post.metaDescription && (
                      <span className="text-[10px] text-muted-foreground/60 line-clamp-1 italic hidden sm:block">
                        SEO: {post.metaDescription}
                      </span>
                    )}

                    {/* Meta row */}
                    <div className="flex items-center gap-2 flex-wrap mt-0.5">
                      <span className="text-[10px] font-mono text-muted-foreground/60 hidden sm:inline">{post.slug}</span>
                      <span className="text-[10px] text-muted-foreground/60 hidden sm:inline">·</span>
                      <span className="text-[10px] text-muted-foreground/60">
                        {new Date(post.publishedAt).toLocaleDateString("es-MX", {
                          day:   "numeric",
                          month: "short",
                          year:  "numeric",
                        })}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60">·</span>
                      <span className="text-[10px] text-muted-foreground/60">{post.readMins} min</span>
                      {post.author && (
                        <>
                          <span className="text-[10px] text-muted-foreground/60">·</span>
                          <span className="text-[10px] text-muted-foreground/60">{post.author}</span>
                        </>
                      )}
                      {post.tags.length > 0 && (
                        <>
                          <span className="text-[10px] text-muted-foreground/60 hidden sm:inline">·</span>
                          <span className="text-[10px] text-muted-foreground/60 hidden sm:inline">
                            {post.tags.slice(0, 3).join(", ")}
                            {post.tags.length > 3 ? ` +${post.tags.length - 3}` : ""}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}