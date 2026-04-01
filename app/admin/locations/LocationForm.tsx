"use client"

import { Suspense, useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LocationSchema, LocationFormValues } from "@/lib/validators/location"
import { IconX } from "@tabler/icons-react"
import ImageUpload from "../components/ImageUpload"
import Toast from "@/components/ui/Toast"

// ─── Types ────────────────────────────────────────────────────────────────────

type Location = {
  id: string
  slug: string
  city: string
  name: string
  address: string
  addressMin: string
  phone: string
  hours: string
  image: string
  gallery: string[]
  mapUrl: string
  embedUrl: string
}

type Props = {
  location?: Location
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
  label: React.ReactNode
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
          className="text-[10px] uppercase tracking-[0.2em] text-stone-500 border-b border-stone-400 pb-px transition-colors duration-200 cursor-pointer"
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

// ─── Main component ───────────────────────────────────────────────────────────

export default function LocationForm({ location }: Props) {
  const router    = useRouter()
  const isEditing = !!location?.id
  const [submitError, setSubmitError] = useState("")

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError, 
    formState: { errors, isSubmitting },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(LocationSchema),
    defaultValues: {
      slug:       location?.slug       ?? "",
      city:       location?.city       ?? "",
      name:       location?.name       ?? "",
      address:    location?.address    ?? "",
      addressMin: location?.addressMin ?? "",
      phone:      location?.phone      ?? "",
      hours:      location?.hours      ?? "",
      image:      location?.image      ?? "",
      gallery:    location?.gallery    ?? [],
      mapUrl:     location?.mapUrl     ?? "",
      embedUrl:   location?.embedUrl   ?? "",
    },
  })

  // Observamos gallery para renderizar la lista
  const gallery = watch("gallery") ?? []

  function addToGallery(url: string) {
    if (!url) return
    setValue("gallery", [...gallery, url], { shouldValidate: true })
  }

  function removeFromGallery(idx: number) {
    setValue(
      "gallery",
      gallery.filter((_, i) => i !== idx),
      { shouldValidate: true }
    )
  }

  const onSubmit = async (data: LocationFormValues) => {
    setSubmitError("")

    const url    = isEditing ? `/api/locations/${location!.id}` : "/api/locations"
    const method = isEditing ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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
      return  // ← quita el router.push de error, ya no es necesario
    }

    router.push("/admin/locations?success=true")
    router.refresh()
  }

  const handleDelete = useCallback(async () => {
    await fetch(`/api/locations/${location!.id}`, { method: "DELETE" })
    router.push("/admin/locations?deleted=true")
    router.refresh()
  }, [location, router])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-stone-400" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Locaciones</span>
          </div>
          <h1 className="font-titleText text-stone-900 uppercase text-4xl sm:text-5xl leading-none">
            {isEditing ? "Editar" : "Nueva"}
          </h1>
        </div>

        {/* Desktop actions */}
        <div className="hidden sm:flex items-center gap-4">
          {/* {submitError && <p className="text-[11px] tracking-wide text-red-500">{submitError}</p>} */}
          <button
            type="button"
            onClick={() => router.push("/admin/locations")}
            className="text-[10px] uppercase tracking-[0.25em] text-stone-500 hover:text-stone-900 border-b border-stone-400 hover:border-stone-900 pb-px transition-colors duration-200 cursor-pointer"
          >
            Cancelar
          </button>
          {isEditing && <DeleteButton onConfirm={handleDelete} />}
          <button
            type="submit"
            form="location-form"
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

      <form id="location-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-5">
            <SectionTitle>Información general</SectionTitle>

            <Field label="Nombre" error={errors.name?.message}>
              <input
                {...register("name")}
                placeholder="Central Molletes Cafetería"
                className={inputClass}
              />
            </Field>

            <Field label="Slug" error={errors.slug?.message}>
              <input
                {...register("slug")}
                placeholder="etzatlan"
                className={inputClass}
              />
            </Field>

            <Field label="Ciudad" error={errors.city?.message}>
              <input
                {...register("city")}
                placeholder="Etzatlán"
                className={inputClass}
              />
            </Field>

            <Field label="Dirección completa" error={errors.address?.message}>
              <input
                {...register("address")}
                placeholder="Ocampo 63, Centro, 46500 Etzatlán, Jal."
                className={inputClass}
              />
            </Field>

            <Field label="Dirección corta" error={errors.addressMin?.message}>
              <input
                {...register("addressMin")}
                placeholder="Ocampo 63, Centro"
                className={inputClass}
              />
            </Field>

            <Field label="Teléfono" error={errors.phone?.message}>
              <input
                {...register("phone")}
                placeholder="+52 (386) 105-4528"
                className={inputClass}
              />
            </Field>

            <Field label="Horario" error={errors.hours?.message}>
              <input
                {...register("hours")}
                placeholder="8:30 am – 1:00 pm | 7:00 pm – 10:30 pm"
                className={inputClass}
              />
            </Field>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-5 mt-8 lg:mt-0">
            <SectionTitle>Mapa e imágenes</SectionTitle>

            <Field label="URL Google Maps" error={errors.mapUrl?.message}>
              <input
                {...register("mapUrl")}
                placeholder="https://maps.app.goo.gl/..."
                className={inputClass}
              />
            </Field>

            <Field label="Embed URL Maps" error={errors.embedUrl?.message}>
              <textarea
                {...register("embedUrl")}
                rows={3}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className={`${inputClass} resize-none`}
              />
            </Field>

            {/* Imagen principal */}
            <Field label="Imagen principal" error={errors.image?.message}>
              <Controller
                control={control}
                name="image"
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    folder="locations"
                  />
                )}
              />
            </Field>

            {/* Galería */}
            <Field
              label={
                <>
                  Galería{" "}
                  <span className="ml-2 normal-case text-stone-400 tracking-normal">
                    ({gallery.length} imagen{gallery.length !== 1 ? "es" : ""})
                  </span>
                </>
              }
              hint="Cada subida agrega una imagen a la galería"
              error={errors.gallery?.message}
            >
              {/* Imágenes existentes */}
              {gallery.length > 0 && (
                <div className="flex flex-col gap-2 mb-2">
                  {gallery.map((url, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2 border border-stone-200 bg-stone-50"
                    >
                      <div className="w-12 h-12 rounded overflow-hidden shrink-0">
                        <img
                          src={url}
                          alt={`Galería ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="flex-1 text-xs text-stone-400 font-mono truncate">{url}</span>
                      <button
                        type="button"
                        onClick={() => removeFromGallery(idx)}
                        className="p-1 text-stone-300 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                        aria-label="Quitar imagen"
                      >
                        <IconX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Subir nueva a galería */}
              <ImageUpload
                folder="locations"
                value=""
                onChange={addToGallery}
              />
            </Field>
          </div>
        </div>

        {/* Mobile actions */}
        <div className="sm:hidden flex flex-col gap-4 mt-8 pt-6 border-t border-stone-100">
          {/* {submitError && (
            <p className="text-[11px] tracking-wide text-red-500 text-center">{submitError}</p>
          )} */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-stone-900 text-white px-6 py-3 text-[11px] uppercase tracking-[0.3em] font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Guardando…" : "Guardar"}
          </button>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push("/admin/locations")}
              className="text-[10px] uppercase tracking-[0.25em] text-stone-500 hover:text-stone-900 border-b border-stone-400 pb-px transition-colors cursor-pointer"
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