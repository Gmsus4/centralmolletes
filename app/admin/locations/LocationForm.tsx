"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LocationSchema, LocationFormValues } from "@/lib/validators/location"
import { IconX } from "@tabler/icons-react"
import ImageUpload from "../components/ImageUpload"
import { Button } from "@/components/ui/button"
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AdminFormLayout } from "../components/AdminFormLayout"
import { useFormOverlay } from "@/hooks/useFormOverlay"
import { SavingOverlay } from "@/components/ui/saving-overlay"
import { useDuplicate } from "@/hooks/useDuplicate"
import { Separator } from "@/components/ui/separator"

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
        <Button type="button" variant="destructive" className="cursor-pointer">
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
          <AlertDialogDescription>Esta acción no se puede deshacer. La sucursal será eliminada permanentemente.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive cursor-pointer text-destructive-foreground hover:bg-destructive/90">
            Sí, eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LocationForm({ location }: Props) {
  const router = useRouter()
  const isEditing = !!location?.id
  const [submitError, setSubmitError] = useState("")
  const { overlayMode, setOverlayMode, isVisible } = useFormOverlay()

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(LocationSchema),
    defaultValues: {
      slug: location?.slug ?? "",
      city: location?.city ?? "",
      name: location?.name ?? "",
      address: location?.address ?? "",
      addressMin: location?.addressMin ?? "",
      phone: location?.phone ?? "",
      hours: location?.hours ?? "",
      image: location?.image ?? "",
      gallery: location?.gallery ?? [],
      mapUrl: location?.mapUrl ?? "",
      embedUrl: location?.embedUrl ?? "",
    },
  })

  // Observamos gallery para renderizar la lista
  const gallery = watch("gallery") ?? []

  function addToGallery(url: string) {
    if (!url) return
    const current = getValues("gallery") ?? []
    setValue("gallery", [...current, url], { shouldValidate: true })
  }

  function removeFromGallery(idx: number) {
    setValue(
      "gallery",
      gallery.filter((_, i) => i !== idx),
      { shouldValidate: true },
    )
  }

  const handleDuplicate = useDuplicate({
    apiPath:      "/api/locations",
    redirectPath: "/admin/locations",
    imageField: "image",
    galleryField:  "gallery",
    getValues,
    setOverlayMode,
    setSubmitError,
  })

  const onSubmit = async (data: LocationFormValues) => {
    setSubmitError("")
    setOverlayMode("saving")

    const url = isEditing ? `/api/locations/${location!.id}` : "/api/locations"
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
      setOverlayMode(null)
      return
    }

    router.push("/admin/locations?success=true")
    router.refresh()
  }

  const handleDelete = useCallback(async () => {
    setOverlayMode("deleting")
    await fetch(`/api/locations/${location!.id}`, { method: "DELETE" })
    router.push("/admin/locations?deleted=true")
    router.refresh()
  }, [location, router])

  return (
    <AdminFormLayout
      section="Sucursales"
      title={isEditing ? "Editar" : "Nuevo"}
      backHref="/admin/locations"
      formId="location-form"
      isEditing={isEditing}
      isSubmitting={isSubmitting}
      submitError={submitError}
      onDelete={isEditing ? handleDelete : undefined}
      deleteTitle="¿Eliminar sucursal?"
      deleteDescription="Esta acción no se puede deshacer. La sucursal será eliminada permanentemente."
      onDuplicate={isEditing ? handleDuplicate : undefined}
    >
      <SavingOverlay isVisible={isVisible} mode={overlayMode ?? "saving"} />
      <form id="location-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-5">
            <SectionTitle>Información general</SectionTitle>

            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Nombre</FieldLabel>
              <FieldError>{errors.name?.message}</FieldError>
              <Input id="name" aria-invalid={!!errors.name} {...register("name")} placeholder="Central Molletes Cafetería" />
            </Field>

            <Field data-invalid={!!errors.slug}>
              <FieldLabel htmlFor="slug">Slug</FieldLabel>
              <FieldError>{errors.slug?.message}</FieldError>
              <Input id="slug" aria-invalid={!!errors.slug} {...register("slug")} placeholder="etzatlán" />
            </Field>

            <Field data-invalid={!!errors.city}>
              <FieldLabel htmlFor="city">Ciudad</FieldLabel>
              <FieldError>{errors.city?.message}</FieldError>
              <Input id="city" aria-invalid={!!errors.city} {...register("city")} placeholder="Etzatlán" />
            </Field>

            <Field data-invalid={!!errors.address}>
              <FieldLabel htmlFor="address">Dirección completa</FieldLabel>
              <FieldError>{errors.address?.message}</FieldError>
              <Input id="address" aria-invalid={!!errors.address} {...register("address")} placeholder="Ocampo 63, Centro, 46500 Etzatlán, Jal." />
            </Field>

            <Field data-invalid={!!errors.addressMin}>
              <FieldLabel htmlFor="addressMin">Dirección corta</FieldLabel>
              <FieldError>{errors.addressMin?.message}</FieldError>
              <Input id="addressMin" aria-invalid={!!errors.addressMin} {...register("addressMin")} placeholder="Ocampo 63, Centro" />
            </Field>

            <Field data-invalid={!!errors.phone}>
              <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
              <FieldError>{errors.phone?.message}</FieldError>
              <Input id="phone" aria-invalid={!!errors.phone} {...register("phone")} placeholder="+52 (386) 105-4528" />
            </Field>

            <Field data-invalid={!!errors.hours}>
              <FieldLabel htmlFor="hours">Horario</FieldLabel>
              <FieldError>{errors.hours?.message}</FieldError>
              <Input id="hours" aria-invalid={!!errors.hours} {...register("hours")} placeholder="8:30 am – 1:00 pm | 7:00 pm – 10:30 pm" />
            </Field>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-5 mt-8 lg:mt-0">
            <SectionTitle>Mapa e imágenes</SectionTitle>

            <Field data-invalid={!!errors.mapUrl}>
              <FieldLabel htmlFor="mapUrl">URL Google Maps</FieldLabel>
              <FieldError>{errors.mapUrl?.message}</FieldError>
              <Input id="mapUrl" aria-invalid={!!errors.mapUrl} {...register("mapUrl")} placeholder="https://maps.app.goo.gl/..." />
            </Field>

            <Field data-invalid={!!errors.embedUrl}>
              <FieldLabel htmlFor="embedUrl">Embed URL Maps</FieldLabel>
              <FieldError>{errors.embedUrl?.message}</FieldError>
              <Textarea id="embedUrl" rows={3} aria-invalid={!!errors.embedUrl} {...register("embedUrl")} placeholder="https://www.google.com/maps/embed?pb=..." className="resize-none" />
            </Field>

            {/* Imagen principal */}
            <Field data-invalid={!!errors.image}>
              <FieldLabel>Imágen principal</FieldLabel>
              <Controller control={control} name="image" render={({ field }) => <ImageUpload value={field.value} onChange={field.onChange} folder="locations/covers" />} />
            </Field>

            {/* Galería */}
            <Field>
              <FieldLabel>
                Galería{" "}
                <span className="normal-case text-muted-foreground tracking-normal font-normal">
                  ({gallery.length} imagen{gallery.length !== 1 ? "es" : ""})
                </span>
              </FieldLabel>
              <FieldError>{errors.gallery?.message}</FieldError>
              {gallery.length > 0 && (
                <div className="flex flex-col gap-2 mb-2">
                  {gallery.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 border border-border bg-muted">
                      <div className="w-12 h-12 rounded overflow-hidden shrink-0">
                        <img src={url} alt={`Galería ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                      <span className="flex-1 text-xs text-muted-foreground font-mono truncate">{url}</span>
                      <button
                        type="button"
                        onClick={() => removeFromGallery(idx)}
                        className="p-1 text-muted-foreground/50 hover:text-destructive transition-colors cursor-pointer shrink-0"
                        aria-label="Quitar imagen"
                      >
                        <IconX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <ImageUpload folder="locations/gallery" value="" onChange={addToGallery} />
            </Field>
          </div>
        </div>
      </form>
    </AdminFormLayout>
  )
}