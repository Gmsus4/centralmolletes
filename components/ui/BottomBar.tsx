"use client"

import { useEffect, useState, useCallback } from "react"
import { IconX, IconTag, IconBell, IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

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

  const handleDismiss = () => {
    setVisible(false)
    setTimeout(() => setDismissed(true), 350)
  }

  if (dismissed || items.length === 0) return null

  const current = items[index]
  const isPromo = current.kind === "promotion"
  const message = current.kind === "promotion" ? current.data.description : current.data.message
  const endsAt  = current.kind === "promotion" ? current.data.endsAt : (current.data.endsAt ?? null)

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-[1000]
        transition-all duration-500 ease-out
        ${visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
      `}
    >
      <div className={`relative overflow-hidden ${isPromo ? "bg-brand-primary" : "bg-bg-dark border-t border-brand-primary/15"}`}>

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

              {/* Title — no max-w, whitespace-nowrap para que no se comprima */}
              <p className={`text-[11px] font-black uppercase tracking-[0.12em] whitespace-nowrap flex-shrink-0 ${isPromo ? "text-brand-contrast" : "text-brand-primary"}`}>
                {current.data.title}
              </p>

              {/* Discount badge (promo) */}
              {current.kind === "promotion" && current.data.discount != null && (
                <span className="flex-shrink-0 px-2.5 py-0.5 rounded-full bg-brand-contrast text-brand-primary text-[10px] font-black tracking-wider">
                  -{current.data.discount}%
                </span>
              )}

              {/* Dot before message */}
              {message && (
                <span className={`flex-shrink-0 w-1 h-1 rounded-full ${isPromo ? "bg-brand-contrast" : "bg-brand-primary"}`} />
              )}

              {/* Message: description (promo) / body (announcement) — SIEMPRE visible */}
              {message && (
                <p className={`text-[12px] truncate flex-1 min-w-0 ${isPromo ? "text-brand-contrast font-bold" : "text-brand-primary/90"}`}>
                  {message}
                </p>
              )}

              {/* Products chips (promo, lg+) */}
              {current.kind === "promotion" && current.data.products.length > 0 && (
                <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0">
                  {current.data.products.slice(0, 2).map((p) => (
                    <span key={p.id} className="px-2 py-0.5 rounded-full bg-brand-contrast/10 text-brand-contrast/70 text-[9px] font-semibold uppercase tracking-wide whitespace-nowrap">
                      {p.name}
                    </span>
                  ))}
                  {current.data.products.length > 3 && (
                    <span className="px-2 py-0.5 rounded-full bg-brand-contrast/10 text-brand-contrast/70 text-[9px] font-semibold uppercase tracking-wide whitespace-nowrap">+{current.data.products.length - 3}</span>
                  )}
                </div>
              )}

              {/* Date range (sm+) */}
              <div className={`hidden sm:flex items-center gap-1 flex-shrink-0 text-[9px] font-mono uppercase tracking-wide ${isPromo ? "text-brand-contrast/90" : "text-brand-primary/90"}`}>
                <span>{fmt(current.data.startsAt)}</span>
                <span className={isPromo ? "text-brand-contrast/90" : "text-brand-primary/90"}>-</span>
                <span>{endsAt ? fmt(endsAt) : "sin fecha"}</span>
              </div>
            </div>

            {/* Pagination */}
            {items.length > 1 && (
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <button onClick={goPrev} className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-150 cursor-pointer ${isPromo ? "text-brand-contrast/80 hover:bg-brand-contrast/20 hover:text-brand-contrast" : "text-brand-primary/80 hover:bg-brand-primary/20 hover:text-brand-primary"}`} aria-label="Anterior">
                  <IconChevronLeft size={14} />
                </button>
                <div className="flex items-center gap-1 px-1">
                  {items.map((_, i) => (
                    <button key={i} onClick={() => setIndex(i)} className="cursor-pointer" aria-label={`Item ${i + 1}`}>
                      <span className={`block rounded-full transition-all duration-300 ${i === index ? (isPromo ? "w-4 h-[3px] bg-brand-contrast" : "w-4 h-[3px] bg-brand-primary/60") : (isPromo ? "w-[5px] h-[3px] bg-brand-contrast/20" : "w-[5px] h-[3px] bg-brand-primary/15")}`} />
                    </button>
                  ))}
                </div>
                <button onClick={goNext} className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-150 cursor-pointer ${isPromo ? "text-brand-contrast/80 hover:bg-brand-contrast/20 hover:text-brand-contrast" : "text-brand-primary/80 hover:bg-brand-primary/20 hover:text-brand-primary"}`} aria-label="Siguiente">
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

      <style>{`
        @keyframes progress-bar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  )
}