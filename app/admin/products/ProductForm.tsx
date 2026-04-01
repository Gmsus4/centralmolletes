"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProductSchema, ProductFormValues } from "@/lib/validators/products"
import ImageUpload from "../components/ImageUpload"
import { ComboBox } from "../components/ComboBox"

// ─── Types ────────────────────────────────────────────────────────────────────

type Availability = "DAY" | "NIGHT" | "BOTH"

type Product = {
  id?: string
  slug: string
  name: string
  price: number
  category: string
  tag: string
  img: string
  desc: string
  descLong: string
  ingredients: string[]
  allergens: string[]
  weight: string
  prepTime: string
  availability: Availability
}

type Props = {
  product?: Product
  existingCategories: string[]
  existingTags: string[]
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

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400">{children}</span>
    <span className="flex-1 h-px bg-stone-100" />
  </div>
)

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass}>{label}</label>
      {children}
      {hint && !error && (
        <span className="text-[9px] uppercase tracking-[0.2em] text-stone-400">{hint}</span>
      )}
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  )
}

function DeleteButton({ onConfirm }: { onConfirm: () => void }) {
  const [confirm, setConfirm] = useState(false)

  if (confirm) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500">¿Confirmar?</span>
        <button
          type="button"
          onClick={onConfirm}
          className="text-[10px] uppercase tracking-[0.2em] text-red-500 hover:text-red-700 border-b border-red-400 hover:border-red-700 pb-px transition-colors duration-200 cursor-pointer"
        >
          Sí, eliminar
        </button>
        <button
          type="button"
          onClick={() => setConfirm(false)}
          className="text-[10px] uppercase tracking-[0.2em] text-stone-500 hover:text-stone-700 border-b border-stone-400 hover:border-stone-700 pb-px transition-colors duration-200 cursor-pointer"
        >
          No
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirm(true)}
      className="text-[10px] uppercase tracking-[0.2em] text-stone-400 hover:text-red-500 border-b border-stone-300 hover:border-red-500 pb-px transition-colors duration-200 cursor-pointer"
    >
      Eliminar
    </button>
  )
}

