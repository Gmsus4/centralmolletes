"use client"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

export type CategoryItem = {
  name: string
  img: string
}

type Props = {
  categories: CategoryItem[]
}

export const FindAndGet = ({ categories }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" })
  }

  return (
    <div className="bg-bg-body w-full py-16 md:py-24 flex flex-col items-center gap-10 md:gap-14 overflow-hidden">

      {/* Título */}
      <div className="flex flex-col items-center gap-3 px-6 text-center">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px bg-bg-dark/25" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-text-main/90">Menú completo</span>
          <span className="w-8 h-px bg-bg-dark/25" />
        </div>
        <h2 className="text-text-titles font-title text-3xl md:text-6xl leading-tight">
          ¿Qué se te <br className="hidden xs:block" /> antoja hoy?
        </h2>
      </div>

      {/* Carrusel */}
      <div className="relative w-full max-w-7xl mx-auto">
        <button
          aria-label="Desplazar izquierda"
          onClick={() => scroll("left")}
          className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-bg-dark text-brand-primary flex items-center justify-center shadow-md hover:scale-105 transition-transform"
        >
          <IconChevronLeft size={18} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth px-16 pb-4 no-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((item, idx) => (
            <Link
              href={`/menu?category=${item.name}`}
              key={item.name}
              className="flex flex-col items-center gap-4 group shrink-0"
            >
              <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden bg-brand-primary grid place-items-center shrink-0">
                <Image
                  loading={idx < 3 ? "eager" : "lazy"}
                  priority={idx === 0}
                  width={400}
                  height={400}
                  sizes="(max-width: 768px) 144px, 192px"
                  src={item.img || "/placeholder.webp"}
                  className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
                  alt={item.name}
                />
              </div>
              <h3 className="text-bg-dark text-lg md:text-xl font-bold font-title group-hover:text-text-main/80 transition-colors text-center">
                {item.name}
              </h3>
            </Link>
          ))}
        </div>

        <button
          aria-label="Desplazar derecha"
          onClick={() => scroll("right")}
          className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-brand-contrast text-brand-primary flex items-center justify-center shadow-md hover:scale-105 transition-transform"
        >
          <IconChevronRight size={18} />
        </button>

        <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-bg-body to-transparent z-[1]" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-bg-body to-transparent z-[1]" />
      </div>

      <Link
        href="/menu"
        className="text-[11px] uppercase tracking-[0.25em] text-text-main hover:text-text-main/90 transition-colors flex items-center gap-2"
      >
        <span className="w-6 h-px bg-bg-dark/60" />
          Ver menú completo
        <span className="w-6 h-px bg-bg-dark/60" />
      </Link>
    </div>
  )
}