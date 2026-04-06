"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnnouncementSchema, AnnouncementFormValues } from "@/lib/validators/announcement"
import { AdminFormLayout } from "../components/AdminFormLayout"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Controller } from "react-hook-form"
import { SavingOverlay } from "@/components/ui/saving-overlay"
import { useFormOverlay } from "@/hooks/useFormOverlay"
import { useDuplicate } from "@/hooks/useDuplicate"

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400">{children}</span>
    <span className="flex-1 h-px bg-stone-100" />
  </div>
)

// ─── Types ────────────────────────────────────────────────────────────────────

type Announcement = {
  id?: string
  type: "PROMO" | "INFO" | "WARNING" | "CLOSED"
  title: string
  message?: string | null
  startsAt: string | Date
  endsAt?: string | Date | null
  isActive: boolean
}

const ANNOUNCEMENT_TYPES = [
  { value: "PROMO",   label: "Promoción"    },
  { value: "INFO",    label: "Información"  },
  { value: "WARNING", label: "Aviso"        },
  { value: "CLOSED",  label: "Cerrado"      },
] as const

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDatetimeLocal(value: string | Date | undefined | null): string {
  if (!value) return ""
  const d   = new Date(value)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AnnouncementForm({ announcement }: { announcement?: Announcement }) {
  const router    = useRouter()
  const isEditing = !!announcement?.id
  const [submitError, setSubmitError] = useState("")
  const { overlayMode, setOverlayMode, isVisible } = useFormOverlay()

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(AnnouncementSchema),
    defaultValues: {
      type:     announcement?.type     ?? "INFO",
      title:    announcement?.title    ?? "",
      message:  announcement?.message  ?? "",
      startsAt: announcement?.startsAt ? toDatetimeLocal(announcement.startsAt) : toDatetimeLocal(new Date()),
      endsAt:   announcement?.endsAt   ? toDatetimeLocal(announcement.endsAt)   : "",
      isActive: announcement?.isActive ?? true,
    },
  })

  const handleDuplicate = useDuplicate({
    apiPath:      "/api/announcements",
    redirectPath: "/admin/announcements",
    getValues,
    setOverlayMode,
    setSubmitError,
    nameField: "title"
  })

  const onSubmit = async (data: AnnouncementFormValues) => {
    setSubmitError("")
    setOverlayMode("saving")

    const url    = isEditing ? `/api/announcements/${announcement!.id}` : `/api/announcements`
    const method = isEditing ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      setSubmitError(json.error ?? "Hubo un error al guardar")
      setOverlayMode(null)
      return
    }

    router.push("/admin/announcements?edit=true")
    router.refresh()
  }

  const handleDelete = useCallback(async () => {
    setOverlayMode("deleting")
    await fetch(`/api/announcements/${announcement!.id}`, { method: "DELETE" })
    router.push("/admin/announcements?deleted=true")
    router.refresh()
  }, [announcement, router])

  return (
    <AdminFormLayout
      section="Anuncios"
      title={isEditing ? "Editar" : "Nuevo"}
      backHref="/admin/announcements"
      formId="announcement-form"
      isEditing={isEditing}
      isSubmitting={isSubmitting}
      submitError={submitError}
      onDelete={isEditing ? handleDelete : undefined}
      deleteTitle="¿Eliminar anuncio?"
      deleteDescription="Esta acción no se puede deshacer. El anuncio será eliminado permanentemente."
      onDuplicate={isEditing ? handleDuplicate : undefined}
    >
      <SavingOverlay isVisible={isVisible} mode={overlayMode ?? "saving"} />
      <form id="announcement-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">

          {/* ── LEFT: Contenido ── */}
          <div className="flex flex-col gap-5">
            <SectionTitle>Contenido</SectionTitle>

            {/* Tipo */}
            <Field data-invalid={!!errors.type}>
              <FieldLabel>Tipo</FieldLabel>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {ANNOUNCEMENT_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors.type?.message}</FieldError>
            </Field>

            {/* Título */}
            <Field data-invalid={!!errors.title}>
              <FieldLabel>Título</FieldLabel>
              <Input {...register("title")} placeholder="Cerramos el próximo lunes" />
              <FieldError>{errors.title?.message}</FieldError>
            </Field>

            {/* Mensaje */}
            <Field data-invalid={!!errors.message}>
              <FieldLabel>Mensaje</FieldLabel>
              <Textarea
                {...register("message")}
                rows={4}
                placeholder="Información adicional del anuncio…"
                className="resize-none"
              />
              <FieldError>{errors.message?.message}</FieldError>
            </Field>

            {/* Activo */}
            <div className="flex items-center gap-2">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="isActive"
                    className="cursor-pointer"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <FieldLabel htmlFor="isActive" className="cursor-pointer">
                {errors.isActive ? errors.isActive.message : watch("isActive") ? "Activo" : "Inactivo"}
              </FieldLabel>
            </div>
          </div>

          {/* ── RIGHT: Vigencia ── */}
          <div className="flex flex-col gap-5 mt-8 lg:mt-0">
            <SectionTitle>Vigencia</SectionTitle>

            {/* Inicia */}
            <Field data-invalid={!!errors.startsAt}>
              <FieldLabel>Inicia</FieldLabel>
              <Input {...register("startsAt")} type="datetime-local" className="[color-scheme:light]"/>
              <FieldError>{errors.startsAt?.message}</FieldError>
            </Field>

            {/* Termina */}
            <Field data-invalid={!!errors.endsAt}>
              <FieldLabel>Termina (opcional)</FieldLabel>
              <Input {...register("endsAt")} type="datetime-local" className="[color-scheme:light]"/>
              <p className="text-[10px] text-stone-400 tracking-wide">
                Deja vacío si el anuncio no tiene fecha de expiración
              </p>
              <FieldError>{errors.endsAt?.message}</FieldError>
            </Field>
          </div>

        </div>
      </form>
    </AdminFormLayout>
  )
}