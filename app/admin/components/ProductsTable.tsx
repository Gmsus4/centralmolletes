"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

type Product = {
  id: string
  name: string
  category: string
  price: number
  tag?: string | null
}

type Props = {
  products: Product[]
  categories: string[]
}

export function ProductsTable({ products, categories }: Props) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const tags = useMemo(
    () => Array.from(new Set(products.map((p) => p.tag).filter(Boolean))) as string[],
    [products]
  )

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      const matchCategory = activeCategory === null || p.category === activeCategory
      const matchTag = activeTag === null || p.tag === activeTag
      return matchSearch && matchCategory && matchTag
    })
  }, [products, search, activeCategory, activeTag])

  return (
    <div className="flex flex-col gap-6">

      {/* Search */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase tracking-[0.25em] text-stone-700">
          Buscar producto
        </label>
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-700"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nombre o categoría…"
            className="
              w-full sm:max-w-sm bg-white
              border border-stone-200 focus:border-stone-400
              pl-10 pr-4 py-2.5
              text-stone-800 text-sm placeholder:text-stone-300
              outline-none transition-colors duration-300
            "
          />
        </div>
      </div>

      {/* Category filter chips */}
      {categories.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-stone-700">Categoría</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`
                px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border transition-colors duration-200
                ${activeCategory === null
                  ? "bg-stone-800 text-white border-stone-800"
                  : "bg-white text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-700"}
              `}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={` cursor-pointer
                  px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border transition-colors duration-200
                  ${activeCategory === cat
                    ? "bg-stone-800 text-white border-stone-800"
                    : "bg-white text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-700"}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tag filter chips */}
      {tags.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-stone-700">Tag</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={` cursor-pointer
                px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border transition-colors duration-200
                ${activeTag === null
                  ? "bg-stone-100 text-stone-700 border-stone-300"
                  : "bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:text-stone-600"}
              `}
            >
              Todos
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`
                  cursor-pointer
                  px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border transition-colors duration-200
                  ${activeTag === tag
                    ? "bg-stone-100 text-stone-700 border-stone-300"
                    : "bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:text-stone-600"}
                `}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.25em] text-stone-700">
          {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
        </span>
        {(search || activeCategory || activeTag) && (
          <button
            onClick={() => { setSearch(""); setActiveCategory(null); setActiveTag(null) }}
            className="text-[10px] cursor-pointer uppercase tracking-[0.2em] text-stone-700 hover:text-stone-600 transition-colors underline underline-offset-2"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Table */}
      <div className="border border-stone-200 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              {["Nombre", "Categoría", "Precio", "Tag", "Acciones"].map((col) => (
                <th
                  key={col}
                  className="text-left py-3 px-5 text-[10px] uppercase tracking-[0.25em] text-stone-700 font-medium"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-stone-600 text-[11px] uppercase tracking-widest">
                  Sin resultados
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-stone-100 hover:bg-stone-50 transition-colors duration-150"
                >
                  <td className="py-3.5 px-5 text-stone-800 text-sm">{product.name}</td>
                  <td className="py-3.5 px-5">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 border border-stone-200 px-2 py-0.5">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-stone-700 text-sm font-medium">
                    ${product.price}
                  </td>
                  <td className="py-3.5 px-5">
                    {product.tag ? (
                      <span className="text-[10px] uppercase tracking-[0.2em] text-stone-700">
                        {product.tag}
                      </span>
                    ) : (
                      <span className="text-stone-300">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-[10px] uppercase tracking-[0.2em] text-stone-700 hover:text-stone-800 border-b border-stone-300 hover:border-stone-800 pb-px transition-colors duration-200"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}