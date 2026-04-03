"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProductSchema, ProductFormValues } from "@/lib/validators/products"
import ImageUpload from "../components/ImageUpload"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field"
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group"
import { ComboField } from "../components/ComboField"
import { Button } from "@/components/ui/Button"
import { Loader2 } from "lucide-react"

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

const inputClass = `
  w-full bg-white
  border border-stone-300 focus:border-stone-700
  px-4 py-2.5
  text-stone-900 text-sm placeholder:text-stone-400
  outline-none transition-colors duration-200
`

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400">{children}</span>
    <span className="flex-1 h-px bg-stone-100" />
  </div>
)

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
  { value: "BOTH",  label: "Ambos", desc: "Día y noche",        icon: "☀️🌙" },
  { value: "DAY",   label: "Día",   desc: "Solo menú de día",   icon: "☀️"   },
  { value: "NIGHT", label: "Noche", desc: "Solo menú de noche", icon: "🌙"   },
]

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
      slug:         product?.slug              ?? "",
      name:         product?.name              ?? "",
      price:        product?.price             ?? 0,
      category:     product?.category          ?? "",
      tag:          product?.tag               ?? "",
      img:          product?.img               ?? "",
      desc:         product?.desc              ?? "",
      descLong:     product?.descLong          ?? "",
      ingredients:  product?.ingredients.join(", ") ?? "",
      allergens:    product?.allergens.join(", ")   ?? "",
      weight:       product?.weight            ?? "",
      prepTime:     product?.prepTime          ?? "Al momento",
      availability: product?.availability      ?? "BOTH",
    },
  })

  const onSubmit = async (data: ProductFormValues) => {
    setSubmitError("")

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

      if (json.error?.toLowerCase().includes("slug")) {
        setError("slug", { message })
      } else if (json.error?.toLowerCase().includes("nombre")) {
        setError("name", { message })
      } else {
        setSubmitError(message)
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
            {/* <Separator orientation="horizontal" className="w-8" /> */}
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Productos</span>
          </div>
          <h1 className="font-titleText text-foreground uppercase text-4xl sm:text-5xl leading-none">
            {isEditing ? "Editar" : "Nuevo"}
          </h1>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          {submitError && (
            <p className="text-[11px] tracking-wide text-destructive">{submitError}</p>
          )}

          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={() => router.push("/admin")}
            className="text-[10px] cursor-pointer uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground px-0 h-auto"
          >
            Cancelar
          </Button>

          {isEditing && <DeleteButton onConfirm={handleDelete} />}

          <Button
            type="submit"
            form="product-form"
            disabled={isSubmitting}
            className="bg-stone-900 cursor-pointer text-white px-6 py-3 text-[11px] uppercase tracking-[0.3em] font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Guardando…
              </>
            ) : "Guardar"}
          </Button>
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

            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Nombre</FieldLabel>
              <FieldError>{errors.name?.message}</FieldError>
              <Input
                id="name"
                aria-invalid={!!errors.name}
                {...register("name")}
                placeholder="Mollete Clásico"
                className={inputClass}
              />
            </Field>

            <Field data-invalid={!!errors.slug}>
              <FieldLabel htmlFor="slug">Slug</FieldLabel>
              <FieldError>{errors.slug?.message}</FieldError>
              <Input
                id="slug"
                aria-invalid={!!errors.slug}
                {...register("slug")}
                placeholder="mollete-clasico"
                className={inputClass}
              />
              <FieldDescription>
                URL amigable. Solo minúsculas y guiones (ej: mollete-clasico).
              </FieldDescription>
            </Field>

            <Field data-invalid={!!errors.desc}>
              <FieldLabel htmlFor="desc">Descripción corta</FieldLabel>
              <FieldError>{errors.desc?.message}</FieldError>
              <Input
                id="desc"
                aria-invalid={!!errors.desc}
                {...register("desc")}
                placeholder="Una línea descriptiva"
                className={inputClass}
              />
            </Field>

            <FieldSet className="w-full">
              <FieldGroup>
                <Field data-invalid={!!errors.descLong}>
                  <FieldLabel htmlFor="descLong">Descripción larga</FieldLabel>
                  <FieldError>{errors.descLong?.message}</FieldError>
                  <Textarea
                    id="descLong"
                    aria-invalid={!!errors.descLong}
                    {...register("descLong")}
                    placeholder="Descripción extendida del producto…"
                    rows={4}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.price}>
                <FieldLabel htmlFor="price">Precio</FieldLabel>
                <FieldError>{errors.price?.message}</FieldError>
                <Input
                  id="price"
                  aria-invalid={!!errors.price}
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className={inputClass}
                />
                <FieldDescription>
                  Precio unitario de venta al público (IVA incluido).
                </FieldDescription>
              </Field>

              <Field data-invalid={!!errors.weight}>
                <FieldLabel htmlFor="weight">Cantidad</FieldLabel>
                <FieldError>{errors.weight?.message}</FieldError>
                <Input
                  id="weight"
                  aria-invalid={!!errors.weight}
                  {...register("weight")}
                  placeholder="250g"
                  className={inputClass}
                />
                <FieldDescription>
                  Peso neto o piezas por unidad (ej: 250g, 1 pza).
                </FieldDescription>
              </Field>
            </div>

            <Field data-invalid={!!errors.prepTime}>
              <FieldLabel htmlFor="prepTime">Tiempo de preparación</FieldLabel>
              <FieldError>{errors.prepTime?.message}</FieldError>
              <Input
                id="prepTime"
                aria-invalid={!!errors.prepTime}
                {...register("prepTime")}
                placeholder="Al momento"
                className={inputClass}
              />
              <FieldDescription>
                Tiempo estimado de entrega (ej: '15 min', 'Al momento').
              </FieldDescription>
            </Field>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-5 mt-8 lg:mt-0">
            <SectionTitle>Clasificación e imagen</SectionTitle>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <ComboField
                control={control}
                name="category"
                label="Categoría"
                description="Escribe para crear una nueva."
                placeholder="Elige o escribe nueva"
                options={existingCategories}
                error={errors.category?.message}
              />
              <ComboField
                control={control}
                name="tag"
                label="Tag"
                description="Escribe para crear uno nuevo."
                placeholder="Elige o escribe nuevo"
                options={existingTags}
                error={errors.tag?.message}
              />
            </div>

            <FieldGroup>
              <FieldSet>
                <FieldLegend variant="label">Disponibilidad</FieldLegend>
                <FieldDescription>Selecciona cuándo estará disponible este producto.</FieldDescription>
                <FieldError>{errors.availability?.message}</FieldError>
                <Controller
                  control={control}
                  name="availability"
                  render={({ field }) => (
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      {AVAILABILITY_OPTIONS.map((opt) => (
                        <FieldLabel key={opt.value} htmlFor={`availability-${opt.value}`} className="cursor-pointer">
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldTitle>{opt.icon} {opt.label}</FieldTitle>
                              <FieldDescription>{opt.desc}</FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value={opt.value} id={`availability-${opt.value}`} />
                          </Field>
                        </FieldLabel>
                      ))}
                    </RadioGroup>
                  )}
                />
              </FieldSet>
            </FieldGroup>

            <Field data-invalid={!!errors.ingredients}>
              <FieldLabel htmlFor="ingredients">Ingredientes</FieldLabel>
              <FieldError>{errors.ingredients?.message}</FieldError>
              <Input
                id="ingredients"
                aria-invalid={!!errors.ingredients}
                {...register("ingredients")}
                placeholder="harina, sal, levadura"
                className={inputClass}
              />
              <FieldDescription>Separados por coma.</FieldDescription>
            </Field>

            <Field data-invalid={!!errors.allergens}>
              <FieldLabel htmlFor="allergens">Alérgenos</FieldLabel>
              <FieldError>{errors.allergens?.message}</FieldError>
              <Input
                id="allergens"
                aria-invalid={!!errors.allergens}
                {...register("allergens")}
                placeholder="gluten, lácteos"
                className={inputClass}
              />
              <FieldDescription>Separados por coma.</FieldDescription>
            </Field>

            <Field data-invalid={!!errors.img}>
              <FieldLabel htmlFor="img">Imagen</FieldLabel>
              <FieldError>{errors.img?.message}</FieldError>
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