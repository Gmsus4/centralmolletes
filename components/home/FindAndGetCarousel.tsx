// FindAndGetCarousel.tsx
"use client"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { CategoryItem } from "./FindAndGet"

export const FindAndGetCarousel = ({ categories }: { categories: CategoryItem[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" })
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      <button aria-label="Desplazar izquierda" onClick={() => scroll("left")}
        className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-bg-dark text-brand-primary flex items-center justify-center shadow-md hover:scale-105 transition-transform"
      >
        <IconChevronLeft size={18} />
      </button>

      <div ref={scrollRef} className="flex gap-6 overflow-x-auto scroll-smooth px-16 pb-4 no-scrollbar" style={{ scrollbarWidth: "none" }}>
        {categories.map((item, idx) => (
          <Link href={`/menu?category=${item.name}`} key={item.name} className="flex flex-col items-center gap-4 group shrink-0">
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden bg-brand-primary grid place-items-center shrink-0">
              <Image
                loading={idx < 3 ? "eager" : "lazy"} priority={idx === 0}
                width={400} height={400}
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

      <button aria-label="Desplazar derecha" onClick={() => scroll("right")}
        className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-brand-contrast text-brand-primary flex items-center justify-center shadow-md hover:scale-105 transition-transform"
      >
        <IconChevronRight size={18} />
      </button>

      <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-bg-body to-transparent z-[1]" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-bg-body to-transparent z-[1]" />
    </div>
  )
}