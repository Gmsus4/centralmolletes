"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BlogSchema, BlogFormValues, BlogSection, BlogStatus } from "@/lib/validators/blog"
import { IconX, IconPlus, IconGripVertical, IconChevronDown, IconChevronUp, IconExternalLink, IconCopy } from "@tabler/icons-react"
import ImageUpload from "../components/ImageUpload"
import MarkdownEditor from "@/components/blog/MarkdownEditor"

// ─── Types ────────────────────────────────────────────────────────────────────

type Blog = {
  id:              string
  slug:            string
  title:           string
  subtitle:        string
  coverImage:      string
  gallery:         string[]
  category:        string
  tags:            string[]
  sections:        BlogSection[]
  status:          BlogStatus
  author:          string
  metaDescription: string
  publishedAt:     string
}

type Props = {
  blog?: Blog
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
  label:    React.ReactNode
  hint?:    string
  error?:   string
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

// ─── Status selector ──────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: BlogStatus; label: string; color: string }[] = [
  { value: "published", label: "Publicado",  color: "bg-emerald-500" },
  { value: "draft",     label: "Borrador",   color: "bg-stone-400"   },
  { value: "scheduled", label: "Programado", color: "bg-amber-400"   },
]

function StatusSelector({
  value,
  onChange,
}: {
  value:    BlogStatus
  onChange: (v: BlogStatus) => void
}) {
  const current = STATUS_OPTIONS.find((o) => o.value === value) ?? STATUS_OPTIONS[0]

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

// ─── Section type options ─────────────────────────────────────────────────────

const SECTION_TYPES = [
  { value: "text",  label: "Texto"  },
  { value: "image", label: "Imagen" },
  { value: "quote", label: "Cita"   },
  { value: "cta",   label: "CTA"    },
] as const

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toLocalDatetimeString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    date.getFullYear()       + "-" +
    pad(date.getMonth() + 1) + "-" +
    pad(date.getDate())      + "T" +
    pad(date.getHours())     + ":" +
    pad(date.getMinutes())
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BlogForm({ blog }: Props) {
  const router    = useRouter()
  const isEditing = !!blog?.id
  const [tagInput,      setTagInput]      = useState("")
  const [isDuplicating, setIsDuplicating] = useState(false)
  const [charCount,     setCharCount]     = useState(blog?.metaDescription?.length ?? 0)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(BlogSchema),
    defaultValues: {
      slug:            blog?.slug            ?? "",
      title:           blog?.title           ?? "",
      subtitle:        blog?.subtitle        ?? "",
      coverImage:      blog?.coverImage      ?? "",
      gallery:         blog?.gallery         ?? [],
      category:        blog?.category        ?? "",
      tags:            blog?.tags            ?? [],
      sections:        blog?.sections        ?? [{ type: "text", heading: "", body: "" }],
      status:          blog?.status          ?? "published",
      author:          blog?.author          ?? "",
      metaDescription: blog?.metaDescription ?? "",
      publishedAt:     blog?.publishedAt
        ? toLocalDatetimeString(new Date(blog.publishedAt))
        : toLocalDatetimeString(new Date()),
    },
  })

  const gallery = watch("gallery") ?? []
  const tags    = watch("tags")    ?? []
  const status  = watch("status")

  const { fields: sectionFields, append, remove, move } = useFieldArray({
    control,
    name: "sections",
  })

  // ── Gallery helpers ──
  function addToGallery(url: string) {
    if (!url) return
    const current = getValues("gallery") ?? []
    setValue("gallery", [...current, url], { shouldValidate: true })
  }

  function removeFromGallery(idx: number) {
    const current = getValues("gallery") ?? []
    setValue("gallery", current.filter((_, i) => i !== idx), { shouldValidate: true })
  }

  // ── Tag helpers ──
  function addTag() {
    const trimmed = tagInput.trim().toLowerCase()
    if (!trimmed || tags.includes(trimmed)) return
    setValue("tags", [...tags, trimmed], { shouldValidate: true })
    setTagInput("")
  }

  function removeTag(idx: number) {
    setValue("tags", tags.filter((_, i) => i !== idx), { shouldValidate: true })
  }

  // ── Preview ──
  function openPreview() {
    const slug = getValues("slug")
    if (slug) window.open(`/blog/${slug}`, "_blank")
  }

  // ── Duplicate ──
  const handleDuplicate = useCallback(async () => {
    if (!blog?.id) return
    setIsDuplicating(true)
    try {
      const values = getValues()
      const newSlug = `${values.slug}-copia-${Date.now().toString(36)}`
      const res = await fetch("/api/blog", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          ...values,
          slug:   newSlug,
          status: "draft",
          tzOffset: new Date().getTimezoneOffset(),
        }),
      })
      if (res.ok) {
        const created = await res.json()
        router.push(`/admin/blog/${created.id}`)
        router.refresh()
      }
    } finally {
      setIsDuplicating(false)
    }
  }, [blog, getValues, router])

  // ── Submit ──
  const onSubmit = async (data: BlogFormValues) => {
    const url    = isEditing ? `/api/blog/${blog!.id}` : "/api/blog"
    const method = isEditing ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        ...data,
        tzOffset: new Date().getTimezoneOffset(),
      }),
    })

    if (!res.ok) {
      const json    = await res.json().catch(() => ({}))
      const message = json.error ?? "Hubo un error al guardar"

      if (json.error?.toLowerCase().includes("slug")) {
        setError("slug",  { message })
      } else if (json.error?.toLowerCase().includes("título")) {
        setError("title", { message })
      } else {
        setError("root",  { message })
      }
      return
    }

    router.push("/admin/blog?success=true")
    router.refresh()
  }

  const handleDelete = useCallback(async () => {
    await fetch(`/api/blog/${blog!.id}`, { method: "DELETE" })
    router.push("/admin/blog?deleted=true")
    router.refresh()
  }, [blog, router])

  // ── Shared action bar ──
  const ActionBar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={mobile ? "flex flex-col gap-4" : "hidden sm:flex items-center gap-4"}>
      {errors.root && (
        <p className="text-[11px] tracking-wide text-red-500">{errors.root.message}</p>
      )}

      {/* Preview */}
      {isEditing && (
        <button
          type="button"
          onClick={openPreview}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-stone-500 hover:text-stone-900 border-b border-stone-400 hover:border-stone-900 pb-px transition-colors duration-200 cursor-pointer"
        >
          <IconExternalLink size={11} /> Vista previa
        </button>
      )}

      {/* Duplicate */}
      {isEditing && (
        <button
          type="button"
          onClick={handleDuplicate}
          disabled={isDuplicating}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-stone-500 hover:text-stone-900 border-b border-stone-400 hover:border-stone-900 pb-px transition-colors duration-200 cursor-pointer disabled:opacity-40"
        >
          <IconCopy size={11} /> {isDuplicating ? "Duplicando…" : "Duplicar"}
        </button>
      )}

      <button
        type="button"
        onClick={() => router.push("/admin/blog")}
        className="text-[10px] uppercase tracking-[0.25em] text-stone-500 hover:text-stone-900 border-b border-stone-400 hover:border-stone-900 pb-px transition-colors duration-200 cursor-pointer"
      >
        Cancelar
      </button>

      {isEditing && <DeleteButton onConfirm={handleDelete} />}

      <button
        type="submit"
        form="blog-form"
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
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-stone-400" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500">Blog</span>
          </div>
          <h1 className="font-titleText text-stone-900 uppercase text-4xl sm:text-5xl leading-none">
            {isEditing ? "Editar" : "Nuevo"}
          </h1>
        </div>
        <ActionBar />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-8">
        <span className="flex-1 h-px bg-stone-200" />
        <span className="w-1 h-1 rounded-full bg-stone-300" />
        <span className="flex-1 h-px bg-stone-200" />
      </div>

      <form id="blog-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-5">
            <SectionTitle>Información general</SectionTitle>

            {/* Status */}
            <Field label="Estado" error={errors.status?.message}>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <StatusSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {status === "scheduled" && (
                <p className="text-[9px] uppercase tracking-[0.2em] text-amber-500 mt-1">
                  Se publicará automáticamente cuando llegue la fecha
                </p>
              )}
            </Field>

            <Field label="Título" error={errors.title?.message}>
              <input
                {...register("title")}
                placeholder="El arte del mollete perfecto"
                className={inputClass}
              />
            </Field>

            <Field label="Subtítulo" error={errors.subtitle?.message}>
              <textarea
                {...register("subtitle")}
                rows={2}
                placeholder="Una guía para entender la tradición detrás de nuestro platillo estrella"
                className={`${inputClass} resize-none`}
              />
            </Field>

            <Field label="Slug" error={errors.slug?.message}>
              <input
                {...register("slug")}
                placeholder="el-arte-del-mollete-perfecto"
                className={inputClass}
              />
            </Field>

            <Field label="Categoría" error={errors.category?.message}>
              <input
                {...register("category")}
                placeholder="Gastronomía"
                className={inputClass}
              />
            </Field>

            <Field label="Autor" error={errors.author?.message}>
              <input
                {...register("author")}
                placeholder="María García"
                className={inputClass}
              />
            </Field>

            {/* Meta description */}
            <Field
              label={
                <>
                  Meta description{" "}
                  <span className={`ml-2 normal-case tracking-normal ${charCount > 160 ? "text-red-400" : "text-stone-400"}`}>
                    ({charCount}/160)
                  </span>
                </>
              }
              hint="Aparece en Google bajo el título. Máximo 160 caracteres."
              error={errors.metaDescription?.message}
            >
              <textarea
                {...register("metaDescription")}
                rows={2}
                placeholder="Descubre el secreto detrás del mollete perfecto…"
                className={`${inputClass} resize-none`}
                onChange={(e) => {
                  register("metaDescription").onChange(e)
                  setCharCount(e.target.value.length)
                }}
              />
            </Field>

            {/* Tags */}
            <Field
              label={<>Tags <span className="ml-2 normal-case text-stone-400 tracking-normal">({tags.length})</span></>}
              hint="Presiona Enter o la coma para agregar"
              error={(errors.tags as { message?: string } | undefined)?.message}
            >
              <div className="flex flex-col gap-2">
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 text-[10px] uppercase tracking-[0.15em] px-2 py-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(idx)}
                          className="text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <IconX size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                    placeholder="cafetería, molletes…"
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 bg-stone-100 hover:bg-stone-200 text-stone-600 text-[10px] uppercase tracking-[0.2em] transition-colors cursor-pointer shrink-0"
                  >
                    <IconPlus size={13} />
                  </button>
                </div>
              </div>
            </Field>

            <Field label="Fecha de publicación" error={errors.publishedAt?.message}>
              <input
                type="datetime-local"
                {...register("publishedAt")}
                className={inputClass}
              />
            </Field>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-5 mt-8 lg:mt-0">
            <SectionTitle>Imágenes</SectionTitle>

            <Field label="Imagen de portada" error={errors.coverImage?.message}>
              <Controller
                control={control}
                name="coverImage"
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    folder="blog"
                  />
                )}
              />
            </Field>

            <Field
              label={<>Galería <span className="ml-2 normal-case text-stone-400 tracking-normal">({gallery.length} imagen{gallery.length !== 1 ? "es" : ""})</span></>}
              hint="Cada subida agrega una imagen a la galería"
              error={(errors.gallery as { message?: string } | undefined)?.message}
            >
              {gallery.length > 0 && (
                <div className="flex flex-col gap-2 mb-2">
                  {gallery.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 border border-stone-200 bg-stone-50">
                      <div className="w-12 h-12 rounded overflow-hidden shrink-0">
                        <img src={url} alt={`Galería ${idx + 1}`} className="w-full h-full object-cover" />
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
              <ImageUpload folder="blog" value="" onChange={addToGallery} />
            </Field>
          </div>
        </div>

        {/* ── SECTIONS ── */}
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400">Secciones de contenido</span>
            <span className="flex-1 h-px bg-stone-100" />
            <button
              type="button"
              onClick={() => append({ type: "text", heading: "", body: "" })}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-stone-500 hover:text-stone-900 border border-stone-300 hover:border-stone-700 px-3 py-1.5 transition-colors cursor-pointer"
            >
              <IconPlus size={11} /> Agregar sección
            </button>
          </div>

          {(errors.sections as { message?: string } | undefined)?.message && (
            <p className="text-red-500 text-xs mb-4">{(errors.sections as { message?: string }).message}</p>
          )}

          <div className="flex flex-col gap-4">
            {sectionFields.map((field, idx) => {
              const sectionType = watch(`sections.${idx}.type`)
              return (
                <div key={field.id} className="border border-stone-200 bg-white p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <IconGripVertical size={14} className="text-stone-300 shrink-0" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400">
                      Sección {idx + 1}
                    </span>

                    <div className="flex gap-1 ml-2">
                      {SECTION_TYPES.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setValue(`sections.${idx}.type`, t.value)}
                          className={`px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] transition-colors cursor-pointer ${
                            sectionType === t.value
                              ? "bg-stone-900 text-white"
                              : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 ml-auto">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => move(idx, idx - 1)}
                          className="p-1 text-stone-300 hover:text-stone-700 transition-colors cursor-pointer"
                        >
                          <IconChevronUp size={14} />
                        </button>
                      )}
                      {idx < sectionFields.length - 1 && (
                        <button
                          type="button"
                          onClick={() => move(idx, idx + 1)}
                          className="p-1 text-stone-300 hover:text-stone-700 transition-colors cursor-pointer"
                        >
                          <IconChevronDown size={14} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="p-1 text-stone-300 hover:text-red-500 transition-colors cursor-pointer"
                        aria-label="Eliminar sección"
                      >
                        <IconX size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {sectionType !== "image" && (
                      <Field label="Encabezado (opcional)">
                        <input
                          {...register(`sections.${idx}.heading`)}
                          placeholder="Encabezado de sección"
                          className={inputClass}
                        />
                      </Field>
                    )}

                    {(sectionType === "text" || sectionType === "quote") && (
                      <Field
                        label={sectionType === "quote" ? "Cita" : "Cuerpo"}
                        hint={sectionType === "text" ? undefined : undefined}
                        error={(errors.sections?.[idx] as { body?: { message?: string } } | undefined)?.body?.message}
                      >
                        {sectionType === "text" ? (
                          <Controller
                            control={control}
                            name={`sections.${idx}.body`}
                            render={({ field }) => (
                              <MarkdownEditor
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                rows={8}
                                placeholder="Escribe el contenido…"
                              />
                            )}
                          />
                        ) : (
                          <textarea
                            {...register(`sections.${idx}.body`)}
                            rows={3}
                            placeholder='"El mollete es más que un platillo…"'
                            className={`${inputClass} resize-none`}
                          />
                        )}
                      </Field>
                    )}

                    {sectionType === "image" && (
                      <Field
                        label="Imagen"
                        error={(errors.sections?.[idx] as { image?: { message?: string } } | undefined)?.image?.message}
                      >
                        <Controller
                          control={control}
                          name={`sections.${idx}.image`}
                          render={({ field }) => (
                            <ImageUpload
                              value={field.value ?? ""}
                              onChange={field.onChange}
                              folder="blog"
                            />
                          )}
                        />
                      </Field>
                    )}

                    {sectionType === "cta" && (
                      <div className="flex flex-col gap-3 p-4 bg-stone-50 border border-stone-100">
                        <Field
                          label="Texto del botón"
                          error={(errors.sections?.[idx] as { buttonLabel?: { message?: string } } | undefined)?.buttonLabel?.message}
                        >
                          <input
                            {...register(`sections.${idx}.buttonLabel`)}
                            placeholder="Reserva tu mesa"
                            className={inputClass}
                          />
                        </Field>
                        <Field
                          label="URL del botón"
                          error={(errors.sections?.[idx] as { buttonUrl?: { message?: string } } | undefined)?.buttonUrl?.message}
                        >
                          <input
                            {...register(`sections.${idx}.buttonUrl`)}
                            placeholder="https://…"
                            className={inputClass}
                          />
                        </Field>
                        <Field label="Cuerpo (opcional)">
                          <textarea
                            {...register(`sections.${idx}.body`)}
                            rows={2}
                            placeholder="Texto de apoyo bajo el encabezado…"
                            className={`${inputClass} resize-none`}
                          />
                        </Field>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile actions */}
        <div className="sm:hidden flex flex-col gap-4 mt-8 pt-6 border-t border-stone-100">
          <ActionBar mobile />
        </div>
      </form>
    </div>
  )
}