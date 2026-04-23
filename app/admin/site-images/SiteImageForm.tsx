"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SiteImageSchema, SiteImageFormValues, SITE_IMAGE_SECTIONS } from "@/lib/validators/siteImage"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { AdminFormLayout } from "../components/AdminFormLayout"
import { SavingOverlay } from "@/components/ui/saving-overlay"
import { useFormOverlay } from "@/hooks/useFormOverlay"
import ImageUpload from "../components/ImageUpload"

type SiteImage = {
  id:      string
  section: string
  src:     string
  alt:     string
  order:   number
}

type Props = {
  siteImage?: SiteImage
}

export default function SiteImageForm({ siteImage }: Props) {
  const router    = useRouter()
  const isEditing = !!siteImage?.id
  const [submitError, setSubmitError] = useState("")
  const { overlayMode, setOverlayMode, isVisible } = useFormOverlay()
  
  const searchParams = useSearchParams()
  const sectionFromUrl = searchParams.get("section") as SiteImageFormValues["section"] | null
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SiteImageFormValues, any, SiteImageFormValues>({
    resolver: zodResolver(SiteImageSchema),
    defaultValues: {
      section: (siteImage?.section as SiteImageFormValues["section"]) ?? sectionFromUrl ?? undefined,
      src:     siteImage?.src   ?? "",
      alt:     siteImage?.alt   ?? "",
      order:   siteImage?.order ?? 0,
    },
  })

  const selectedSection = watch("section")
  const sectionMeta = SITE_IMAGE_SECTIONS.find((s) => s.value === selectedSection)

  const onSubmit = async (data: SiteImageFormValues) => {
    setSubmitError("")
    setOverlayMode("saving")

    const url    = isEditing ? `/api/site-images/${siteImage!.id}` : "/api/site-images"
    const method = isEditing ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    })

    if (!res.ok) {
      const json    = await res.json().catch(() => ({}))
      const message = json.error ?? "Hubo un error al guardar"
      setSubmitError(message)
      setOverlayMode(null)
      return
    }

    router.push("/admin/site-images?success=true")
    router.refresh()
  }

  const handleDelete = async () => {
    setOverlayMode("deleting")
    await fetch(`/api/site-images/${siteImage!.id}`, { method: "DELETE" })
    router.push("/admin/site-images?deleted=true")
    router.refresh()
  }

  return (
    <AdminFormLayout
      section="Imágenes del sitio"
      title={isEditing ? "Editar imagen" : "Nueva imagen"}
      backHref="/admin/site-images"
      formId="site-image-form"
      isEditing={isEditing}
      isSubmitting={isSubmitting}
      submitError={submitError}
      onDelete={isEditing ? handleDelete : undefined}
      deleteTitle="¿Eliminar imagen?"
      deleteDescription="Esta acción no se puede deshacer. La imagen será eliminada permanentemente de Cloudinary."
    >
      <SavingOverlay isVisible={isVisible} mode={overlayMode ?? "saving"} />

      <form id="site-image-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-5">

            {/* Sección */}
            <Field data-invalid={!!errors.section}>
              <FieldLabel>Sección de la página</FieldLabel>
              <Controller
                control={control}
                name="section"
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    {SITE_IMAGE_SECTIONS.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => field.onChange(s.value)}
                        className={`flex flex-col gap-0.5 text-left px-4 py-3 border transition-colors cursor-pointer ${
                          field.value === s.value
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background text-muted-foreground border-border hover:border-foreground/40"
                        }`}
                      >
                        <span className={`text-[10px] uppercase tracking-[0.2em] font-semibold ${field.value === s.value ? "text-background" : "text-foreground"}`}>
                          {s.label}
                        </span>
                        <span className={`text-[11px] leading-snug ${field.value === s.value ? "text-background/70" : "text-muted-foreground"}`}>
                          {s.description}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              />
              <FieldError>{errors.section?.message}</FieldError>
            </Field>

            {/* Alt text */}
            <Field data-invalid={!!errors.alt}>
              <FieldLabel htmlFor="alt">Texto alternativo (alt)</FieldLabel>
              <Input
                id="alt"
                {...register("alt")}
                placeholder="Barista preparando café en Central Molletes"
                aria-invalid={!!errors.alt}
              />
              <FieldError>{errors.alt?.message}</FieldError>
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Describe la imagen para accesibilidad y SEO
              </span>
            </Field>

            {/* Order */}
            <Field data-invalid={!!errors.order}>
              <FieldLabel htmlFor="order">Orden</FieldLabel>
              <Input
                id="order"
                type="number"
                min={0}
                {...register("order", { valueAsNumber: true })}
                placeholder="0"
                aria-invalid={!!errors.order}
                className="w-28"
              />
              <FieldError>{errors.order?.message}</FieldError>
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Número menor = aparece primero dentro de la sección
              </span>
            </Field>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-5 mt-8 lg:mt-0">

            {/* Imagen */}
            <Field data-invalid={!!errors.src}>
              <FieldLabel>Imagen</FieldLabel>
              {sectionMeta && (
                <p className="text-[11px] text-muted-foreground mb-2 leading-snug">
                  Esta imagen aparecerá en: <span className="font-semibold text-foreground">{sectionMeta.label}</span>. {sectionMeta.description}
                </p>
              )}
              <Controller
                control={control}
                name="src"
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    folder="site"
                  />
                )}
              />
              <FieldError>{errors.src?.message}</FieldError>
            </Field>
          </div>

        </div>
      </form>
    </AdminFormLayout>
  )
}