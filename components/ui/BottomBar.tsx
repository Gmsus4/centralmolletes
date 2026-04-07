"use client"

import { useEffect, useState, useCallback } from "react"
import { IconX, IconTag, IconBell, IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Product {
  id: string
  name: string
}

interface Promotion {
  id: string
  title: string
  description?: string | null
  discount?: number | null
  startsAt: string
  endsAt: string
  isActive: boolean
  products: Product[]
}

interface Announcement {
  id: string
  title: string
  message?: string | null
  startsAt: string
  endsAt?: string | null
  isActive: boolean
}

type BarItem =
  | { kind: "promotion"; data: Promotion }
  | { kind: "announcement"; data: Announcement }

const INTERVAL_MS = 30000

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })

export const BottomBar = () => {
  const [items, setItems]         = useState<BarItem[]>([])
  const [index, setIndex]         = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const [visible, setVisible]     = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const now = new Date()
    Promise.all([
      fetch("/api/promotions").then((r) => r.json()),
      fetch("/api/announcements").then((r) => r.json()),
    ]).then(([promos, announcements]: [Promotion[], Announcement[]]) => {
      const activePromos: BarItem[] = promos
        .filter((p) => p.isActive && new Date(p.startsAt) <= now && new Date(p.endsAt) >= now)
        .map((p) => ({ kind: "promotion" as const, data: p }))

      const activeAnnouncements: BarItem[] = announcements
        .filter((a) => {
          if (!a.isActive) return false
          if (new Date(a.startsAt) > now) return false
          if (a.endsAt && new Date(a.endsAt) < now) return false
          return true
        })
        .map((a) => ({ kind: "announcement" as const, data: a }))

      const merged = [...activePromos, ...activeAnnouncements]
      setItems(merged)
      if (merged.length > 0) setTimeout(() => setVisible(true), 100)
    }).catch(console.error)
  }, [])

  const goNext = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length])
  const goPrev = () => setIndex((i) => (i - 1 + items.length) % items.length)

  useEffect(() => {
    if (items.length <= 1) return
    const t = setInterval(goNext, INTERVAL_MS)
    return () => clearInterval(t)
  }, [items.length, goNext])

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    setVisible(false)
    setTimeout(() => setDismissed(true), 350)
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    goPrev()
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    goNext()
  }

  const handleDotClick = (e: React.MouseEvent, i: number) => {
    e.stopPropagation()
    setIndex(i)
  }

  if (dismissed || items.length === 0) return null

  const current = items[index]
  const isPromo = current.kind === "promotion"
  const message = current.kind === "promotion" ? current.data.description : current.data.message
  const endsAt  = current.kind === "promotion" ? current.data.endsAt : (current.data.endsAt ?? null)

  return (
    <>
      {/* ── Bar ── */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-[1000]
          transition-all duration-500 ease-out
          ${visible && !modalOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
        `}
      >
        <div
          onClick={() => setModalOpen(true)}
          className={`
            relative overflow-hidden cursor-pointer
            group
            ${isPromo ? "bg-brand-primary" : "bg-bg-dark border-t border-brand-primary/15"}
          `}
        >
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-200 pointer-events-none" />

          {!isPromo && (
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/25 to-transparent" />
          )}
          {isPromo && (
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.035]"
              style={{
                backgroundImage: "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)",
                backgroundSize: "8px 8px",
              }}
            />
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-3 py-3 min-h-[52px]">

              {/* Icon + label */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isPromo ? "bg-brand-contrast/15" : "bg-brand-primary/10"}`}>
                  {isPromo
                    ? <IconTag size={13} className="text-brand-contrast" />
                    : <IconBell size={13} className="text-brand-primary" />
                  }
                </span>
                <span className={`hidden mt-1 sm:block text-[9px] font-bold uppercase tracking-[0.28em] flex-shrink-0 ${isPromo ? "text-brand-contrast" : "text-brand-primary"}`}>
                  {isPromo ? "Promo" : "Aviso"}
                </span>
              </div>

              <span className={`hidden sm:block w-px h-4 flex-shrink-0 ${isPromo ? "bg-brand-contrast" : "bg-brand-primary"}`} />

              {/* Content row */}
              <div className="flex-1 min-w-0 flex items-center gap-2 overflow-hidden">
                <p className={`text-[11px] font-black uppercase tracking-[0.12em] whitespace-nowrap flex-shrink-0 ${isPromo ? "text-brand-contrast" : "text-brand-primary"}`}>
                  {current.data.title}
                </p>

                {current.kind === "promotion" && current.data.discount != null && (
                  <span className="flex-shrink-0 px-2.5 py-0.5 rounded-full bg-brand-contrast text-brand-primary text-[10px] font-black tracking-wider">
                    -{current.data.discount}%
                  </span>
                )}

                {message && (
                  <span className={`flex-shrink-0 w-1 h-1 rounded-full ${isPromo ? "bg-brand-contrast" : "bg-brand-primary"}`} />
                )}

                {message && (
                  <p className={`text-[12px] truncate flex-1 min-w-0 ${isPromo ? "text-brand-contrast font-bold" : "text-brand-primary/90"}`}>
                    {message}
                  </p>
                )}

                {current.kind === "promotion" && current.data.products.length > 0 && (
                  <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0">
                    {current.data.products.slice(0, 2).map((p) => (
                      <span key={p.id} className="px-2 py-0.5 rounded-full bg-brand-contrast/10 text-brand-contrast/70 text-[9px] font-semibold uppercase tracking-wide whitespace-nowrap">
                        {p.name}
                      </span>
                    ))}
                    {current.data.products.length > 3 && (
                      <span className="px-2 py-0.5 rounded-full bg-brand-contrast/10 text-brand-contrast/70 text-[9px] font-semibold uppercase tracking-wide whitespace-nowrap">
                        +{current.data.products.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className={`hidden sm:flex items-center gap-1 flex-shrink-0 text-[9px] font-mono uppercase tracking-wide ${isPromo ? "text-brand-contrast/90" : "text-brand-primary/90"}`}>
                  <span>{fmt(current.data.startsAt)}</span>
                  <span>-</span>
                  <span>{endsAt ? fmt(endsAt) : "sin fecha"}</span>
                </div>
              </div>

              {/* "Ver más" hint */}
              <span className={`hidden sm:block text-[9px] font-bold uppercase tracking-widest flex-shrink-0 underline underline-offset-2 opacity-50 group-hover:opacity-100 transition-opacity ${isPromo ? "text-brand-contrast" : "text-brand-primary"}`}>
                Ver más
              </span>

              {/* Pagination */}
              {items.length > 1 && (
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <button onClick={handlePrev} className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-150 cursor-pointer ${isPromo ? "text-brand-contrast/80 hover:bg-brand-contrast/20 hover:text-brand-contrast" : "text-brand-primary/80 hover:bg-brand-primary/20 hover:text-brand-primary"}`} aria-label="Anterior">
                    <IconChevronLeft size={14} />
                  </button>
                  <div className="flex items-center gap-1 px-1">
                    {items.map((_, i) => (
                      <button key={i} onClick={(e) => handleDotClick(e, i)} className="cursor-pointer" aria-label={`Item ${i + 1}`}>
                        <span className={`block rounded-full transition-all duration-300 ${i === index ? (isPromo ? "w-4 h-[3px] bg-brand-contrast" : "w-4 h-[3px] bg-brand-primary/60") : (isPromo ? "w-[5px] h-[3px] bg-brand-contrast/20" : "w-[5px] h-[3px] bg-brand-primary/15")}`} />
                      </button>
                    ))}
                  </div>
                  <button onClick={handleNext} className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-150 cursor-pointer ${isPromo ? "text-brand-contrast/80 hover:bg-brand-contrast/20 hover:text-brand-contrast" : "text-brand-primary/80 hover:bg-brand-primary/20 hover:text-brand-primary"}`} aria-label="Siguiente">
                    <IconChevronRight size={14} />
                  </button>
                </div>
              )}

              {/* Close */}
              <button onClick={handleDismiss} className={`w-7 h-7 flex items-center justify-center rounded-full flex-shrink-0 transition-colors duration-150 cursor-pointer ${isPromo ? "text-brand-contrast/80 hover:bg-brand-contrast/20 hover:text-brand-contrast" : "text-brand-primary/80 hover:bg-brand-primary/20 hover:text-brand-primary"}`} aria-label="Cerrar">
                <IconX size={14} />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          {items.length > 1 && (
            <div className={`h-[2px] w-full ${isPromo ? "bg-brand-contrast/10" : "bg-brand-primary/8"}`}>
              <div key={index} className={`h-full rounded-full ${isPromo ? "bg-brand-contrast/40" : "bg-brand-primary/30"}`} style={{ animation: `progress-bar ${INTERVAL_MS}ms linear forwards` }} />
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className={`
            max-w-md w-full overflow-hidden p-0 gap-0
            border-0 shadow-2xl [&>button:last-of-type]:hidden
            ${isPromo
              ? "bg-brand-primary text-brand-contrast"
              : "bg-bg-dark border border-brand-primary/20"
            }
          `}
        >
          {isPromo && (
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{
                backgroundImage: "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)",
                backgroundSize: "8px 8px",
              }}
            />
          )}
          {!isPromo && (
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent" />
          )}

          <DialogHeader className="relative px-6 pt-6 pb-0">
            <div className="flex items-center gap-3">
              <span className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isPromo ? "bg-brand-contrast/15" : "bg-brand-primary/10"}`}>
                {isPromo
                  ? <IconTag size={16} className="text-brand-contrast" />
                  : <IconBell size={16} className="text-brand-primary" />
                }
              </span>
              <div className="flex flex-col gap-0.5">
                <span className={`text-[9px] font-bold uppercase tracking-[0.3em] ${isPromo ? "text-brand-contrast/70" : "text-brand-primary/60"}`}>
                  {isPromo ? "Promoción" : "Aviso"}
                </span>
                <DialogTitle className={`text-base font-black uppercase tracking-wide leading-tight ${isPromo ? "text-brand-contrast" : "text-brand-primary"}`}>
                  {current.data.title}
                </DialogTitle>
              </div>
              {current.kind === "promotion" && current.data.discount != null && (
                <Badge className="ml-auto flex-shrink-0 bg-brand-contrast text-brand-primary text-xs font-black px-3 py-1 rounded-full border-0">
                  -{current.data.discount}%
                </Badge>
              )}
            </div>
          </DialogHeader>

          <div className="relative px-6 py-5 flex flex-col gap-4">
            {message && (
              <DialogDescription className={`text-sm leading-relaxed ${isPromo ? "text-brand-contrast/90 font-medium" : "text-brand-primary/80"}`}>
                {message}
              </DialogDescription>
            )}

            {current.kind === "promotion" && current.data.products.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {current.data.products.slice(0, 5).map((p) => (
                  <span key={p.id} className="px-2.5 py-1 rounded-full bg-brand-contrast/10 text-brand-contrast/70 text-[10px] font-semibold uppercase tracking-wide">
                    {p.name}
                  </span>
                ))}
                {current.data.products.length > 5 && (
                  <span className="px-2.5 py-1 rounded-full bg-brand-contrast/10 text-brand-contrast/70 text-[10px] font-semibold uppercase tracking-wide">
                    +{current.data.products.length - 5}
                  </span>
                )}
              </div>
            )}

            <div className={`flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest ${isPromo ? "text-brand-contrast/60" : "text-brand-primary/50"}`}>
              <span>{fmt(current.data.startsAt)}</span>
              <span>—</span>
              <span>{endsAt ? fmt(endsAt) : "sin fecha"}</span>
            </div>
          </div>

          <div className={`relative px-6 py-4 flex items-center justify-between border-t ${isPromo ? "border-brand-contrast/10" : "border-brand-primary/10"}`}>
            {items.length > 1 ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={goPrev}
                  className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors cursor-pointer ${isPromo ? "text-brand-contrast/60 hover:bg-brand-contrast/15 hover:text-brand-contrast" : "text-brand-primary/60 hover:bg-brand-primary/15 hover:text-brand-primary"}`}
                  aria-label="Anterior"
                >
                  <IconChevronLeft size={14} />
                </button>
                <div className="flex items-center gap-1 px-1">
                  {items.map((_, i) => (
                    <button key={i} onClick={() => setIndex(i)} className="cursor-pointer" aria-label={`Item ${i + 1}`}>
                      <span className={`block rounded-full transition-all duration-300 ${i === index ? (isPromo ? "w-5 h-[3px] bg-brand-contrast" : "w-5 h-[3px] bg-brand-primary/70") : (isPromo ? "w-[5px] h-[3px] bg-brand-contrast/20" : "w-[5px] h-[3px] bg-brand-primary/20")}`} />
                    </button>
                  ))}
                </div>
                <button
                  onClick={goNext}
                  className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors cursor-pointer ${isPromo ? "text-brand-contrast/60 hover:bg-brand-contrast/15 hover:text-brand-contrast" : "text-brand-primary/60 hover:bg-brand-primary/15 hover:text-brand-primary"}`}
                  aria-label="Siguiente"
                >
                  <IconChevronRight size={14} />
                </button>
                <span className={`ml-2 text-[10px] font-mono ${isPromo ? "text-brand-contrast/40" : "text-brand-primary/40"}`}>
                  {index + 1}/{items.length}
                </span>
              </div>
            ) : (
              <div />
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setModalOpen(false)}
              className={`text-[11px] font-bold uppercase tracking-widest rounded-full px-4 cursor-pointer ${isPromo ? "text-brand-contrast/70 hover:bg-brand-contrast/15 hover:text-brand-contrast" : "text-brand-primary/70 hover:bg-brand-primary/15 hover:text-brand-primary"}`}
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes progress-bar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </>
  )
}