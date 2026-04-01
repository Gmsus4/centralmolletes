"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnnouncementSchema, AnnouncementFormValues } from "@/lib/validators/announcement"

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
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass}>{label}</label>
      {children}
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
  { value: "PROMO",   label: "Promoción" },
  { value: "INFO",    label: "Información" },
  { value: "WARNING", label: "Aviso" },
  { value: "CLOSED",  label: "Cerrado" },
] as const

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDatetimeLocal(value: string | Date | undefined | null): string {
  if (!value) return ""
  const d = new Date(value)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AnnouncementForm({ announcement }: { announcement?: Announcement }) {
  const router = useRouter()
  const isEditing = !!announcement?.id
  const [submitError, setSubmitError] = useState("")

  const {
    register,
    handleSubmit,
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

  const onSubmit = async (data: AnnouncementFormValues) => {
    setSubmitError("")

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
      return
    }

    router.push("/admin/announcements?edit=true")
    router.refresh()
  }

  const handleDelete = useCallback(async () => {
    await fetch(`/api/announcements/${announcement!.id}`, { method: "DELETE" })
    router.push("/admin/announcements?deleted=true")
    router.refresh()
  }, [announcement, router])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-stone-400" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Anuncios</span>
          </div>
          <h1 className="font-titleText text-stone-900 uppercase text-4xl sm:text-5xl leading-none">
            {isEditing ? "Editar" : "Nuevo"}
          </h1>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          {submitError && <p className="text-[11px] tracking-wide text-red-500">{submitError}</p>}
          <button
            type="button"
            onClick={() => router.push("/admin/announcements")}
            className="text-[10px] uppercase tracking-[0.25em] text-stone-500 hover:text-stone-900 border-b border-stone-400 hover:border-stone-900 pb-px transition-colors duration-200 cursor-pointer"
          >
            Cancelar
          </button>
          {isEditing && <DeleteButton onConfirm={handleDelete} />}
          <button
            type="submit"
            form="announcement-form"
            disabled={isSubmitting}
            className="bg-stone-900 text-white px-6 py-3 text-[11px] uppercase tracking-[0.3em] font-semibold hover:opacity-90 active:opacity-75 disabled:opacity-50 transition-opacity duration-200 cursor-pointer"
          >
            {isSubmitting ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-8">
        <span className="flex-1 h-px bg-stone-200" />
        <span className="w-1 h-1 rounded-full bg-stone-300" />
        <span className="flex-1 h-px bg-stone-200" />
      </div>

      <form id="announcement-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">

          {/* ── LEFT: Contenido ── */}
          <div className="flex flex-col gap-5">
            <SectionTitle>Contenido</SectionTitle>

            <Field label="Tipo" error={errors.type?.message}>
              <select {...register("type")} className={inputClass}>
                {ANNOUNCEMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Título" error={errors.title?.message}>
              <input
                {...register("title")}
                placeholder="Cerramos el próximo lunes"
                className={inputClass}
              />
            </Field>

            <Field label="Mensaje" error={errors.message?.message}>
              <textarea
                {...register("message")}
                rows={4}
                placeholder="Información adicional del anuncio…"
                className={`${inputClass} resize-none`}
              />
            </Field>

            {/* Active toggle */}
            <label className="flex items-center gap-2 cursor-pointer mt-1">
              <input
                type="checkbox"
                {...register("isActive")}
                className="w-3.5 h-3.5 accent-stone-800"
              />
              <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500">Activo</span>
            </label>
          </div>

          {/* ── RIGHT: Vigencia ── */}
          <div className="flex flex-col gap-5 mt-8 lg:mt-0">
            <SectionTitle>Vigencia</SectionTitle>

            <Field label="Inicia" error={errors.startsAt?.message}>
              <input
                {...register("startsAt")}
                type="datetime-local"
                className={inputClass}
              />
            </Field>

            <Field label="Termina (opcional)" error={errors.endsAt?.message}>
              <input
                {...register("endsAt")}
                type="datetime-local"
                className={inputClass}
              />
              <span className="text-[10px] text-stone-400 tracking-wide">
                Deja vacío si el anuncio no tiene fecha de expiración
              </span>
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
            className="w-full bg-stone-900 text-white px-6 py-3 text-[11px] uppercase tracking-[0.3em] font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity duration-200 cursor-pointer"
          >
            {isSubmitting ? "Guardando…" : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/announcements")}
            className="text-[10px] uppercase tracking-[0.25em] text-stone-500 hover:text-stone-900 border-b border-stone-400 pb-px transition-colors duration-200 cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}