// admin/site-images/SiteImageList.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconChevronUp, IconChevronDown } from "@tabler/icons-react"
import { SiteImage } from "@/app/generated/prisma/client"

export function SiteImageList({ images }: { images: SiteImage[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const move = async (id: string, currentOrder: number, direction: "up" | "down") => {
    const sorted = [...images].sort((a, b) => a.order - b.order)
    const idx = sorted.findIndex((img) => img.id === id)

    const neighborIdx = direction === "up" ? idx - 1 : idx + 1
    const neighbor = sorted[neighborIdx]
    if (!neighbor) return

    setLoading(id)
    await Promise.all([
      fetch(`/api/site-images/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: neighbor.order }) }),
      fetch(`/api/site-images/${neighbor.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: currentOrder }) }),
    ])
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {images.map((img) => (
        <div key={img.id} className="relative border border-stone-200 hover:border-stone-400 transition-colors overflow-hidden bg-stone-50 group">
          {/* Botones fuera del Link */}
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-0.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                move(img.id, img.order, "up")
              }}
              disabled={!!loading || img.order === Math.min(...images.map((i) => i.order))}
              className="p-1 bg-white/90 border border-stone-200 hover:border-stone-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <IconChevronUp size={12} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                move(img.id, img.order, "down")
              }}
              disabled={!!loading || img.order === Math.max(...images.map((i) => i.order))}
              className="p-1 bg-white/90 border border-stone-200 hover:border-stone-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <IconChevronDown size={12} />
            </button>
          </div>

          {/* Link solo en la imagen y texto */}
          <Link href={`/admin/site-images/${img.id}`}>
            <div className="aspect-[4/3] overflow-hidden">
              <img src={img.src} alt={img.alt || img.section} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-2.5">
              <p className="text-[10px] uppercase tracking-[0.15em] text-stone-500 truncate">Orden: {img.order}</p>
              {img.alt && <p className="text-[11px] text-stone-400 truncate mt-0.5">{img.alt}</p>}
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
