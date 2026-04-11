"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Field, FieldLabel } from "@/components/ui/field"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState } from "@/components/ui/EmptyState"
import { IconBowlChopsticks } from "@tabler/icons-react"

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

  const tags = useMemo(() => Array.from(new Set(products.map((p) => p.tag).filter(Boolean))) as string[], [products])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
      const matchCategory = activeCategory === null || p.category === activeCategory
      const matchTag = activeTag === null || p.tag === activeTag
      return matchSearch && matchCategory && matchTag
    })
  }, [products, search, activeCategory, activeTag])

  const hasFilters = search || activeCategory || activeTag

  return (
    <div className="flex flex-col gap-6">
      {filtered.length === 0 && products.length === 0 ? (
        <EmptyState
          icon={IconBowlChopsticks}
          label="Menú sin platillos"
          description="Aún no has agregado delicias a tu carta. Empieza a crear tu menú añadiendo el primer platillo."
          actionLabel="Crear platillo"
          actionHref="/admin/products/new"
          className="min-h-[420px]"
        />
      ) : (
        <>
          {/* Search */}
          <Field>
            <FieldLabel>Buscar producto</FieldLabel>
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nombre o categoría…" className="pl-9" />
            </div>
          </Field>

          {/* Category filter */}
          {categories.length > 0 && (
            <div className="flex flex-col gap-2">
              <FieldLabel>Categoría</FieldLabel>
              <div className="flex flex-wrap gap-1">
                <Toggle pressed={activeCategory === null} onPressedChange={() => setActiveCategory(null)} size="sm" variant="outline" className="cursor-pointer">
                  Todos
                </Toggle>
                {categories.map((cat) => (
                  <Toggle
                    key={cat}
                    pressed={activeCategory === cat}
                    onPressedChange={() => setActiveCategory(activeCategory === cat ? null : cat)}
                    size="sm"
                    variant="outline"
                    className="cursor-pointer"
                  >
                    {cat}
                  </Toggle>
                ))}
              </div>
            </div>
          )}

          {/* Tag filter */}
          {tags.length > 0 && (
            <div className="flex flex-col gap-2">
              <FieldLabel>Tag</FieldLabel>
              <div className="flex flex-wrap gap-1">
                <Toggle pressed={activeTag === null} onPressedChange={() => setActiveTag(null)} size="sm" variant="outline" className="cursor-pointer">
                  Todos
                </Toggle>
                {tags.map((tag) => (
                  <Toggle key={tag} pressed={activeTag === tag} onPressedChange={() => setActiveTag(activeTag === tag ? null : tag)} size="sm" variant="outline" className="cursor-pointer">
                    {tag}
                  </Toggle>
                ))}
              </div>
            </div>
          )}

          {/* Results count */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
            </span>
            {hasFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("")
                  setActiveCategory(null)
                  setActiveTag(null)
                }}
                className="gap-1 text-muted-foreground cursor-pointer"
              >
                <X className="w-3 h-3" />
                Limpiar filtros
              </Button>
            )}
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {["Nombre", "Categoría", "Precio", "Tag", "Acciones"].map((col) => (
                    <TableHead key={col}>{col}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                      No existen productos con este nombre.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{product.category}</Badge>
                      </TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>{product.tag ? <Badge variant="outline">{product.tag}</Badge> : <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell>
                        <Button asChild variant="default" size="sm">
                          <Link href={`/admin/products/${product.id}`}>Editar</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}
