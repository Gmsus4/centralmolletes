"use client"

import { Suspense, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CategorySchema, CategoryFormValues } from "@/lib/validators/category"
import { IconChevronUp, IconChevronDown } from "@tabler/icons-react"
import Toast from "@/components/ui/Toast"

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

// ─── Styles ───────────────────────────────────────────────────────────────────

const inputClass = `
  w-full bg-white
  border border-stone-300 focus:border-stone-700
  px-4 py-2.5
  text-stone-900 text-sm placeholder:text-stone-400
  outline-none transition-colors duration-200
`
const labelClass = "text-[10px] uppercase tracking-[0.25em] text-stone-600 font-medium"

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <label className={labelClass}>{label}</label>
      {children}
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  )
}

// ── Fila en modo edición con su propio useForm ────────────────────────────────

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
    defaultValues: {
      name:  cat.name,
      emoji: cat.emoji,
      order: cat.order,
    },
  })

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Emoji" error={errors.emoji?.message}>
          <input {...register("emoji")} placeholder="🥐" className={inputClass} />
        </Field>
        <Field label="Nombre" error={errors.name?.message} className="sm:col-span-2">
          <input {...register("name")} placeholder="Panadería" className={inputClass} />
        </Field>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSubmit((data) => onSave(cat.id, data))}
          disabled={isSubmitting}
          className="bg-stone-900 text-white px-6 py-2.5 text-[11px] uppercase tracking-[0.3em] font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity duration-200 cursor-pointer disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Guardando…" : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-[10px] uppercase tracking-[0.25em] text-stone-500 hover:text-stone-900 border-b border-stone-400 hover:border-stone-900 pb-px transition-colors duration-200 cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </>
  )
}

