"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BlogSchema, BlogFormValues, BlogSection, BlogStatus } from "@/lib/validators/blog"
import { IconX, IconPlus, IconGripVertical, IconChevronDown, IconChevronUp, IconExternalLink, IconCopy } from "@tabler/icons-react"
import ImageUpload from "../components/ImageUpload"
import MarkdownEditor from "@/components/blog/MarkdownEditor"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { AdminFormLayout } from "../components/AdminFormLayout"
import { SavingOverlay } from "@/components/ui/saving-overlay"
import { useFormOverlay } from "@/hooks/useFormOverlay"
import { useDuplicate } from "@/hooks/useDuplicate"

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

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{children}</span>
    <Separator className="flex-1" />
  </div>
)

// ─── Status selector ──────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: BlogStatus; label: string; color: string }[] = [
  { value: "published", label: "Publicado",  color: "bg-emerald-500" },
  { value: "draft",     label: "Borrador",   color: "bg-muted-foreground" },
  { value: "scheduled", label: "Programado", color: "bg-amber-400"   },
]

function StatusSelector({
  value,
  onChange,
}: {
  value:    BlogStatus
  onChange: (v: BlogStatus) => void
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
              ? "bg-foreground text-background border-foreground"
              : "bg-background text-muted-foreground border-border hover:border-foreground/40"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${value === opt.value ? "bg-background" : opt.color}`} />
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
  const [submitError, setSubmitError] = useState("")
  const [charCount,     setCharCount]     = useState(blog?.metaDescription?.length ?? 0)
  const { overlayMode, setOverlayMode, isVisible } = useFormOverlay()

  const [defaultPublishedAt] = useState(() => toLocalDatetimeString(new Date()))

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
        : defaultPublishedAt,
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

  const handleDuplicate = useDuplicate({
    apiPath:       "/api/blog",
    redirectPath:  "/admin/blog",
    nameField:     "title",
    slugField:     "slug",
    imageField:    "coverImage",
    galleryField:  "gallery",
    sectionsField: "sections",
    getValues,
    setOverlayMode,
    setSubmitError,
  })

  // ── Submit ──
  const onSubmit = async (data: BlogFormValues) => {
    const iso = new Date(data.publishedAt ?? new Date()).toISOString()
    console.log("publishedAt input:", data.publishedAt)
    console.log("publishedAt ISO enviado:", iso)
    setSubmitError("")
    setOverlayMode("saving")
    const url    = isEditing ? `/api/blog/${blog!.id}` : "/api/blog"
    const method = isEditing ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        ...data,
        publishedAt: new Date(data.publishedAt ?? new Date()).toISOString(),
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
        setSubmitError(message)
        setError("root",  { message })
      }

      setOverlayMode(null)
      return
    }

    router.push("/admin/blog?success=true")
    router.refresh()
  }

  const handleDelete = useCallback(async () => {
    setOverlayMode("deleting")
    await fetch(`/api/blog/${blog!.id}`, { method: "DELETE" })
    router.push("/admin/blog?deleted=true")
    router.refresh()
  }, [blog, router])


  return (
    <AdminFormLayout
      section="Artículos"
      title={isEditing ? "Editar" : "Nuevo"}
      backHref="/admin/blog"
      formId="blog-form"
      isEditing={isEditing}
      isSubmitting={isSubmitting}
      submitError={submitError}
      onDelete={isEditing ? handleDelete : undefined}
      deleteTitle="¿Eliminar artículo?"
      deleteDescription="Esta acción no se puede deshacer. El artículo será eliminada permanentemente."
      previewHref={isEditing ? `/blog/${watch("slug")}` : undefined} 
      onDuplicate={isEditing ? handleDuplicate : undefined}  
    >
      <SavingOverlay isVisible={isVisible} mode={overlayMode ?? "saving"} />
      <form id="blog-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-5">
            <SectionTitle>Información general</SectionTitle>

            {/* Status */}
            <Field data-invalid={!!errors.status}>
              <FieldLabel>Estado</FieldLabel>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <StatusSelector value={field.value} onChange={field.onChange} />
                )}
              />
              {status === "scheduled" && (
                <p className="text-[9px] uppercase tracking-[0.2em] text-amber-500 dark:text-amber-400 mt-1">
                  Se publicará automáticamente cuando llegue la fecha
                </p>
              )}
              <FieldError>{errors.status?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.title}>
              <FieldLabel htmlFor="title">Título</FieldLabel>
              <Input id="title" {...register("title")} placeholder="El arte del mollete perfecto" aria-invalid={!!errors.title} />
              <FieldError>{errors.title?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.subtitle}>
              <FieldLabel htmlFor="subtitle">Subtítulo</FieldLabel>
              <Textarea
                id="subtitle"
                rows={2}
                {...register("subtitle")}
                placeholder="Una guía para entender la tradición detrás de nuestro platillo estrella"
                className="resize-none"
                aria-invalid={!!errors.subtitle}
              />
              <FieldError>{errors.subtitle?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.slug}>
              <FieldLabel htmlFor="slug">Slug</FieldLabel>
              <Input id="slug" {...register("slug")} placeholder="el-arte-del-mollete-perfecto" aria-invalid={!!errors.slug}/>
              <FieldError>{errors.slug?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.category}>
              <FieldLabel htmlFor="category">Categoría</FieldLabel>
              <Input id="category" {...register("category")} placeholder="Gastronomía" aria-invalid={!!errors.category}/>
              <FieldError>{errors.category?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.author}>
              <FieldLabel htmlFor="author">Autor</FieldLabel>
              <Input id="author" {...register("author")} placeholder="María García" />
              <FieldError>{errors.author?.message}</FieldError>
            </Field>

            {/* Meta description */}
            <Field data-invalid={!!errors.metaDescription}>
              <FieldLabel htmlFor="metaDescription">
                Meta description{" "}
                <span className={`ml-2 normal-case tracking-normal font-normal ${charCount > 160 ? "text-destructive" : "text-muted-foreground"}`}>
                  ({charCount}/160)
                </span>
              </FieldLabel>
              <Textarea
                id="metaDescription"
                rows={2}
                {...register("metaDescription")}
                placeholder="Descubre el secreto detrás del mollete perfecto…"
                className="resize-none"
                onChange={(e) => {
                  register("metaDescription").onChange(e)
                  setCharCount(e.target.value.length)
                }}
              />
              <FieldError>{errors.metaDescription?.message}</FieldError>
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Aparece en Google bajo el título. Máximo 160 caracteres.
              </span>
            </Field>

            {/* Tags */}
            <Field data-invalid={!!(errors.tags as { message?: string } | undefined)?.message}>
              <FieldLabel>
                Tags{" "}
                <span className="ml-2 normal-case text-muted-foreground tracking-normal font-normal">
                  ({tags.length})
                </span>
              </FieldLabel>
              <div className="flex flex-col gap-2">
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-muted text-muted-foreground text-[10px] uppercase tracking-[0.15em] px-2 py-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(idx)}
                          className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                        >
                          <IconX size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                    placeholder="cafetería, molletes…"
                    className="flex-1"
                    aria-invalid={!!errors.tags}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 bg-muted hover:bg-muted/80 text-muted-foreground text-[10px] uppercase tracking-[0.2em] transition-colors cursor-pointer shrink-0"
                  >
                    <IconPlus size={13} />
                  </button>
                </div>
              </div>
              <FieldError>{(errors.tags as { message?: string } | undefined)?.message}</FieldError>
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Presiona Enter o la coma para agregar
              </span>
            </Field>

            <Field data-invalid={!!errors.publishedAt}>
              <FieldLabel htmlFor="publishedAt">Fecha de publicación</FieldLabel>
              <Input
                id="publishedAt"
                type="datetime-local"
                {...register("publishedAt")}
                className="scheme-light dark:scheme-dark"
              />
              <FieldError>{errors.publishedAt?.message}</FieldError>
            </Field>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-5 mt-8 lg:mt-0">
            <SectionTitle>Imágenes</SectionTitle>

            <Field data-invalid={!!errors.coverImage}>
              <FieldLabel>Imagen de portada</FieldLabel>
              <Controller
                control={control}
                name="coverImage"
                render={({ field }) => (
                  <ImageUpload value={field.value} onChange={field.onChange} folder="blog/covers" />
                )}
              />
              <FieldError>{errors.coverImage?.message}</FieldError>
            </Field>

            <Field data-invalid={!!(errors.gallery as { message?: string } | undefined)?.message}>
              <FieldLabel>
                Galería{" "}
                <span className="ml-2 normal-case text-muted-foreground tracking-normal font-normal">
                  ({gallery.length} imagen{gallery.length !== 1 ? "es" : ""})
                </span>
              </FieldLabel>
              {gallery.length > 0 && (
                <div className="flex flex-col gap-2 mb-2">
                  {gallery.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 border border-border bg-muted/40">
                      <div className="w-12 h-12 rounded overflow-hidden shrink-0">
                        <img src={url} alt={`Galería ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                      <span className="flex-1 text-xs text-muted-foreground font-mono truncate">{url}</span>
                      <button
                        type="button"
                        onClick={() => removeFromGallery(idx)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer shrink-0"
                        aria-label="Quitar imagen"
                      >
                        <IconX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <ImageUpload folder="blog/gallery" value="" onChange={addToGallery} />
              <FieldError>{(errors.gallery as { message?: string } | undefined)?.message}</FieldError>
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Cada subida agrega una imagen a la galería
              </span>
            </Field>
          </div>
        </div>

        {/* ── SECTIONS ── */}
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Secciones de contenido
            </span>
            <Separator className="flex-1" />
            <button
              type="button"
              onClick={() => append({ type: "text", heading: "", body: "" })}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground border border-border hover:border-foreground px-3 py-1.5 transition-colors cursor-pointer"
            >
              <IconPlus size={11} /> Agregar sección
            </button>
          </div>

          {(errors.sections as { message?: string } | undefined)?.message && (
            <p className="text-destructive text-xs mb-4">
              {(errors.sections as { message?: string }).message}
            </p>
          )}

          <div className="flex flex-col gap-4">
            {sectionFields.map((field, idx) => {
              const sectionType = watch(`sections.${idx}.type`)
              return (
                <div key={field.id} className="border border-border bg-card p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <IconGripVertical size={14} className="text-muted-foreground shrink-0" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
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
                              ? "bg-foreground text-background"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
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
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          <IconChevronUp size={14} />
                        </button>
                      )}
                      {idx < sectionFields.length - 1 && (
                        <button
                          type="button"
                          onClick={() => move(idx, idx + 1)}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          <IconChevronDown size={14} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                        aria-label="Eliminar sección"
                      >
                        <IconX size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {sectionType !== "image" && (
                      <Field>
                        <FieldLabel htmlFor={`sections-${idx}-heading`}>
                          Encabezado (opcional)
                        </FieldLabel>
                        <Input
                          id={`sections-${idx}-heading`}
                          {...register(`sections.${idx}.heading`)}
                          placeholder="Encabezado de sección"
                        />
                      </Field>
                    )}

                    {(sectionType === "text" || sectionType === "quote") && (
                      <Field data-invalid={!!(errors.sections?.[idx] as { body?: { message?: string } } | undefined)?.body?.message}>
                        <FieldLabel htmlFor={`sections-${idx}-body`}>
                          {sectionType === "quote" ? "Cita" : "Cuerpo"}
                        </FieldLabel>
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
                          <Textarea
                            id={`sections-${idx}-body`}
                            {...register(`sections.${idx}.body`)}
                            rows={3}
                            placeholder='"El mollete es más que un platillo…"'
                            className="resize-none"
                          />
                        )}
                        <FieldError>
                          {(errors.sections?.[idx] as { body?: { message?: string } } | undefined)?.body?.message}
                        </FieldError>
                      </Field>
                    )}

                    {sectionType === "image" && (
                      <Field data-invalid={!!(errors.sections?.[idx] as { image?: { message?: string } } | undefined)?.image?.message}>
                        <FieldLabel>Imagen</FieldLabel>
                        <Controller
                          control={control}
                          name={`sections.${idx}.image`}
                          render={({ field }) => (
                            <ImageUpload
                              value={field.value ?? ""}
                              onChange={field.onChange}
                              folder="blog/sections"
                            />
                          )}
                        />
                        <FieldError>
                          {(errors.sections?.[idx] as { image?: { message?: string } } | undefined)?.image?.message}
                        </FieldError>
                      </Field>
                    )}

                    {sectionType === "cta" && (
                      <div className="flex flex-col gap-3 p-4 bg-muted/40 border border-border">
                        <Field data-invalid={!!(errors.sections?.[idx] as { buttonLabel?: { message?: string } } | undefined)?.buttonLabel?.message}>
                          <FieldLabel htmlFor={`sections-${idx}-buttonLabel`}>
                            Texto del botón
                          </FieldLabel>
                          <Input
                            id={`sections-${idx}-buttonLabel`}
                            {...register(`sections.${idx}.buttonLabel`)}
                            placeholder="Reserva tu mesa"
                          />
                          <FieldError>
                            {(errors.sections?.[idx] as { buttonLabel?: { message?: string } } | undefined)?.buttonLabel?.message}
                          </FieldError>
                        </Field>

                        <Field data-invalid={!!(errors.sections?.[idx] as { buttonUrl?: { message?: string } } | undefined)?.buttonUrl?.message}>
                          <FieldLabel htmlFor={`sections-${idx}-buttonUrl`}>
                            URL del botón
                          </FieldLabel>
                          <Input
                            id={`sections-${idx}-buttonUrl`}
                            {...register(`sections.${idx}.buttonUrl`)}
                            placeholder="https://…"
                          />
                          <FieldError>
                            {(errors.sections?.[idx] as { buttonUrl?: { message?: string } } | undefined)?.buttonUrl?.message}
                          </FieldError>
                        </Field>

                        <Field>
                          <FieldLabel htmlFor={`sections-${idx}-body-cta`}>
                            Cuerpo (opcional)
                          </FieldLabel>
                          <Textarea
                            id={`sections-${idx}-body-cta`}
                            {...register(`sections.${idx}.body`)}
                            rows={2}
                            placeholder="Texto de apoyo bajo el encabezado…"
                            className="resize-none"
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
      </form>
    </AdminFormLayout>
  )
}