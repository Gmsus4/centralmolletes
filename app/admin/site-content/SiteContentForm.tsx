"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  SiteContentSchema,
  SiteContentFormValues,
  SITE_CONTENT_SECTIONS,
  SITE_CONTENT_TYPES,
} from "@/lib/validators/siteContent"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { AdminFormLayout } from "../components/AdminFormLayout"
import { SavingOverlay } from "@/components/ui/saving-overlay"
import { useFormOverlay } from "@/hooks/useFormOverlay"
import { IconPicker } from "./IconPicker"

type SiteContent = {
  id:      string
  key:     string
  value:   string
  section: string
  label:   string
  type:    string
}

type Props = { siteContent?: SiteContent }

export default function SiteContentForm({ siteContent }: Props) {
  const router    = useRouter()
  const isEditing = !!siteContent?.id
  const [submitError, setSubmitError] = useState("")
  const { overlayMode, setOverlayMode, isVisible } = useFormOverlay()

  const searchParams   = useSearchParams()
  const sectionFromUrl = searchParams.get("section") as SiteContentFormValues["section"] | null

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SiteContentFormValues, any, SiteContentFormValues>({
    resolver: zodResolver(SiteContentSchema),
    defaultValues: {
      key:     siteContent?.key     ?? "",
      value:   siteContent?.value   ?? "",
      section: (siteContent?.section as SiteContentFormValues["section"]) ?? sectionFromUrl ?? undefined,
      label:   siteContent?.label   ?? "",
      type:    (siteContent?.type   as SiteContentFormValues["type"])    ?? "text",
    },
  })

  const selectedType    = watch("type")
  const selectedSection = watch("section")
  const sectionMeta     = SITE_CONTENT_SECTIONS.find((s) => s.value === selectedSection)

  const onSubmit = async (data: SiteContentFormValues) => {
    setSubmitError("")
    setOverlayMode("saving")

    const url    = isEditing ? `/api/site-content/${siteContent!.id}` : "/api/site-content"
    const method = isEditing ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    })

    if (!res.ok) {
      const json    = await res.json().catch(() => ({}))
      setSubmitError(json.error ?? "Hubo un error al guardar")
      setOverlayMode(null)
      return
    }

    router.push("/admin/site-content")
    router.refresh()
  }

  const handleDelete = async () => {
    setOverlayMode("deleting")
    await fetch(`/api/site-content/${siteContent!.id}`, { method: "DELETE" })
    router.push("/admin/site-content")
    router.refresh()
  }

  return (
    <AdminFormLayout
      section="Contenido del sitio"
      title={isEditing ? "Editar item" : "Nuevo item"}
      backHref="/admin/site-content"
      formId="site-content-form"
      isEditing={isEditing}
      isSubmitting={isSubmitting}
      submitError={submitError}
      onDelete={isEditing ? handleDelete : undefined}
      deleteTitle="¿Eliminar item?"
      deleteDescription="Esta acción no se puede deshacer."
    >
      <SavingOverlay isVisible={isVisible} mode={overlayMode ?? "saving"} />

      <form id="site-content-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">

          {/* ── LEFT — metadata ── */}
          <div className="flex flex-col gap-5">

            {/* Sección */}
            <Field data-invalid={!!errors.section}>
              <FieldLabel>Sección de la página</FieldLabel>
              <Controller
                control={control}
                name="section"
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    {SITE_CONTENT_SECTIONS.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => field.onChange(s.value)}
                        className={`flex flex-col gap-0.5 text-left px-4 py-3 border transition-colors cursor-pointer ${
                          field.value === s.value
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        <span className={`text-[10px] uppercase tracking-[0.2em] font-semibold ${field.value === s.value ? "text-white" : "text-stone-800"}`}>
                          {s.label}
                        </span>
                        <span className={`text-[11px] leading-snug ${field.value === s.value ? "text-stone-300" : "text-stone-400"}`}>
                          {s.description}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              />
              <FieldError>{errors.section?.message}</FieldError>
            </Field>

            {/* Tipo */}
            <Field data-invalid={!!errors.type}>
              <FieldLabel>Tipo de campo</FieldLabel>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <div className="flex gap-2">
                    {SITE_CONTENT_TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => field.onChange(t)}
                        className={`flex-1 py-2 text-[10px] uppercase tracking-[0.2em] font-semibold border transition-colors cursor-pointer ${
                          field.value === t
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              />
              <FieldError>{errors.type?.message}</FieldError>
            </Field>

            {/* Key */}
            <Field data-invalid={!!errors.key}>
              <FieldLabel htmlFor="key">Key</FieldLabel>
              <Input
                id="key"
                {...register("key")}
                placeholder="hero.title"
                aria-invalid={!!errors.key}
                className="font-mono text-sm"
                // En edición la key no debería cambiar fácilmente
                readOnly={isEditing}
              />
              <FieldError>{errors.key?.message}</FieldError>
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Solo minúsculas, números, puntos y guiones. No se puede cambiar después.
              </span>
            </Field>

            {/* Label */}
            <Field data-invalid={!!errors.label}>
              <FieldLabel htmlFor="label">Etiqueta legible</FieldLabel>
              <Input
                id="label"
                {...register("label")}
                placeholder="Título principal del hero"
                aria-invalid={!!errors.label}
              />
              <FieldError>{errors.label?.message}</FieldError>
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Solo para identificarlo en el admin, no aparece en el sitio
              </span>
            </Field>
          </div>

          {/* ── RIGHT — valor ── */}
          <div className="flex flex-col gap-5 mt-8 lg:mt-0">
            <Field data-invalid={!!errors.value}>
              <FieldLabel>
                {selectedType === "icon" ? "Ícono" : "Valor"}
              </FieldLabel>

              {sectionMeta && (
                <p className="text-[11px] text-stone-400 mb-2 leading-snug">
                  Sección:{" "}
                  <span className="font-semibold text-stone-600">{sectionMeta.label}</span>.{" "}
                  {sectionMeta.description}
                </p>
              )}

              <Controller
                control={control}
                name="value"
                render={({ field }) => {
                  if (selectedType === "icon") {
                    return <IconPicker value={field.value} onChange={field.onChange} />
                  }
                  if (selectedType === "textarea") {
                    return (
                      <textarea
                        value={field.value}
                        onChange={field.onChange}
                        rows={5}
                        placeholder="Escribe el contenido..."
                        className="w-full border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:border-stone-400 resize-y"
                      />
                    )
                  }
                  return (
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Escribe el valor..."
                      aria-invalid={!!errors.value}
                    />
                  )
                }}
              />
              <FieldError>{errors.value?.message}</FieldError>
            </Field>
          </div>

        </div>
      </form>
    </AdminFormLayout>
  )
}