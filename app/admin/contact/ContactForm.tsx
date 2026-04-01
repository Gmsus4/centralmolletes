"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ContactSchema, ContactFormValues } from "@/lib/validators/contact"

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

type SocialLink = {
  id?: string
  platform: string
  url: string
  username?: string
  order: number
  isActive: boolean
}

type ContactInfo = {
  id?: string
  address?: string | null
  email?: string | null
  phone?: string | null
  whatsapp?: string | null
  extraInfo?: string | null
  socialLinks?: SocialLink[]
}

const PLATFORM_SUGGESTIONS = [
  "Instagram", "Facebook", "TikTok", "Twitter/X",
  "YouTube", "WhatsApp", "Telegram", "LinkedIn",
]

// ─── Main component ───────────────────────────────────────────────────────────

export default function ContactForm({ contact }: { contact?: ContactInfo }) {
  const router = useRouter()
  const isEditing = !!contact?.id
  const [submitError, setSubmitError] = useState("")

  const {
    register,
    handleSubmit,
    control,
    setError, 
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      address: contact?.address ?? "",
      email: contact?.email ?? "",
      phone: contact?.phone ?? "",
      whatsapp: contact?.whatsapp ?? "",
      extraInfo: contact?.extraInfo ?? "",
      socialLinks: contact?.socialLinks?.map((s) => ({
        ...s,
        isActive: Boolean(s.isActive),
      })) ?? [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialLinks",
  })

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitError("")

    const url = isEditing ? `/api/contact/${contact!.id}` : `/api/contact`
    const method = isEditing ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      const message = json.error ?? "Hubo un error al guardar"

      if (json.error?.toLowerCase().includes("email")) {
        setError("email", { message })
      } else if (json.error?.toLowerCase().includes("plataforma") ||  json.error?.toLowerCase().includes("platform")) {
        setSubmitError(message)
      } else {
        setSubmitError(message)
      }
      return 
    }

    router.push("/admin/contact?edit=true")
    router.refresh()
  }

  const handleDelete = useCallback(async () => {
    await fetch(`/api/contact/${contact!.id}`, { method: "DELETE" })
    router.push("/admin/contact?deleted=true")
    router.refresh()
  }, [contact, router])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-stone-400" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Contacto</span>
          </div>
          <h1 className="font-titleText text-stone-900 uppercase text-4xl sm:text-5xl leading-none">
            {isEditing ? "Editar" : "Nuevo"}
          </h1>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          {submitError && <p className="text-[11px] tracking-wide text-red-500">{submitError}</p>}
          <button
            type="button"
            onClick={() => router.push("/admin/contact")}
            className="text-[10px] uppercase tracking-[0.25em] text-stone-500 hover:text-stone-900 border-b border-stone-400 hover:border-stone-900 pb-px transition-colors duration-200 cursor-pointer"
          >
            Cancelar
          </button>
          {isEditing && <DeleteButton onConfirm={handleDelete} />}
          <button
            type="submit"
            form="contact-form"
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

      <form id="contact-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">

          {/* ── LEFT: Info de contacto ── */}
          <div className="flex flex-col gap-5">
            <SectionTitle>Información de contacto</SectionTitle>

            <Field label="Dirección" error={errors.address?.message}>
              <input
                {...register("address")}
                placeholder="Calle Principal #1, Etzatlán"
                className={inputClass}
              />
            </Field>

            <Field label="Email" error={errors.email?.message}>
              <input
                {...register("email")}
                type="email"
                placeholder="hola@centralmolletes.com"
                className={inputClass}
              />
            </Field>

            <Field label="Teléfono" error={errors.phone?.message}>
              <input
                {...register("phone")}
                placeholder="+52 333 000 0000"
                className={inputClass}
              />
            </Field>

            <Field label="WhatsApp" error={errors.whatsapp?.message}>
              <input
                {...register("whatsapp")}
                placeholder="+52 333 000 0000"
                className={inputClass}
              />
            </Field>

            <Field label="Información extra" error={errors.extraInfo?.message}>
              <textarea
                {...register("extraInfo")}
                rows={3}
                placeholder="Horarios, notas especiales…"
                className={`${inputClass} resize-none`}
              />
            </Field>
          </div>

          {/* ── RIGHT: Redes sociales ── */}
          <div className="flex flex-col gap-5 mt-8 lg:mt-0">
            <SectionTitle>Redes sociales</SectionTitle>

            <div className="flex flex-col gap-4">
              {fields.map((field, idx) => (
                <div
                  key={field.id}
                  className="flex flex-col gap-2 pb-4 border-b border-stone-100 last:border-0"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Plataforma" error={errors.socialLinks?.[idx]?.platform?.message}>
                      <input
                        {...register(`socialLinks.${idx}.platform`)}
                        list="platforms-list"
                        placeholder="Instagram"
                        autoComplete="off"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Usuario">
                      <input
                        {...register(`socialLinks.${idx}.username`)}
                        placeholder="@centralmolletes"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <Field label="URL" error={errors.socialLinks?.[idx]?.url?.message}>
                    <input
                      {...register(`socialLinks.${idx}.url`)}
                      placeholder="https://instagram.com/centralmolletes"
                      className={inputClass}
                    />
                  </Field>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register(`socialLinks.${idx}.isActive`)}
                        className="w-3.5 h-3.5 accent-stone-800"
                      />
                      <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500">Activo</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="text-[10px] uppercase tracking-[0.2em] text-stone-400 hover:text-red-500 border-b border-stone-300 hover:border-red-500 pb-px transition-colors duration-200 cursor-pointer"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}

              <datalist id="platforms-list">
                {PLATFORM_SUGGESTIONS.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>

              <button
                type="button"
                onClick={() =>
                  append({ platform: "", url: "", username: "", order: fields.length, isActive: true })
                }
                className="self-start text-[10px] uppercase tracking-[0.25em] text-stone-600 hover:text-stone-900 border-b border-stone-400 hover:border-stone-900 pb-px transition-colors duration-200 cursor-pointer"
              >
                + Agregar red social
              </button>
            </div>
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
            onClick={() => router.push("/admin/contact")}
            className="text-[10px] uppercase tracking-[0.25em] text-stone-500 hover:text-stone-900 border-b border-stone-400 pb-px transition-colors duration-200 cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}