"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CategorySchema, CategoryFormValues } from "@/lib/validators/category"
import { ChevronUp, ChevronDown, Plus, Loader2 } from "lucide-react"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { SavingOverlay } from "@/components/ui/saving-overlay"
import { useFormOverlay } from "@/hooks/useFormOverlay"
import { EmptyState } from "@/components/ui/EmptyState"
import { IconTag } from "@tabler/icons-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = {
  id: string
  name: string
  emoji: string
  order: number
  _count: { products: number }
}

type Props = {
  categories: Category[]
}

// ─── EditRow ──────────────────────────────────────────────────────────────────

function EditRow({
  cat,
  onSave,
  onCancel,
}: {
  cat: Category
  onSave: (id: string, data: CategoryFormValues) => Promise<void>
  onCancel: () => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: { name: cat.name, emoji: cat.emoji, order: cat.order },
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field data-invalid={!!errors.emoji}>
          <FieldLabel htmlFor={`emoji-${cat.id}`}>Emoji</FieldLabel>
          <Input id={`emoji-${cat.id}`} {...register("emoji")} placeholder="🥐" aria-invalid={!!errors.emoji} />
          <FieldError>{errors.emoji?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.name} className="sm:col-span-2">
          <FieldLabel htmlFor={`name-${cat.id}`}>Nombre</FieldLabel>
          <Input id={`name-${cat.id}`} {...register("name")} placeholder="Panadería" aria-invalid={!!errors.name} />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          className="cursor-pointer"
          size="sm"
          onClick={handleSubmit((data) => onSave(cat.id, data))}
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
          {isSubmitting ? "Guardando…" : "Guardar"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="cursor-pointer">
          Cancelar
        </Button>
      </div>
    </div>
  )
}

// ─── NewCategoryForm ──────────────────────────────────────────────────────────

function NewCategoryForm({
  nextOrder,
  onCreate,
  onCancel,
}: {
  nextOrder: number
  onCreate: (data: CategoryFormValues) => Promise<string | void>
  onCancel: () => void
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: { name: "", emoji: "🥑", order: nextOrder },
  })

  async function onSubmit(data: CategoryFormValues) {
    const error = await onCreate(data)
    if (error) setError("name", { message: error })
  }

  return (
    <div className="flex flex-col gap-4 pt-6">
      <Separator />
      <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Nueva categoría
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field data-invalid={!!errors.emoji}>
          <FieldLabel htmlFor="new-emoji">Emoji</FieldLabel>
          <Input id="new-emoji" {...register("emoji")} placeholder="🥑" autoFocus aria-invalid={!!errors.emoji} />
          <FieldError>{errors.emoji?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.name} className="sm:col-span-2">
          <FieldLabel htmlFor="new-name">Nombre</FieldLabel>
          <Input id="new-name" {...register("name")} placeholder="Nombre de la categoría" aria-invalid={!!errors.name} />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={handleSubmit(onSubmit)}
          className="cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
          {isSubmitting ? "Creando…" : "Crear"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="cursor-pointer">
          Cancelar
        </Button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CategoriesTable({ categories: initial }: Props) {
  const router = useRouter()

  const [categories, setCategories]   = useState(initial)
  const [editing, setEditing]         = useState<string | null>(null)
  const [rowError, setRowError]       = useState<{ id: string; msg: string } | null>(null)
  const [showNew, setShowNew]         = useState(false)
  const [moveLoading, setMoveLoading] = useState(false)
  const { overlayMode, setOverlayMode, isVisible } = useFormOverlay()

  function getNextOrder(cats: Category[]) {
    return Math.max(...cats.map((c) => c.order), 0) + 1
  }

  function startEdit(cat: Category) {
    setEditing(cat.id)
    setRowError(null)
  }

  function cancelEdit() {
    setEditing(null)
    setRowError(null)
  }

  async function moveOrder(id: string, direction: "up" | "down") {
    const idx     = categories.findIndex((c) => c.id === id)
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= categories.length) return

    const current = categories[idx]
    const swap    = categories[swapIdx]

    setMoveLoading(true)
    await Promise.all([
      fetch(`/api/categories/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: current.name, emoji: current.emoji, order: swap.order }),
      }),
      fetch(`/api/categories/${swap.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: swap.name, emoji: swap.emoji, order: current.order }),
      }),
    ])

    const updated = [...categories]
    updated[idx]     = { ...current, order: swap.order }
    updated[swapIdx] = { ...swap, order: current.order }
    updated.sort((a, b) => a.order - b.order)
    setCategories(updated)
    setMoveLoading(false)
    router.refresh()
  }

  async function saveEdit(id: string, data: CategoryFormValues) {
    // setOverlayMode("saving")
    const res = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      setRowError({ id, msg: "Error al guardar" })
      return
    }

    const updated = await res.json()
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...updated, _count: c._count } : c))
    )
    setEditing(null)
    // setOverlayMode(null)
    // toast.success("Categoría guardada correctamente")
    router.refresh()
  }

  async function deleteCategory(id: string) {
    setOverlayMode("deleting")
    const res  = await fetch(`/api/categories/${id}`, { method: "DELETE" })
    const data = await res.json()

    if (!res.ok) {
      setRowError({ id, msg: data.error })
      return
    }

    setCategories((prev) => prev.filter((c) => c.id !== id))
    setRowError(null)
    // toast.success("Categoría eliminada correctamente")
    setOverlayMode(null)
    router.refresh()
  }

  async function createCategory(data: CategoryFormValues): Promise<string | void> {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      return json.error ?? "Error al crear la categoría"
    }

    const created = await res.json()
    setCategories((prev) => [...prev, { ...created, _count: { products: 0 } }])
    setShowNew(false)
    // toast.success("Categoría creada correctamente")
    router.refresh()
  }

  return (
    <>
      <SavingOverlay isVisible={isVisible} mode={overlayMode ?? "saving"}/>
      <div className="flex flex-col gap-6">
        {/* Botón nueva categoría */}
        {!showNew && (
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowNew(true)} className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Nueva categoría
            </Button>
          </div>
        )}

        {/* Lista de categorías */}
        {categories.length === 0 && !showNew ? (
          <EmptyState
            icon={IconTag}
            label="Sin categorías"
            description="Aún no has creado ninguna categoría. Empieza añadiendo la primera."
            actionLabel="Nueva categoría"
            actionHref="#"
          />
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {categories.map((cat, idx) => (
              <div key={cat.id} className="py-4 first:pt-0 last:pb-0">
                {editing === cat.id ? (
                  <EditRow cat={cat} onSave={saveEdit} onCancel={cancelEdit} />
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    {/* Orden + info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Flechas */}
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => moveOrder(cat.id, "up")}
                          disabled={moveLoading || idx === 0}
                          aria-label="Subir"
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => moveOrder(cat.id, "down")}
                          disabled={moveLoading || idx === categories.length - 1}
                          aria-label="Bajar"
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Número de orden */}
                      <span className="text-xs text-muted-foreground w-5 shrink-0 tabular-nums">
                        {cat.order}
                      </span>

                      {/* Emoji + nombre */}
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl leading-none shrink-0">{cat.emoji}</span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-sm truncate">{cat.name}</span>
                          <Badge variant="secondary" className="w-fit mt-0.5 text-[10px] px-1.5 py-0">
                            {cat._count.products}{" "}
                            {cat._count.products === 1 ? "producto" : "productos"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs cursor-pointer"
                          onClick={() => startEdit(cat)}
                        >
                          Editar
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                              onClick={() => setRowError(null)}
                            >
                              Eliminar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Estás a punto de eliminar{" "}
                                <strong>{cat.emoji} {cat.name}</strong>.
                                Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                                onClick={() => deleteCategory(cat.id)}
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                      {rowError?.id === cat.id && (
                        <p className="text-xs text-destructive">{rowError.msg}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Formulario nueva categoría */}
        {showNew && (
          <NewCategoryForm
            nextOrder={getNextOrder(categories)}
            onCreate={createCategory}
            onCancel={() => setShowNew(false)}
          />
        )}
      </div>
    </>
  )
}