"use client"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { tagColors } from "@/lib/tagColors"
import { Button } from "../ui/Button"
import { getCategoryExtras } from "@/data/menuCategoryExtra"
import ExtrasBadge from "../ui/ExtrasBadge"
import Image from "next/image"

export type MenuProduct = {
  slug: string
  name: string
  price: number
  category: string
  tag?: string | null
  img: string
  desc: string
  descLong: string
  ingredients: string[]
  allergens: string[]
  weight: string
  prepTime: string
  availability: "DAY" | "NIGHT" | "BOTH"
  originalPrice?: number
}

export type MenuCategory = {
  name: string
  emoji: string
  order: number
}

type TimeFilter = "DAY" | "NIGHT"

type Props = {
  products: MenuProduct[]
  categories: MenuCategory[]
}

export const MenuComponent = ({ products, categories }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const allCategories = [{ name: "Todos", emoji: "✦", order: 0 }, ...categories]

  const categoryParam = searchParams.get("category")
  const timeParam = searchParams.get("time") as TimeFilter | null

  const ofertasParam = searchParams.get("ofertas")
  const showOfertas = ofertasParam === "true"

  const active = allCategories.some((c) => c.name === categoryParam) ? categoryParam! : "Todos"

  const time: TimeFilter = timeParam === "NIGHT" ? "NIGHT" : "DAY"

  const handleFilter = (cat: string) => {
    window.scrollTo({ top: 0, behavior: "instant" })
    const params = new URLSearchParams(searchParams.toString())
    if (cat === "Todos") params.delete("category")
    else params.set("category", cat)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const handleTime = (t: TimeFilter) => {
    window.scrollTo({ top: 0, behavior: "instant" })
    const params = new URLSearchParams(searchParams.toString())
    params.set("time", t)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const handleOfertas = () => {
    window.scrollTo({ top: 0, behavior: "instant" })
    const params = new URLSearchParams(searchParams.toString())
    if (showOfertas) params.delete("ofertas")
    else params.set("ofertas", "true")
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const getEmoji = (name: string) => allCategories.find((c) => c.name === name)?.emoji ?? "•"

  // Filtrar por disponibilidad según time
  const byTime = products.filter((p) => p.availability === "BOTH" || p.availability === time)

  const byOferta = showOfertas ? byTime.filter((p) => p.originalPrice !== undefined) : byTime

  const sorted = [...byOferta].sort((a, b) => {
    const orderA = categories.find((c) => c.name === a.category)?.order ?? 99
    const orderB = categories.find((c) => c.name === b.category)?.order ?? 99
    return orderA - orderB
  })

  const filtered = active === "Todos" ? sorted : sorted.filter((p) => p.category === active)

  const grouped = filtered.reduce<Record<string, MenuProduct[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {})

  return (
    <section className="relative w-full pb-16 px-6 sm:px-10 lg:px-20 pt-10 lg:pt-16 bg-bg-body">
      <div className="relative max-w-6xl mx-auto mt-10">
        {/* ── TOGGLE DÍA / NOCHE + OFERTAS ── */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <button
            onClick={() => handleTime("DAY")}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-semibold
              border transition-all duration-200 cursor-pointer
              ${time === "DAY" ? "bg-brand-contrast text-brand-primary rounded-radius border-border-color" : "bg-transparent rounded-radius text-text-main/70 border-border-color/30 hover:border-border-color/50 hover:text-text-main"}
            `}
          >
            <span className="text-xs">☀️</span> Día
          </button>
          <button
            onClick={() => handleTime("NIGHT")}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-semibold
              border transition-all duration-200 cursor-pointer
              ${time === "NIGHT" ? "bg-brand-contrast text-brand-primary rounded-radius border-border-color" : "bg-transparent rounded-radius text-text-main/70 border-border-color/30 hover:border-border-color/50 hover:text-text-main"}
            `}
          >
            <span className="text-xs">🌙</span> Noche
          </button>

          <span className="w-px h-4 bg-border-color/20 mx-0.5" />

          <button
            onClick={handleOfertas}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-semibold
              border transition-all duration-200 cursor-pointer
              ${showOfertas
                ? "bg-brand-contrast text-brand-primary rounded-radius border-border-color"
                : "bg-transparent rounded-radius text-text-main/70 border-border-color/30 hover:border-border-color/50 hover:text-text-main"}
            `}
          >
            <span className="text-xs">🏷️</span> Descuentos
          </button>
        </div>

        {/* ── FILTROS MOBILE: select dropdown ── */}
        <div className="lg:hidden mb-6">
          <div className="relative">
            <select
              value={active}
              onChange={(e) => handleFilter(e.target.value)}
              className="w-full appearance-none bg-transparent border border-border-color/20 focus:border-border-color/60 px-4 py-2.5 pr-10 text-[11px] uppercase tracking-[0.2em] text-text-main outline-none transition-colors duration-200 cursor-pointer"
            >
              {allCategories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name === "Todos" ? "Todos los platillos" : `${cat.emoji} ${cat.name}`}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-darkWarm/50" />
              </svg>
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-main/40 mt-2">
            {filtered.length} {filtered.length === 1 ? "platillo" : "platillos"}
          </p>
        </div>

        {/* ── LAYOUT DESKTOP: dos columnas ── */}
        <div className="flex gap-12">
          {/* Columna izquierda — lista de productos */}
          <div className="flex-1 min-w-0">
            {active !== "Todos" && getCategoryExtras(active)?.map((block) => <ExtrasBadge key={block.title} title={block.title} extras={block.extras} note={block.note} />)}

            {Object.keys(grouped).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <span className="text-4xl">{showOfertas ? "🏷️" : time === "DAY" ? "☀️" : "🌙"}</span>
                <p className="text-text-main/80 text-center text-sm uppercase tracking-[0.2em]">
                  {showOfertas
                    ? active !== "Todos"
                      ? `No hay ofertas en ${active}`
                      : "No hay ofertas disponibles"
                    : time === "DAY"
                      ? "No hay platillos disponibles por el día"
                      : "No hay platillos disponibles por la noche"}
                </p>
                {showOfertas && (
                  <button
                    onClick={handleOfertas}
                    className="mt-2 text-[11px] uppercase cursor-pointer tracking-[0.2em] text-text-main/70 hover:text-text-main underline underline-offset-4 transition-colors duration-150"
                  >
                    Ver todos los platillos
                  </button>
                )}
                {!showOfertas && active !== "Todos" && (
                  <button
                    onClick={() => handleFilter("Todos")}
                    className="mt-2 text-[11px] uppercase cursor-pointer tracking-[0.2em] text-text-main/70 hover:text-text-main underline underline-offset-4 transition-colors duration-150"
                  >
                    Ver todos los platillos
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-10">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-base leading-none">{getEmoji(category)}</span>
                      <span className="text-[10px] uppercase tracking-[0.3em] text-text-main font-semibold">{category}</span>
                      <span className="flex-1 h-px bg-border-color/30" />
                      <span className="text-[10px] text-text-main/90 tracking-widest">{items.length}</span>
                    </div>

                    <div className="flex flex-col">
                      {items.map((product, idx) => (
                        <Link
                          key={product.slug}
                          href={`/menu/${product.slug}`}
                          className={`group flex items-center gap-4 py-3.5 -mx-3 px-3 rounded-radius hover:bg-bg-dark/[0.05] transition-colors duration-150 ${idx < items.length - 1 ? "border-b border-border-color/[0.07]" : ""}`}
                        >
                          <div className="relative w-14 h-14 shrink-0 rounded-radius overflow-hidden">
                            <Image src={product.img} alt={product.name} fill sizes="400px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>

                          <div className="flex flex-1 items-center justify-between min-w-0 gap-4">
                            {/* Contenedor de Textos: El overflow-hidden es clave para que truncate funcione */}
                            <div className="flex-1 min-w-0 overflow-hidden">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-lg lg:text-xl text-text-main/95 leading-tight truncate group-hover:text-text-main transition-colors duration-200">{product.name}</span>
                                {product.tag && <span className={`shrink-0 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${tagColors[product.tag]}`}>{product.tag}</span>}
                                {showOfertas && (
                                  <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-border-color/10 text-text-muted">
                                    {product.availability === "BOTH" ? "☀️🌙" : product.availability === "DAY" ? "☀️ Día" : "🌙 Noche"}
                                  </span>
                                )}
                              </div>
                              <p className="text-[12px] lg:text-sm text-text-muted mt-0.5 truncate">{product.desc}</p>
                            </div>

                            {/* Contenedor de Precio: shrink-0 evita que el precio se aplaste */}
                            <div className="shrink-0 flex flex-col items-end">
                              {product.originalPrice && <span className="text-[11px] text-text-muted line-through leading-none">${product.originalPrice}</span>}
                              <span className="font-titleText text-lg lg:text-xl text-brand-contrast">${product.price}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border-color/15">
              <p className="text-text-main/70 text-sm text-center sm:text-left">¿No encuentras lo que buscas? Hacemos pedidos especiales.</p>
              <Button title="Pedir personalizado" url="/contact" />
            </div> */}
          </div>

          {/* Columna derecha — filtros sticky (solo desktop) */}
          <div className="hidden lg:block w-48 shrink-0">
            <div className="sticky top-24 flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-[0.3em] text-text-main mb-2">Categorías</span>
              {allCategories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleFilter(cat.name)}
                  aria-pressed={active === cat.name}
                  className={`flex items-center gap-2.5 px-3 py-2 text-left cursor-pointer transition-all duration-150 rounded-radius ${active === cat.name ? "bg-bg-dark/8 text-darkWarm" : "text-text-main/50 hover:text-text-main hover:bg-bg-dark/[0.04]"}`}
                >
                  <span className="text-sm leading-none shrink-0">{cat.emoji}</span>
                  <span className={`text-[10px] uppercase tracking-[0.15em] font-semibold leading-none truncate ${active === cat.name ? "text-text-main" : "text-text-main/70"}`}>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
