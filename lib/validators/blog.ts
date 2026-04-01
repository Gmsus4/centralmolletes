import { z } from "zod"

const urlRegex = /^https?:\/\/.+/

export const SectionSchema = z.discriminatedUnion("type", [
  z.object({
    type:    z.literal("text"),
    heading: z.string().max(200).optional(),
    body:    z.string().max(5000).optional(),
  }),
  z.object({
    type:    z.literal("image"),
    heading: z.string().max(200).optional(),
    image:   z.string().url("URL de imagen inválida").optional(),
  }),
  z.object({
    type:    z.literal("quote"),
    heading: z.string().max(200).optional(),
    body:    z.string().max(5000).optional(),
  }),
  z.object({
    type:        z.literal("cta"),
    heading:     z.string().max(200).optional(),
    body:        z.string().max(500).optional(),
    buttonLabel: z.string().max(80).optional(),
    buttonUrl:   z.string().url("URL inválida").optional(),
  }),
])

export const BlogSchema = z.object({
  slug:            z.string().min(1, "El slug es obligatorio").max(100).regex(
                     /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                     "Solo letras minúsculas, números y guiones"
                   ),
  title:           z.string().min(1, "El título es obligatorio").max(200),
  subtitle:        z.string().min(1, "El subtítulo es obligatorio").max(300),
  coverImage:      z.string().min(1, "La imagen de portada es obligatoria").regex(urlRegex, "URL inválida"),
  gallery:         z.array(z.string().url("URL de galería inválida")).optional(),
  category:        z.string().min(1, "La categoría es obligatoria").max(100),
  tags:            z.array(z.string().min(1).max(50)).min(1, "Agrega al menos un tag"),
  sections:        z.array(SectionSchema).min(1, "Agrega al menos una sección"),
  status:          z.enum(["draft", "published", "scheduled"]),
  author:          z.string().max(100).optional(),
  metaDescription: z.string().max(160, "Máximo 160 caracteres").optional(),
  publishedAt:     z.string().optional(),
})

export type BlogFormValues = z.infer<typeof BlogSchema>
export type BlogSection    = z.infer<typeof SectionSchema>
export type BlogStatus     = "draft" | "published" | "scheduled"