const AVAILABILITY_OPTIONS: { value: Availability; label: string; desc: string; icon: string }[] = [
  { value: "BOTH",  label: "Ambos", desc: "Día y noche",      icon: "☀️🌙" },
  { value: "DAY",   label: "Día",   desc: "Solo menú de día", icon: "☀️"   },
  { value: "NIGHT", label: "Noche", desc: "Solo menú de noche", icon: "🌙" },
]

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProductForm({ product, existingCategories, existingTags }: Props) {
  const router = useRouter()
  const isEditing = !!product?.id
  const [submitError, setSubmitError] = useState("")

  const {
    register,
    handleSubmit,
    control,
    setError, 
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      slug:         product?.slug        ?? "",
      name:         product?.name        ?? "",
      price:        product?.price       ?? 0,
      category:     product?.category    ?? "",
      tag:          product?.tag         ?? "",
      img:          product?.img         ?? "",
      desc:         product?.desc        ?? "",
      descLong:     product?.descLong    ?? "",
      ingredients:  product?.ingredients.join(", ") ?? "",
      allergens:    product?.allergens.join(", ")   ?? "",
      weight:       product?.weight      ?? "",
      prepTime:     product?.prepTime    ?? "Al momento",
      availability: product?.availability ?? "BOTH",
    },
  })

  const onSubmit = async (data: ProductFormValues) => {
    setSubmitError("")

    // Aquí hacemos el transform: string → array antes de enviar al API
    const payload = {
      ...data,
      ingredients: data.ingredients.split(",").map((s) => s.trim()).filter(Boolean),
      allergens:   data.allergens.split(",").map((s) => s.trim()).filter(Boolean),
    }

    const url    = isEditing ? `/api/products/${product!.id}` : "/api/products"
    const method = isEditing ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      const message = json.error ?? "Hubo un error al guardar"

      // Si el error es de slug duplicado, lo mostramos en el campo slug
      if (json.error?.toLowerCase().includes("slug")) {
        setError("slug", { message })
      } else if (json.error?.toLowerCase().includes("nombre")) {
        setError("name", { message })
      } else {
        setSubmitError(message)  // error genérico en el header
      }
      return
    }

    router.push("/admin/products?success=true")
    router.refresh()
  }

  const handleDelete = useCallback(async () => {
    await fetch(`/api/products/${product!.id}`, { method: "DELETE" })
    router.push("/admin/products?deleted=true")
    router.refresh()
  }, [product, router])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-stone-400" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Productos</span>
          </div>
          <h1 className="font-titleText text-stone-900 uppercase text-4xl sm:text-5xl leading-none">
            {isEditing ? "Editar" : "Nuevo"}
          </h1>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          {submitError && <p className="text-[11px] tracking-wide text-red-500">{submitError}</p>}
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="text-[10px] uppercase tracking-[0.25em] text-stone-500 hover:text-stone-900 border-b border-stone-400 hover:border-stone-900 pb-px transition-colors duration-200 cursor-pointer"
          >
            Cancelar
          </button>
          {isEditing && <DeleteButton onConfirm={handleDelete} />}
          <button
            type="submit"
            form="product-form"
            disabled={isSubmitting}
            className="bg-stone-900 text-white px-6 py-3 text-[11px] uppercase tracking-[0.3em] font-semibold hover:opacity-90 active:opacity-75 disabled:opacity-50 transition-opacity duration-200 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border border-white/30 border-t-white animate-spin" />
                Guardando…
              </span>
            ) : "Guardar"}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-8">
        <span className="flex-1 h-px bg-stone-200" />
        <span className="w-1 h-1 rounded-full bg-stone-300" />
        <span className="flex-1 h-px bg-stone-200" />
      </div>

      <form id="product-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-5">
            <SectionTitle>Información general</SectionTitle>

            <Field label="Nombre" error={errors.name?.message}>
              <input
                {...register("name")}
                placeholder="Mollete Clásico"
                className={inputClass}
              />
            </Field>

            <Field label="Slug" error={errors.slug?.message}>
              <input
                {...register("slug")}
                placeholder="mollete-clasico"
                className={inputClass}
              />
            </Field>

            <Field label="Descripción corta" error={errors.desc?.message}>
              <input
                {...register("desc")}
                placeholder="Una línea descriptiva"
                className={inputClass}
              />
            </Field>

            <Field label="Descripción larga" error={errors.descLong?.message}>
              <textarea
                {...register("descLong")}
                rows={4}
                placeholder="Descripción extendida del producto…"
                className={`${inputClass} resize-none`}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Precio" error={errors.price?.message}>
                <input
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className={inputClass}
                />
              </Field>

              <Field label="Peso" error={errors.weight?.message}>
                <input
                  {...register("weight")}
                  placeholder="250g"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Tiempo de preparación" error={errors.prepTime?.message}>
              <input
                {...register("prepTime")}
                placeholder="Al momento"
                className={inputClass}
              />
            </Field>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-5 mt-8 lg:mt-0">
            <SectionTitle>Clasificación e imagen</SectionTitle>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Categoría" hint="Escribe para crear nueva" error={errors.category?.message}>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <ComboBox
                      value={field.value}
                      onChange={field.onChange}
                      options={existingCategories}
                      placeholder="Elige o escribe nueva"
                    />
                  )}
                />
              </Field>

              <Field label="Tag" hint="Escribe para crear nuevo" error={errors.tag?.message}>
                <Controller
                  control={control}
                  name="tag"
                  render={({ field }) => (
                    <ComboBox
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      options={existingTags}
                      placeholder="Elige o escribe nuevo"
                    />
                  )}
                />
              </Field>
            </div>

            <Field label="Disponibilidad" error={errors.availability?.message}>
              <Controller
                control={control}
                name="availability"
                render={({ field }) => (
                  <div className="grid grid-cols-3 gap-2">
                    {AVAILABILITY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => field.onChange(opt.value)}
                        className={`
                          flex flex-col items-center gap-1 py-3 px-2 border transition-colors duration-150 cursor-pointer
                          ${field.value === opt.value
                            ? "bg-stone-900 border-stone-900 text-white"
                            : "bg-white border-stone-300 text-stone-600 hover:border-stone-600"}
                        `}
                      >
                        <span className="text-base leading-none">{opt.icon}</span>
                        <span className="text-[10px] uppercase tracking-[0.15em] font-semibold leading-none">
                          {opt.label}
                        </span>
                        <span className={`text-[9px] leading-none ${field.value === opt.value ? "text-white/70" : "text-stone-400"}`}>
                          {opt.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              />
            </Field>

            <Field label="Ingredientes" hint="Separados por coma" error={errors.ingredients?.message}>
              <input
                {...register("ingredients")}
                placeholder="harina, sal, levadura"
                className={inputClass}
              />
            </Field>

            <Field label="Alérgenos" hint="Separados por coma" error={errors.allergens?.message}>
              <input
                {...register("allergens")}
                placeholder="gluten, lácteos"
                className={inputClass}
              />
            </Field>

            <Field label="Imagen" error={errors.img?.message}>
              <Controller
                control={control}
                name="img"
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Field>
          </div>
        </div>

        {/* Mobile actions */}
        <div className="sm:hidden flex flex-col gap-4 mt-8 pt-6 border-t border-stone-100">
          {submitError && (
            <p className="text-[11px] tracking-wide text-red-500 text-center">{submitError}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-stone-900 text-white px-6 py-3 text-[11px] uppercase tracking-[0.3em] font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity duration-200 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Guardando…" : "Guardar"}
          </button>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="text-[10px] uppercase tracking-[0.25em] text-stone-500 hover:text-stone-900 border-b border-stone-400 pb-px transition-colors duration-200 cursor-pointer"
            >
              Cancelar
            </button>
            {isEditing && <DeleteButton onConfirm={handleDelete} />}
          </div>
        </div>
      </form>
    </div>
  )
}