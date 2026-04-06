"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ContactSchema, ContactFormValues } from "@/lib/validators/contact"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { AdminFormLayout } from "../components/AdminFormLayout"
import { Switch } from "@/components/ui/switch"
import { SavingOverlay } from "@/components/ui/saving-overlay"

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

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{children}</span>
    <Separator className="flex-1" />
  </div>
)

// ─── Main component ───────────────────────────────────────────────────────────

export default function ContactForm({ contact }: { contact?: ContactInfo }) {
  const router = useRouter()
  const isEditing = !!contact?.id
  const [submitError, setSubmitError] = useState("")
  const [overlayMode, setOverlayMode] = useState<"saving" | "deleting" | null>(null)

  const {
    register,
    handleSubmit,
    watch,
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
      socialLinks:
        contact?.socialLinks?.map((s) => ({
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
    setOverlayMode("saving")

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
      } else if (json.error?.toLowerCase().includes("plataforma") || json.error?.toLowerCase().includes("platform")) {
        setSubmitError(message)
      } else {
        setSubmitError(message)
      }

      setOverlayMode(null)
      return
    }

    router.push("/admin/contact?edit=true")
    router.refresh()
  }

  const handleDelete = useCallback(async () => {
    setOverlayMode("deleting")
    await fetch(`/api/contact/${contact!.id}`, { method: "DELETE" })
    router.push("/admin/contact?deleted=true")
    router.refresh()
  }, [contact, router])

  return (
    <AdminFormLayout
      section="Contacto"
      title={isEditing ? "Editar" : "Nuevo"}
      backHref="/admin/contact"
      formId="contact-form"
      isEditing={isEditing}
      isSubmitting={isSubmitting}
      submitError={submitError}
      onDelete={isEditing ? handleDelete : undefined}
      deleteTitle="¿Eliminar contacto?"
      deleteDescription="Esta acción no se puede deshacer. El contacto será eliminado permanentemente."
    >
      <SavingOverlay isVisible={overlayMode !== null} mode={overlayMode ?? "saving"} />

      <form id="contact-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
          {/* ── LEFT: Info de contacto ── */}
          <div className="flex flex-col gap-5">
            <SectionTitle>Información de contacto</SectionTitle>

            <Field data-invalid={!!errors.address}>
              <FieldLabel htmlFor="address">Dirección</FieldLabel>
              <Input id="address" {...register("address")} placeholder="Calle Principal #1, Etzatlán" />
              <FieldError>{errors.address?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" {...register("email")} placeholder="hola@centralmolletes.com" />
              <FieldError>{errors.email?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.phone}>
              <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
              <Input id="phone" {...register("phone")} placeholder="+52 333 000 0000" />
              <FieldError>{errors.phone?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.whatsapp}>
              <FieldLabel htmlFor="whatsapp">WhatsApp</FieldLabel>
              <Input id="whatsapp" {...register("whatsapp")} placeholder="+52 333 000 0000" />
              <FieldError>{errors.whatsapp?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.extraInfo}>
              <FieldLabel htmlFor="extraInfo">Información extra</FieldLabel>
              <Textarea id="extraInfo" rows={3} {...register("extraInfo")} placeholder="Horarios, notas especiales…" className="resize-none" />
              <FieldError>{errors.extraInfo?.message}</FieldError>
            </Field>
          </div>

          {/* ── RIGHT: Redes sociales ── */}
          <div className="flex flex-col gap-5 mt-8 lg:mt-0">
            <SectionTitle>Redes sociales</SectionTitle>

            <div className="flex flex-col gap-4">
              {fields.map((field, idx) => (
                <div key={field.id} className="flex flex-col gap-2 pb-4 border-b border-border last:border-0">
                  <div className="grid grid-cols-2 gap-3">
                    <Field data-invalid={!!errors.socialLinks?.[idx]?.platform}>
                      <FieldLabel htmlFor={`socialLinks-${idx}-platform`}>Plataforma</FieldLabel>
                      <Input id={`socialLinks-${idx}-platform`} {...register(`socialLinks.${idx}.platform`)} list="platforms-list" placeholder="Instagram, Facebook, Tiktok..." autoComplete="off" />
                      <FieldError>{errors.socialLinks?.[idx]?.platform?.message}</FieldError>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor={`socialLinks-${idx}-username`}>Usuario</FieldLabel>
                      <Input id={`socialLinks-${idx}-username`} {...register(`socialLinks.${idx}.username`)} placeholder="@centralmolletes" />
                    </Field>
                  </div>

                  <Field data-invalid={!!errors.socialLinks?.[idx]?.url}>
                    <FieldLabel htmlFor={`socialLinks-${idx}-url`}>URL</FieldLabel>
                    <Input id={`socialLinks-${idx}-url`} {...register(`socialLinks.${idx}.url`)} placeholder="https://instagram.com/centralmolletes" />
                    <FieldError>{errors.socialLinks?.[idx]?.url?.message}</FieldError>
                  </Field>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Controller
                        name={`socialLinks.${idx}.isActive`}
                        control={control}
                        render={({ field }) => <Switch id={`socialLinks-${idx}-isActive`} className="cursor-pointer" checked={field.value} onCheckedChange={field.onChange} />}
                      />
                      <FieldLabel htmlFor={`socialLinks-${idx}-isActive`} className="cursor-pointer">
                        {watch(`socialLinks.${idx}.isActive`) ? "Activo" : "Inactivo"}
                      </FieldLabel>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-destructive border-b border-border hover:border-destructive pb-px transition-colors duration-200 cursor-pointer"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({ platform: "", url: "", username: "", order: fields.length, isActive: true })}
                className="self-start text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground border-b border-border hover:border-foreground pb-px transition-colors duration-200 cursor-pointer"
              >
                + Agregar red social
              </button>
            </div>
          </div>
        </div>
      </form>
    </AdminFormLayout>
  )
}
