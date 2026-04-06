"use client"

import { useCallback, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Search, X, SlidersHorizontal } from "lucide-react"
import { PromotionSchema, PromotionFormValues } from "@/lib/validators/promotion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Toggle } from "@/components/ui/toggle"
import { Separator as UISeparator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { DateRangeField } from "../components/DateRangeField"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { AdminFormLayout } from "../components/AdminFormLayout"
import { SavingOverlay } from "@/components/ui/saving-overlay"
import { useFormOverlay } from "@/hooks/useFormOverlay"
import { useDuplicate } from "@/hooks/useDuplicate"

// ─── Types ────────────────────────────────────────────────────────────────────

type Product = {
  id: string
  name: string
  tag?: string | null
  category: string
}

type Promotion = {
  id?: string
  type: "DISCOUNT" | "ANNOUNCE" | "WARNING"
  title: string
  description?: string | null
  discount?: number | null
  startsAt: string | Date
  endsAt: string | Date
  isActive: boolean
  products?: Product[]
}

type Props = {
  promotion?: Promotion
  products: Product[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PROMOTION_TYPES = [
  { value: "DISCOUNT", label: "Descuento" },
  { value: "ANNOUNCE", label: "Anuncio" },
  { value: "WARNING", label: "Aviso" },
] as const

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{children}</span>
    <Separator className="flex-1" />
  </div>
)

function DeleteButton({ onConfirm }: { onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive" className="cursor-pointer flex-1">
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar promoción?</AlertDialogTitle>
          <AlertDialogDescription>Esta acción no se puede deshacer. La promoción será eliminada permanentemente.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer">
            Sí, eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Filter Panel (shared between desktop inline + mobile sheet) ──────────────

function FilterPanel({
  categories,
  tags,
  activeCategory,
  activeTag,
  onlySelected,
  onCategoryChange,
  onTagChange,
  onOnlySelectedChange,
}: {
  categories: string[]
  tags: string[]
  activeCategory: string | null
  activeTag: string | null
  onlySelected: boolean
  onCategoryChange: (val: string | null) => void
  onTagChange: (val: string | null) => void
  onOnlySelectedChange: (val: boolean) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      {categories.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Categoría</span>
          <div className="flex flex-wrap gap-1">
            <Toggle pressed={activeCategory === null} onPressedChange={() => onCategoryChange(null)} size="sm" variant="outline" className="h-7 text-xs cursor-pointer">
              Todas
            </Toggle>
            {categories.map((cat) => (
              <Toggle
                key={cat}
                pressed={activeCategory === cat}
                onPressedChange={() => onCategoryChange(activeCategory === cat ? null : cat)}
                size="sm"
                variant="outline"
                className="h-7 text-xs cursor-pointer"
              >
                {cat}
              </Toggle>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Tag</span>
          <div className="flex flex-wrap gap-1">
            <Toggle pressed={activeTag === null} onPressedChange={() => onTagChange(null)} size="sm" variant="outline" className="h-7 text-xs cursor-pointer">
              Todos
            </Toggle>
            {tags.map((tag) => (
              <Toggle key={tag} pressed={activeTag === tag} onPressedChange={() => onTagChange(activeTag === tag ? null : tag)} size="sm" variant="outline" className="h-7 text-xs cursor-pointer">
                {tag}
              </Toggle>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Seleccionados</span>
        <Toggle pressed={onlySelected} onPressedChange={() => onOnlySelectedChange(!onlySelected)} size="sm" variant="outline" className="h-7 text-xs w-fit cursor-pointer">
          Solo seleccionados
        </Toggle>
      </div>
    </div>
  )
}

// ─── Product Search Filter ────────────────────────────────────────────────────

function ProductSearchFilter({
  products,
  selectedIds,
  onToggle,
  onToggleAll,
}: {
  products: Product[]
  selectedIds: string[]
  onToggle: (id: string, checked: boolean) => void
  onToggleAll: () => void
}) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [onlySelected, setOnlySelected] = useState(false)

  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))).sort(), [products])

  const tags = useMemo(() => Array.from(new Set(products.map((p) => p.tag).filter(Boolean))) as string[], [products])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const matchSearch = !q || p.name.toLowerCase().includes(q)
      const matchCategory = !activeCategory || p.category === activeCategory
      const matchTag = !activeTag || p.tag === activeTag
      const matchSelected = !onlySelected || selectedIds.includes(p.id)
      return matchSearch && matchCategory && matchTag && matchSelected
    })
  }, [products, query, activeCategory, activeTag, onlySelected, selectedIds])

  const allSelected = selectedIds.length === products.length
  const someSelected = selectedIds.length > 0 && !allSelected
  const activeFilters = [activeCategory, activeTag, onlySelected].filter(Boolean).length
  const hasFilters = !!query || !!activeCategory || !!activeTag || onlySelected

  const clearFilters = () => {
    setQuery("")
    setActiveCategory(null)
    setActiveTag(null)
    setOnlySelected(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <Input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar producto…" className="pl-8 pr-8 h-9 text-sm" />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile: filtros en Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button type="button" variant="outline" size="sm" className="sm:hidden h-9 gap-1.5 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filtros
              {activeFilters > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                  {activeFilters}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[80vh]  px-6 pb-20 overflow-y-auto rounded-t-xl">
            <SheetHeader className="mb-0 pb-4 pl-0">
              <SheetTitle className="text-sm uppercase tracking-widest text-muted-foreground">Filtros</SheetTitle>
            </SheetHeader>
            <FilterPanel
              categories={categories}
              tags={tags}
              activeCategory={activeCategory}
              activeTag={activeTag}
              onlySelected={onlySelected}
              onCategoryChange={setActiveCategory}
              onTagChange={setActiveTag}
              onOnlySelectedChange={setOnlySelected}
            />
            {hasFilters && (
              <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="mt-4 gap-1 text-muted-foreground px-0 h-auto text-xs">
                <X className="w-3 h-3" />
                Limpiar filtros
              </Button>
            )}
          </SheetContent>
        </Sheet>

        <Badge variant="secondary" className="shrink-0 hidden sm:flex">
          {selectedIds.length}/{products.length}
        </Badge>

        <Button type="button" variant="ghost" size="sm" onClick={onToggleAll} className="shrink-0 text-muted-foreground text-xs hidden sm:flex cursor-pointer">
          {allSelected ? "Quitar todos" : "Todos"}
        </Button>
      </div>

      {/* Mobile: badge + toggle all */}
      <div className="flex items-center justify-between sm:hidden">
        <Badge variant="secondary">
          {selectedIds.length}/{products.length} seleccionados
        </Badge>
        <Button type="button" variant="ghost" size="sm" onClick={onToggleAll} className="text-muted-foreground text-xs h-auto py-1">
          {allSelected ? "Quitar todos" : "Seleccionar todos"}
        </Button>
      </div>

      {/* Desktop: filtros inline */}
      <div className="hidden sm:block">
        <FilterPanel
          categories={categories}
          tags={tags}
          activeCategory={activeCategory}
          activeTag={activeTag}
          onlySelected={onlySelected}
          onCategoryChange={setActiveCategory}
          onTagChange={setActiveTag}
          onOnlySelectedChange={setOnlySelected}
        />
      </div>

      {/* Limpiar filtros — desktop */}
      {hasFilters && (
        <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="hidden sm:flex w-fit gap-1 text-muted-foreground px-0 h-auto text-xs cursor-pointer">
          <X className="w-3 h-3" />
          Limpiar filtros
        </Button>
      )}

      {/* Grid de productos */}
      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">No hay productos disponibles.</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">Sin resultados{query ? ` para "${query}"` : ""}.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {filtered.map((product) => {
            const isChecked = selectedIds.includes(product.id)
            return (
              <FieldLabel
                key={product.id}
                htmlFor={`product-${product.id}`}
                className={`
                  flex items-center gap-2.5 px-3 py-3 border cursor-pointer rounded-md
                  transition-colors duration-150
                  ${isChecked ? "border-primary bg-primary/5" : "border-input bg-background hover:border-ring"}
                `}
              >
                <Checkbox id={`product-${product.id}`} checked={isChecked} onCheckedChange={(checked) => onToggle(product.id, !!checked)} />
                <div className="flex flex-col min-w-0">
                  <span className={`text-sm leading-tight truncate ${isChecked ? "text-foreground font-medium" : "text-muted-foreground"}`}>{product.name}</span>
                  <span className="text-[10px] text-muted-foreground/60 truncate">
                    {product.category}
                    {product.tag ? ` · ${product.tag}` : ""}
                  </span>
                </div>
              </FieldLabel>
            )
          })}
        </div>
      )}

      {/* Contador */}
      {(query || activeCategory || activeTag) && filtered.length > 0 && (
        <p className="text-[11px] text-muted-foreground">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          {someSelected && ` · ${selectedIds.length} seleccionado${selectedIds.length !== 1 ? "s" : ""} en total`}
        </p>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PromotionForm({ promotion, products }: Props) {
  const router = useRouter()
  const isEditing = !!promotion?.id
  const [submitError, setSubmitError] = useState("")

  const methods = useForm<PromotionFormValues>({
    resolver: zodResolver(PromotionSchema),
    defaultValues: {
      type: promotion?.type ?? "DISCOUNT",
      title: promotion?.title ?? "",
      description: promotion?.description ?? "",
      discount: promotion?.discount ?? undefined,
      startsAt: promotion?.startsAt ? new Date(promotion.startsAt).toISOString() : "",
      endsAt: promotion?.endsAt ? new Date(promotion.endsAt).toISOString() : "",
      isActive: promotion?.isActive ?? true,
      productIds: promotion?.products?.map((p) => p.id) ?? [],
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = methods

  const { overlayMode, setOverlayMode, isVisible } = useFormOverlay()
  const promotionType = watch("type")
  const selectedIds = watch("productIds") ?? []
  const isActive = watch("isActive")

  const handleToggleAll = () => {
    setValue("productIds", selectedIds.length === products.length ? [] : products.map((p) => p.id))
  }

  const handleToggleProduct = (id: string, checked: boolean) => {
    const next = checked ? [...selectedIds, id] : selectedIds.filter((sid) => sid !== id)
    setValue("productIds", next)
  }
  
  const handleDuplicate = useDuplicate({
      apiPath:      "/api/promotions",
      redirectPath: "/admin/promotions",
      getValues,
      setOverlayMode,
      setSubmitError,
      nameField: "title",
      slugField: undefined
  })

  const onSubmit = async (data: PromotionFormValues) => {
    setSubmitError("")
    setOverlayMode("saving")
    const url = isEditing ? `/api/promotions/${promotion!.id}` : `/api/promotions`
    const method = isEditing ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      setSubmitError(json.error ?? "Hubo un error al guardar")
      setOverlayMode(null)
      return
    }

    router.push("/admin/promotions?edit=true")
    router.refresh()
  }

  const handleDelete = useCallback(async () => {
    setOverlayMode("deleting")
    await fetch(`/api/promotions/${promotion!.id}`, { method: "DELETE" })
    router.push("/admin/promotions?deleted=true")
    router.refresh()
  }, [promotion, router])

  return (
    <FormProvider {...methods}>
      <AdminFormLayout
        section="Promociones"
        title={isEditing ? "Editar" : "Nuevo"}
        backHref="/admin/promotions"
        formId="promotion-form"
        isEditing={isEditing}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onDelete={isEditing ? handleDelete : undefined}
        deleteTitle="¿Eliminar promoción?"
        deleteDescription="Esta acción no se puede deshacer. La promoción será eliminada permanentemente."
        onDuplicate={isEditing ? handleDuplicate : undefined}  
      >
        <SavingOverlay isVisible={isVisible} mode={overlayMode ?? "saving"} />
        <form id="promotion-form" onSubmit={handleSubmit(onSubmit)}>
          {/* ── Fila 1: Tipo · Título · Descuento ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[160px_1fr_160px] gap-4 sm:gap-x-6 gap-y-5 mb-5">
            <Field data-invalid={!!errors.type}>
              <FieldLabel htmlFor="type">Tipo</FieldLabel>
              <FieldError>{errors.type?.message}</FieldError>
              <Select defaultValue={promotion?.type ?? "DISCOUNT"} onValueChange={(val) => setValue("type", val as PromotionFormValues["type"])}>
                <SelectTrigger id="type" aria-invalid={!!errors.type}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROMOTION_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field data-invalid={!!errors.title} className="sm:col-span-1 lg:col-span-1">
              <FieldLabel htmlFor="title">Título</FieldLabel>
              <FieldError>{errors.title?.message}</FieldError>
              <Input id="title" aria-invalid={!!errors.title} {...register("title")} placeholder="2x1 en molletes los martes" />
            </Field>

            {promotionType === "DISCOUNT" && (
              <Field data-invalid={!!errors.discount}>
                <FieldLabel htmlFor="discount">Descuento (%)</FieldLabel>
                <FieldError>{errors.discount?.message}</FieldError>
                <Input id="discount" aria-invalid={!!errors.discount} {...register("discount", { valueAsNumber: true })} type="number" min={0} max={100} step={0.01} placeholder="15" />
              </Field>
            )}
          </div>

          {/* ── Fila 2: Descripción · Vigencia ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-x-8 gap-y-5 mb-5">
            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="description">Descripción</FieldLabel>
              <FieldError>{errors.description?.message}</FieldError>
              <Textarea id="description" aria-invalid={!!errors.description} {...register("description")} rows={3} placeholder="Detalles de la promoción…" />
            </Field>
            <DateRangeField />
          </div>

          {/* Activo */}
          <div className="flex items-center gap-2 mb-8 sm:mb-10">
            <Switch className="cursor-pointer" id="isActive" checked={isActive} onCheckedChange={(val) => setValue("isActive", !!val)} />
            <FieldLabel htmlFor="isActive" className="cursor-pointer">
              {isActive ? "Activo" : "Inactivo"}
            </FieldLabel>
          </div>

          {/* ── Productos ── */}
          <div>
            <SectionTitle>Productos aplicables</SectionTitle>
            <FieldGroup>
              <FieldSet>
                <FieldLegend className="sr-only">Productos</FieldLegend>
                <ProductSearchFilter products={products} selectedIds={selectedIds} onToggle={handleToggleProduct} onToggleAll={handleToggleAll} />
              </FieldSet>
            </FieldGroup>
            {errors.productIds && <FieldError className="mt-2">{errors.productIds.message}</FieldError>}
          </div>
        </form>
      </AdminFormLayout>
    </FormProvider>
  )
}
