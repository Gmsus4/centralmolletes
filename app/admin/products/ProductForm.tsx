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
import { Separator as UISeparator } from "@/components/ui/separator"
import { AdminFormLayout } from "../components/AdminFormLayout"
import { SavingOverlay } from "@/components/ui/saving-overlay"
import { useDuplicate } from "@/hooks/useDuplicate"
import { useFormOverlay } from "@/hooks/useFormOverlay"

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

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{children}</span>
    <UISeparator className="flex-1" />
  </div>
)

const AVAILABILITY_OPTIONS: { value: Availability; label: string; desc: string; icon: string }[] = [
  { value: "BOTH", label: "Ambos", desc: "Día y noche", icon: "☀️🌙" },
  { value: "DAY", label: "Día", desc: "Solo menú de día", icon: "☀️" },
  { value: "NIGHT", label: "Noche", desc: "Solo menú de noche", icon: "🌙" },
]

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProductForm({ product, existingCategories, existingTags }: Props) {
  const router = useRouter()
  const isEditing = !!product?.id
  const [submitError, setSubmitError] = useState("")
  const { overlayMode, setOverlayMode, isVisible } = useFormOverlay()

  const {
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      slug: product?.slug ?? "",
      name: product?.name ?? "",
      price: product?.price ?? 0,
      category: product?.category ?? "",
      tag: product?.tag ?? "",
      img: product?.img ?? "",
      desc: product?.desc ?? "",
      descLong: product?.descLong ?? "",
      ingredients: Array.isArray(product?.ingredients) ? product.ingredients.join(", ") : "",
      allergens: Array.isArray(product?.allergens) ? product.allergens.join(", ") : "",
      weight: product?.weight ?? "",
      prepTime: product?.prepTime ?? "Al momento",
      availability: product?.availability ?? "BOTH",
    },
  })

  const handleDuplicate = useDuplicate({
    apiPath:      "/api/products",
    redirectPath: "/admin/products",
    imageField: "img",
    getValues,
    setOverlayMode,
    setSubmitError,
  })

  const onSubmit = async (data: ProductFormValues) => {
    setSubmitError("")
    setOverlayMode("saving")

    const payload = {
      ...data,
      ingredients: data.ingredients
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      allergens: data.allergens
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }

    const url = isEditing ? `/api/products/${product!.id}` : "/api/products"
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
      setOverlayMode(null)
      return
    }

    router.push("/admin/products?success=true")
    router.refresh()
  }

  const handleDelete = useCallback(async () => {
    setOverlayMode("deleting")
    await fetch(`/api/products/${product!.id}`, { method: "DELETE" })
    router.push("/admin/products?deleted=true")
    router.refresh()
  }, [product, router])

  return (
    <AdminFormLayout
      section="Productos"
      title={isEditing ? "Editar" : "Nuevo"}
      backHref="/admin/products"
      formId="product-form"
      isEditing={isEditing}
      isSubmitting={isSubmitting}
      submitError={submitError}
      onDelete={isEditing ? handleDelete : undefined}
      deleteTitle="¿Eliminar producto?"
      deleteDescription="Esta acción no se puede deshacer. El producto será eliminado permanentemente."
      previewHref={isEditing ? `/menu/${watch("slug")}` : undefined}
      onDuplicate={isEditing ? handleDuplicate : undefined}
    >
      <SavingOverlay isVisible={isVisible} mode={overlayMode ?? "saving"} />
      <form id="product-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-5">
            <SectionTitle>Información general</SectionTitle>

            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Nombre</FieldLabel>
              <FieldError>{errors.name?.message}</FieldError>
              <Input id="name" aria-invalid={!!errors.name} {...register("name")} placeholder="Mollete Clásico" className={inputClass} />
            </Field>

            <Field data-invalid={!!errors.slug}>
              <FieldLabel htmlFor="slug">Slug</FieldLabel>
              <FieldError>{errors.slug?.message}</FieldError>
              <Input id="slug" aria-invalid={!!errors.slug} {...register("slug")} placeholder="mollete-clasico" className={inputClass} />
              <FieldDescription>URL amigable. Solo minúsculas y guiones (ej: mollete-clasico).</FieldDescription>
            </Field>

            <Field data-invalid={!!errors.desc}>
              <FieldLabel htmlFor="desc">Descripción corta</FieldLabel>
              <FieldError>{errors.desc?.message}</FieldError>
              <Input id="desc" aria-invalid={!!errors.desc} {...register("desc")} placeholder="Una línea descriptiva" className={inputClass} />
            </Field>

            <FieldSet className="w-full">
              <FieldGroup>
                <Field data-invalid={!!errors.descLong}>
                  <FieldLabel htmlFor="descLong">Descripción larga</FieldLabel>
                  <FieldError>{errors.descLong?.message}</FieldError>
                  <Textarea id="descLong" aria-invalid={!!errors.descLong} {...register("descLong")} placeholder="Descripción extendida del producto…" rows={4} />
                </Field>
              </FieldGroup>
            </FieldSet>

            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.price}>
                <FieldLabel htmlFor="price">Precio</FieldLabel>
                <FieldError>{errors.price?.message}</FieldError>
                <Input id="price" aria-invalid={!!errors.price} {...register("price", { valueAsNumber: true })} type="number" step="1" className={inputClass} />
                <FieldDescription>Precio unitario de venta al público (IVA incluido).</FieldDescription>
              </Field>

              <Field data-invalid={!!errors.weight}>
                <FieldLabel htmlFor="weight">Cantidad</FieldLabel>
                <FieldError>{errors.weight?.message}</FieldError>
                <Input id="weight" aria-invalid={!!errors.weight} {...register("weight")} placeholder="250g" className={inputClass} />
                <FieldDescription>Peso neto o piezas por unidad (ej: 250g, 1 pza).</FieldDescription>
              </Field>
            </div>

            <Field data-invalid={!!errors.prepTime}>
              <FieldLabel htmlFor="prepTime">Tiempo de preparación</FieldLabel>
              <FieldError>{errors.prepTime?.message}</FieldError>
              <Input id="prepTime" aria-invalid={!!errors.prepTime} {...register("prepTime")} placeholder="Al momento" className={inputClass} />
              <FieldDescription>Tiempo estimado de entrega (ej: '15 min', 'Al momento').</FieldDescription>
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
              <ComboField control={control} name="tag" label="Tag" description="Escribe para crear uno nuevo." placeholder="Elige o escribe nuevo" options={existingTags} error={errors.tag?.message} />
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
                              <FieldTitle>
                                {opt.icon} {opt.label}
                              </FieldTitle>
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
              <Input id="ingredients" aria-invalid={!!errors.ingredients} {...register("ingredients")} placeholder="harina, sal, levadura" className={inputClass} />
              <FieldDescription>Separados por coma.</FieldDescription>
            </Field>

            <Field data-invalid={!!errors.allergens}>
              <FieldLabel htmlFor="allergens">Alérgenos</FieldLabel>
              <FieldError>{errors.allergens?.message}</FieldError>
              <Input id="allergens" aria-invalid={!!errors.allergens} {...register("allergens")} placeholder="gluten, lácteos" className={inputClass} />
              <FieldDescription>Separados por coma.</FieldDescription>
            </Field>

            <Field data-invalid={!!errors.img}>
              <FieldLabel htmlFor="img">Imagen</FieldLabel>
              <FieldError>{errors.img?.message}</FieldError>
              <Controller control={control} name="img" render={({ field }) => <ImageUpload folder="products" value={field.value} onChange={field.onChange} />} />
            </Field>
          </div>
        </div>
      </form>
    </AdminFormLayout>
  )
}
