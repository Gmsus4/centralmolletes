"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReviewSchema, ReviewFormValues, ReviewStatus } from "@/lib/validators/reviews"
import { IconEye, IconEyeOff } from "@tabler/icons-react"
import ImageUpload from "../components/ImageUpload"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { AdminFormLayout } from "../components/AdminFormLayout"
import { SavingOverlay } from "@/components/ui/saving-overlay"
import { useFormOverlay } from "@/hooks/useFormOverlay"
import { useDuplicate } from "@/hooks/useDuplicate"

// ─── Types ────────────────────────────────────────────────────────────────────

type Review = {
  id:     string
  author: string
  role:   string
  body:   string
  photo:  string
  rating: number
  status: ReviewStatus
  order:  number
}

type Props = {
  review?: Review
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{children}</span>
    <Separator className="flex-1" />
  </div>
)

// ─── Status selector ──────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: ReviewStatus; label: string; icon: React.ReactNode; color: string }[] = [
  { value: "visible", label: "Visible", icon: <IconEye size={11} />,    color: "bg-emerald-500" },
  { value: "hidden",  label: "Oculta",  icon: <IconEyeOff size={11} />, color: "bg-stone-400"   },
]

function StatusSelector({
  value,
  onChange,
}: {
  value:    ReviewStatus
  onChange: (v: ReviewStatus) => void
}) {
  return (
    <div className="flex gap-1">
      {STATUS_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] transition-colors cursor-pointer border ${
            value === opt.value
              ? "bg-stone-900 text-white border-stone-900"
              : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${value === opt.value ? "bg-white" : opt.color}`} />
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ─── Star rating ──────────────────────────────────────────────────────────────

function StarRating({
  value,
  onChange,
}: {
  value:    number
  onChange: (v: number) => void
}) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const star = i + 1
        const filled = star <= (hovered ?? value)
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            className={`text-2xl transition-colors cursor-pointer select-none ${
              filled ? "text-amber-400" : "text-stone-200 hover:text-amber-200"
            }`}
            aria-label={`${star} estrella${star !== 1 ? "s" : ""}`}
          >
            ★
          </button>
        )
      })}
      <span className="ml-2 self-center text-xs text-muted-foreground">
        {value} / 5
      </span>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ReviewForm({ review }: Props) {
  const router    = useRouter()
  const isEditing = !!review?.id
  const [submitError, setSubmitError] = useState("")
  const { overlayMode, setOverlayMode, isVisible } = useFormOverlay()

  const {
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      author: review?.author ?? "",
      role:   review?.role   ?? "",
      body:   review?.body   ?? "",
      photo:  review?.photo  ?? "",
      rating: review?.rating ?? 5,
      status: review?.status ?? "visible",
      order:  review?.order  ?? 0,
    },
  })

  const handleDuplicate = useDuplicate({
      apiPath:      "/api/reviews",
      redirectPath: "/admin/reviews",
      imageField: "photo",
      getValues,
      setOverlayMode,
      setSubmitError,
      nameField: "author"
  })

  // ── Submit ──
  const onSubmit = async (data: ReviewFormValues) => {
    setSubmitError("")
    setOverlayMode("saving")

    const url    = isEditing ? `/api/reviews/${review!.id}` : "/api/reviews"
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

    router.push("/admin/reviews?success=true")
    router.refresh()
  }

  const handleDelete = useCallback(async () => {
    setOverlayMode("deleting")
    await fetch(`/api/reviews/${review!.id}`, { method: "DELETE" })
    router.push("/admin/reviews?deleted=true")
    router.refresh()
  }, [review, router])

  return (
    <AdminFormLayout
      section="Reseñas"
      title={isEditing ? "Editar" : "Nueva"}
      backHref="/admin/reviews"
      formId="review-form"
      isEditing={isEditing}
      isSubmitting={isSubmitting}
      submitError={submitError}
      onDelete={isEditing ? handleDelete : undefined}
      deleteTitle="¿Eliminar reseña?"
      deleteDescription="Esta acción no se puede deshacer. La reseña será eliminada permanentemente."
      onDuplicate={isEditing ? handleDuplicate : undefined}  
    >
      <SavingOverlay isVisible={isVisible} mode={overlayMode ?? "saving"} />
      <form id="review-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-5">
            <SectionTitle>Información del cliente</SectionTitle>

            {/* Status */}
            <Field data-invalid={!!errors.status}>
              <FieldLabel>Visibilidad</FieldLabel>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <StatusSelector value={field.value} onChange={field.onChange} />
                )}
              />
              <FieldError>{errors.status?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.author}>
              <FieldLabel htmlFor="author">Nombre</FieldLabel>
              <Input
                id="author"
                {...register("author")}
                placeholder="María García"
                aria-invalid={!!errors.author}
              />
              <FieldError>{errors.author?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.role}>
              <FieldLabel htmlFor="role">Rol / Descripción</FieldLabel>
              <Input
                id="role"
                {...register("role")}
                placeholder="Cliente frecuente"
                aria-invalid={!!errors.role}
              />
              <FieldError>{errors.role?.message}</FieldError>
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Ej: Cliente frecuente, Fan de los chilaquiles, Cliente de siempre
              </span>
            </Field>

            <Field data-invalid={!!errors.body}>
              <FieldLabel htmlFor="body">
                Reseña{" "}
                <span className="ml-2 normal-case tracking-normal font-normal text-muted-foreground">
                  ({watch("body")?.length ?? 0}/500)
                </span>
              </FieldLabel>
              <Textarea
                id="body"
                rows={4}
                {...register("body")}
                placeholder='"El Mollete Quejeta suena raro pero es lo mejor que he probado…"'
                className="resize-none"
                aria-invalid={!!errors.body}
              />
              <FieldError>{errors.body?.message}</FieldError>
            </Field>

            {/* Rating */}
            <Field data-invalid={!!errors.rating}>
              <FieldLabel>Calificación</FieldLabel>
              <Controller
                control={control}
                name="rating"
                render={({ field }) => (
                  <StarRating value={field.value} onChange={field.onChange} />
                )}
              />
              <FieldError>{errors.rating?.message}</FieldError>
            </Field>

            {/* Orden */}
            <Field data-invalid={!!errors.order}>
              <FieldLabel htmlFor="order">Orden de aparición</FieldLabel>
              <Input
                id="order"
                type="number"
                min={0}
                {...register("order", { valueAsNumber: true })}
                placeholder="0"
                className="w-28"
              />
              <FieldError>{errors.order?.message}</FieldError>
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Número más bajo aparece primero
              </span>
            </Field>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-5 mt-8 lg:mt-0">
            <SectionTitle>Foto del cliente</SectionTitle>

            <Field data-invalid={!!errors.photo}>
              <FieldLabel>Foto (opcional)</FieldLabel>
              <Controller
                control={control}
                name="photo"
                render={({ field }) => (
                  <ImageUpload
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    folder="reviews/profiles"
                  />
                )}
              />
              <FieldError>{errors.photo?.message}</FieldError>
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Si no hay foto, se mostrará la inicial del nombre
              </span>
            </Field>

            {/* Preview */}
            {(watch("author") || watch("body")) && (
              <div className="mt-4">
                <SectionTitle>Vista previa</SectionTitle>
                <div className="p-5 border border-border bg-stone-50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-muted border border-border">
                      {watch("photo") ? (
                        <img
                          src={watch("photo")}
                          alt={watch("author")}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-medium uppercase">
                          {watch("author")?.charAt(0) ?? "?"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-0.5 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${i < (watch("rating") ?? 5) ? "text-amber-400" : "text-stone-200"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      {watch("body") && (
                        <p className="text-xs text-stone-600 italic mb-1.5">"{watch("body")}"</p>
                      )}
                      <p className="text-[10px] text-stone-400 uppercase tracking-[0.15em]">
                        {watch("author") || "Nombre"} — {watch("role") || "Rol"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </AdminFormLayout>
  )
}