// ── Formulario nueva categoría con su propio useForm ─────────────────────────

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
    setError,           // ← agrega esto
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: { name: "", emoji: "🥑", order: nextOrder },
  })

  async function onSubmit(data: CategoryFormValues) {
    const error = await onCreate(data)
    if (error) {
      setError("name", { message: error })  // ← muestra el error en el campo nombre
    }
  }

  return (
    <div className="flex flex-col gap-4 pt-6 border-t border-stone-200">
      <div className="flex items-center gap-3">
        <span className="w-8 h-px bg-stone-300" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400">Nueva categoría</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Emoji" error={errors.emoji?.message}>
          <input {...register("emoji")} placeholder="🥑" autoFocus className={inputClass} />
        </Field>
        <Field label="Nombre" error={errors.name?.message} className="sm:col-span-2">
          <input {...register("name")} placeholder="Nombre de la categoría" className={inputClass} />
        </Field>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}   // ← usa onSubmit en lugar de onCreate directo
          disabled={isSubmitting}
          className="bg-stone-900 text-white px-6 py-2.5 text-[11px] uppercase tracking-[0.3em] font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity duration-200 cursor-pointer disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creando…" : "Crear"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-[10px] uppercase tracking-[0.25em] text-stone-500 hover:text-stone-900 border-b border-stone-400 hover:border-stone-900 pb-px transition-colors duration-200 cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CategoriesTable({ categories: initial }: Props) {
  const router = useRouter()

  const [categories, setCategories]     = useState(initial)
  const [editing, setEditing]           = useState<string | null>(null)
  const [rowError, setRowError]         = useState<{ id: string; msg: string } | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [showNew, setShowNew]           = useState(false)
  const [moveLoading, setMoveLoading]   = useState(false)

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
    updated[swapIdx] = { ...swap,    order: current.order }
    updated.sort((a, b) => a.order - b.order)
    setCategories(updated)
    setMoveLoading(false)
    router.refresh()
  }

  async function saveEdit(id: string, data: CategoryFormValues) {
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
      prev.map((c) => c.id === id ? { ...updated, _count: c._count } : c)
    )
    setEditing(null)
    // router.push("/admin/categories?success=true")
    router.refresh()
  }

  async function deleteCategory(id: string) {
    const res  = await fetch(`/api/categories/${id}`, { method: "DELETE" })
    const data = await res.json()

    if (!res.ok) {
      setRowError({ id, msg: data.error })
      setConfirmDelete(null)
      return
    }

    setCategories((prev) => prev.filter((c) => c.id !== id))
    setRowError(null)
    setConfirmDelete(null)
    // router.push("/admin/categories?deleted=true")
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
    return json.error ?? "Error al crear la categoría"  // ← retorna el mensaje
  }

  const created = await res.json()
  setCategories((prev) => [...prev, { ...created, _count: { products: 0 } }])
  setShowNew(false)
  // router.push("/admin/categories?add=true")
  router.refresh()
}

  return (
    <div className="flex flex-col gap-6">
      {/* <Suspense>
        <Toast message="Se guardó la categoría correctamente"  type="success" triggerParam="success" />
        <Toast message="Se creó la categoría correctamente"    type="success" triggerParam="add"     />
        <Toast message="Se eliminó la categoría correctamente" type="success" triggerParam="deleted" />
      </Suspense> */}

      {/* Botón nueva categoría */}
      {!showNew && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowNew(true)}
            className="bg-stone-900 text-white px-5 py-2.5 text-[11px] uppercase tracking-[0.3em] font-semibold hover:opacity-90 active:opacity-75 transition-opacity duration-200 cursor-pointer"
          >
            + Nueva categoría
          </button>
        </div>
      )}

      {/* Lista de categorías */}
      <div className="flex flex-col gap-8">
        {categories.map((cat, idx) => (
          <div key={cat.id} className="flex flex-col gap-4 pb-8 border-b border-stone-100 last:border-0 last:pb-0">

            {editing === cat.id ? (
              <EditRow cat={cat} onSave={saveEdit} onCancel={cancelEdit} />
            ) : (
              <div className="flex items-center justify-between gap-4">

                {/* Orden + info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Flechas */}
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveOrder(cat.id, "up")}
                      disabled={moveLoading || idx === 0}
                      className="p-0.5 text-stone-400 hover:text-stone-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      aria-label="Subir"
                    >
                      <IconChevronUp size={13} strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveOrder(cat.id, "down")}
                      disabled={moveLoading || idx === categories.length - 1}
                      className="p-0.5 text-stone-400 hover:text-stone-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      aria-label="Bajar"
                    >
                      <IconChevronDown size={13} strokeWidth={2} />
                    </button>
                  </div>

                  {/* Número de orden */}
                  <span className="text-[10px] text-stone-400 tracking-widest w-5 shrink-0">{cat.order}</span>

                  {/* Emoji + nombre */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl leading-none shrink-0">{cat.emoji}</span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-stone-900 font-medium text-sm truncate">{cat.name}</span>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
                        {cat._count.products} {cat._count.products === 1 ? "producto" : "productos"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => startEdit(cat)}
                      className="text-[10px] uppercase tracking-[0.2em] text-stone-500 hover:text-stone-900 border-b border-stone-400 hover:border-stone-900 pb-px transition-colors duration-200 cursor-pointer"
                    >
                      Editar
                    </button>

                    {confirmDelete === cat.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-stone-500 uppercase tracking-[0.15em]">¿Confirmar?</span>
                        <button
                          type="button"
                          onClick={() => deleteCategory(cat.id)}
                          className="text-[10px] uppercase tracking-[0.2em] text-red-500 border-b border-red-400 pb-px cursor-pointer"
                        >
                          Sí
                        </button>
                        <button
                          type="button"
                          onClick={() => { setConfirmDelete(null); setRowError(null) }}
                          className="text-[10px] uppercase tracking-[0.2em] text-stone-500 border-b border-stone-400 pb-px cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setConfirmDelete(cat.id); setRowError(null) }}
                        className="text-[10px] uppercase tracking-[0.2em] text-stone-400 hover:text-red-500 border-b border-stone-300 hover:border-red-500 pb-px transition-colors duration-200 cursor-pointer"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>

                  {rowError?.id === cat.id && (
                    <p className="text-[10px] text-red-500 tracking-wide">{rowError.msg}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Formulario nueva categoría */}
      {showNew && (
        <NewCategoryForm
          nextOrder={getNextOrder(categories)}
          onCreate={createCategory}
          onCancel={() => setShowNew(false)}
        />
      )}
    </div>
  )
}